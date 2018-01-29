import 'babel-polyfill';
import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select2Input from '../Select2Input';

const PRODUCTION_CP_TYPE = 1;
const PARTNER_CP_TYPE = 2;
const OPERATOR_CP_TYPE = 3;

class UserCpForm extends React.Component {
  static async getCpList() {
    const { data: res } = await axios('/admin/comm/cp_list.ajax');
    if (res.data) {
      return res.data.map(cp => ({ id: cp.id, text: `${cp.name} (${cp.id})` }));
    }

    return [];
  }

  static renderLoading() {
    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" style={{ width: '100%' }}>로딩중...</div>
      </div>
    );
  }

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

  async componentDidMount() {
    await this.updateCp();
  }

  async getManagingCpList(type) {
    const { data } = await axios('/admin/publisher/managers.ajax', {
      params: {
        id: this.props.id,
        type,
      },
    });

    return data;
  }

  async updateCp() {
    const [productionCpList, partnerCpList, operatorCpList, allCpList] = await Promise.all([
      this.getManagingCpList(PRODUCTION_CP_TYPE),
      this.getManagingCpList(PARTNER_CP_TYPE),
      this.getManagingCpList(OPERATOR_CP_TYPE),
      this.getCpList(),
    ]);

    this.setState({
      cpFetching: false,
      productionCpList,
      partnerCpList,
      operatorCpList,
      allCpList,
    });
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

  renderInput(id, cpType) {
    let value;

    switch (cpType) {
      case PARTNER_CP_TYPE:
        value = this.state.partnerCpList;
        break;
      case OPERATOR_CP_TYPE:
        value = this.state.operatorCpList;
        break;
      case PRODUCTION_CP_TYPE:
        value = this.state.productionCpList;
        break;
      default:
        value = [];
    }

    return (
      <Select2Input
        id={id}
        value={value}
        data={this.state.allCpList}
        multiple
        placeholder="담당할 CP를 입력하세요."
        disabled={!this.props.id}
        onAdd={(dataId) => { this.handleCpAdd(dataId, cpType); }}
        onRemove={(dataId) => { this.handleCpRemove(dataId, cpType); }}
      />
    );
  }

  render() {
    const { id } = this.props;
    const { cpFetching } = this.state;

    return (
      <form className="form-horizontal" id="managing-cps" method="POST">
        <input type="hidden" name="user_id" value={id} />
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">담당 CP 관리</h4>
          </div>

          <div className="panel-body">
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label" htmlFor="partner_cp_ids">제휴담당 CP</label>
              <div className="col-xs-10">
                { cpFetching ? this.renderLoading() : this.renderInput('partner_cp_ids', PARTNER_CP_TYPE) }
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label" htmlFor="operator_cp_ids">운영담당 CP</label>
              <div className="col-xs-10">
                { cpFetching ? this.renderLoading() : this.renderInput('operator_cp_ids', OPERATOR_CP_TYPE) }
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label" htmlFor="production_cp_ids">제작 CP</label>
              <div className="col-xs-10">
                { cpFetching ? this.renderLoading() : this.renderInput('production_cp_ids', PRODUCTION_CP_TYPE) }
              </div>
            </div>

            <div className="btn-group btn-group-sm pull-right">
              <Button id="js_cp_update" className="btn btn-default" onClick={this.handleSave}>
                <i className="glyphicon glyphicon-file" /> 저장
              </Button>
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
