import React from 'react';
import axios from 'axios';
import Select2Input from './Select2Input';

class UserCpForm extends React.Component {
  constructor() {
    super();

    this.state = {
      partnerCpFetching: true,
      partnerCpList: [],
      operatorCpFetching: true,
      operatorCpList: [],
      productionCpFetching: true,
      productionCpList: [],
      allCpList: []
    };
  }

  getManagingCpList(type) {
    return axios({
      url: '/admin/publisher/managers.ajax',
      params: {
        id: this.props.admin_id,
        type: type
      }
    });
  }

  getCpList() {
    return axios({
      url: '/admin/comm/cp_list.ajax'
    });
  }

  componentDidMount() {

    this.getCpList()
    .then((res) => {

      let cpList = [];
      var data = res.data.data;
      if (data.length !== 0) {
        for (var cp in data) {
          var pubId = data[cp].id;
          cpList.push({ id: pubId, text: data[cp].name + ' (' + pubId + ')' });
        }
      }

      this.setState(Object.assign({}, this.state, {
        allCpList: cpList
      }));


      this.getManagingCpList(1)
      .then((res) => {
        this.setState(Object.assign({}, this.state, {
          productionCpFetching: false,
          productionCpList: res.data
        }));
      });

      this.getManagingCpList(2)
      .then((res) => {
        this.setState(Object.assign({}, this.state, {
          partnerCpFetching: false,
          partnerCpList: res.data
        }));
      });

      this.getManagingCpList(3)
      .then((res) => {
        this.setState(Object.assign({}, this.state, {
          operatorCpFetching: false,
          operatorCpList: res.data
        }));
      });

    });
  }

  render() {
    const { id } = this.props;
    const {
      partnerCpFetching,
      partnerCpList,
      operatorCpFetching,
      operatorCpList,
      productionCpFetching,
      productionCpList,
      allCpList
    } = this.state;

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
                <Select2Input fetching={partnerCpFetching}
                              value={partnerCpList}
                              data={allCpList}
                              multiple={true}
                              placeholder="담당할 CP를 입력하세요."
                              tokenSeparators={[',', ' ', '\t', '\n', '\r\n']}/>
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">운영담당 CP</label>
              <div className="col-xs-10">
                <Select2Input fetching={operatorCpFetching}
                              value={operatorCpList}
                              data={allCpList}
                              multiple={true}
                              placeholder="담당할 CP를 입력하세요."
                              tokenSeparators={[',', ' ', '\t', '\n', '\r\n']}/>
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">제작 CP</label>
              <div className="col-xs-10">
                <Select2Input fetching={productionCpFetching}
                              value={productionCpList}
                              data={allCpList}
                              multiple={true}
                              placeholder="담당할 CP를 입력하세요."
                              tokenSeparators={[',', ' ', '\t', '\n', '\r\n']}/>
              </div>
            </div>

            <div className="btn-group btn-group-sm pull-right">
              <a id="js_cp_update" className="btn btn-default">
                <i className="glyphicon glyphicon-file"/> 저장
              </a>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default UserCpForm;
