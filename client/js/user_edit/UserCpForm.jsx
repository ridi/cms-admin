import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select2Input from '../Select2Input';

const PRODUCTION_CP_TYPE = 1;
const PARTNER_CP_TYPE = 2;
const OPERATOR_CP_TYPE = 3;

class UserCpForm extends React.Component {
  constructor() {
    super();

    this.handleCpAdd = this.handleCpAdd.bind(this);
    this.handleCpRemove = this.handleCpRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = {
      cpFetching: true,
      productionCpList: [],
      partnerCpList: [],
      operatorCpList: [],
      allCpList: [],
    };
  }

  componentDidMount() {
    Promise.all([
      this.getManagingCpList(PRODUCTION_CP_TYPE),
      this.getManagingCpList(PARTNER_CP_TYPE),
      this.getManagingCpList(OPERATOR_CP_TYPE),
      this.getCpList(),
    ]).then((res) => {
      const allCpList = [];
      const data = res[3].data.data;
      if (data.length !== 0) {
        for (let cp in data) {
          const pubId = data[cp].id;
          allCpList.push({ id: pubId, text: `${data[cp].name} (${pubId})` });
        }
      }

      this.setState({
        cpFetching: false,
        productionCpList: res[0].data.slice(),
        partnerCpList: res[1].data.slice(),
        operatorCpList: res[2].data.slice(),
        allCpList,
      });

    });
  }

  getManagingCpList(type) {
    return axios('/admin/publisher/managers.ajax', {
      params: {
        id: this.props.id,
        type,
      },
    });
  }

  getCpList() {
    return axios('/admin/comm/cp_list.ajax');
  }

  handleCpAdd(id, cpType) {
    let assigned;
    switch (cpType) {
      case PARTNER_CP_TYPE:
        assigned = {
          partnerCpList: this.state.partnerCpList.concat(id),
        };
        break;

      case OPERATOR_CP_TYPE:
        assigned = {
          operatorCpList: this.state.operatorCpList.concat(id),
        };
        break;

      case PRODUCTION_CP_TYPE:
        assigned = {
          productionCpList: this.state.productionCpList.concat(id),
        };
        break;

      default:
        assigned = this.state;
    }

    this.setState(Object.assign({}, this.state, assigned));
  }

  handleCpRemove(id, cpType) {
    let targetIndex;
    let assigned;

    switch (cpType) {
      case PARTNER_CP_TYPE:
        targetIndex = this.state.partnerCpList.indexOf(id);
        if (id === -1) {
          return;
        }

        assigned = {
          partnerCpList: this.state.partnerCpList.filter((_, i) => i !== targetIndex),
        };
        break;

      case OPERATOR_CP_TYPE:
        targetIndex = this.state.operatorCpList.indexOf(id);
        if (id === -1) {
          return;
        }

        assigned = {
          operatorCpList: this.state.operatorCpList.filter((_, i) => i !== targetIndex),
        };
        break;

      case PRODUCTION_CP_TYPE:
        targetIndex = this.state.productionCpList.indexOf(id);
        if (id === -1) {
          return;
        }

        assigned = {
          productionCpList: this.state.productionCpList.filter((_, i) => i !== targetIndex),
        };
        break;

      default:
        assigned = this.state;
    }

    this.setState(Object.assign({}, this.state, assigned));
  }

  handleSave() {
    const data = [
      { name: 'user_id', value: this.props.id },
      { name: 'partner_cp_ids', value: this.state.partnerCpList.join(',') },
      { name: 'operator_cp_ids', value: this.state.operatorCpList.join(',') },
      { name: 'production_cp_ids', value: this.state.productionCpList.join(',') },
    ];

    $.ajax({
      type: 'POST',
      url: '/admin/publisher/managers.update.ajax',
      data,
      cache: false,
      success: (res) => {
        if (res.success) {
          alert('성공적으로 업데이트 되었습니다.');
        } else {
          alert(res.message);
        }
      },
      error: (xhr) => {
        alert(xhr.responseText);
      },
    });
  }

  renderLoading() {
    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" style={{ width: '100%' }}>로딩중...</div>
      </div>
    );
  }

  renderInput(cpType) {
    let name;
    let value;

    switch(cpType) {
      case PARTNER_CP_TYPE:
        name = 'partner_cp_ids';
        value = this.state.partnerCpList;
        break;
      case OPERATOR_CP_TYPE:
        name = 'operator_cp_ids';
        value = this.state.operatorCpList;
        break;
      case PRODUCTION_CP_TYPE:
        name = 'production_cp_ids';
        value = this.state.productionCpList;
        break;
      default:
        name = 'unknown';
        value = [];
    }

    return (
      <Select2Input
        name={name}
        value={value}
        data={this.state.allCpList}
        multiple
        placeholder="담당할 CP를 입력하세요."
        disabled={!this.props.id}
        onAdd={(id) => { this.handleCpAdd(id, cpType); }}
        onRemove={(id) => { this.handleCpRemove(id, cpType); }}
      />
    );
  }

  render() {
    const { id } = this.props;
    const { cpFetching } = this.state;

    return (
      <form className="form-horizontal" id="managing-cps" method="POST">
        <input type="hidden" name="user_id" value={id}/>
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">담당 CP 관리</h4>
          </div>

          <div className="panel-body">
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">제휴담당 CP</label>
              <div className="col-xs-10">
                { cpFetching ? this.renderLoading() : this.renderInput(PARTNER_CP_TYPE) }
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">운영담당 CP</label>
              <div className="col-xs-10">
                { cpFetching ? this.renderLoading() : this.renderInput(OPERATOR_CP_TYPE) }
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">제작 CP</label>
              <div className="col-xs-10">
                { cpFetching ? this.renderLoading() : this.renderInput(PRODUCTION_CP_TYPE) }
              </div>
            </div>

            <div className="btn-group btn-group-sm pull-right">
              <a id="js_cp_update" className="btn btn-default" onClick={this.handleSave}>
                <i className="glyphicon glyphicon-file" /> 저장
              </a>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

UserCpForm.propTypes = {
  id: PropTypes.string.isRequired,
};

export default UserCpForm;
