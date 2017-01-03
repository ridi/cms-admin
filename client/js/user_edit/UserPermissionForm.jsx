import React from 'react';
import axios from 'axios';
import Select2Input from './Select2Input';

class UserPermissionForm extends React.Component {
  constructor() {
    super();

    this.state = {
      tagFetching: true,
      tagList: [],
      menuFetching: true,
      menuList: []
    };
  }

  componentDidMount() {
    axios('/super/tags')
    .then((res) => {
      let data = res.data;
      this.setState(Object.assign({}, this.state, {
        tagList: data.map((tag) => {
          return { id: tag.id, text: tag.name };
        }),
        tagFetching: false
      }));
    })
    .catch((e) => {
      alert(e);
    });

    axios('/super/menus')
    .then((res) => {
      let data = res.data;
      this.setState(Object.assign({}, this.state, {
        menuList: data.map((menu) => {
          const menu_url_array = menu.menu_url.split('#');
          const text = menu.menu_title + (menu_url_array[1] ? '#' + menu_url_array[1] : '');
          return { id: menu.id, text: text };
        }),
        menuFetching: false
      }));
    })
    .catch((e) => {
      alert(e);
    });
  }

  render() {
    const { id, userTag, userMenu } = this.props;
    const { tagFetching, tagList, menuFetching, menuList } = this.state;

    return (
      <form className="form-horizontal" id="permissions" action={"/super/users/" + id + "/permissions"} method="POST">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">유저 권한 관리</h4>
          </div>
          <div className="panel-body">
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">메뉴</label>
              <div className="col-xs-10">
                <Select2Input fetching={tagFetching}
                              value={userTag}
                              data={tagList}
                              multiple={true}
                              placeholder="태그를 지정하세요"
                              tokenSeparators={[',', ' ']}/>
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">태그</label>
              <div className="col-xs-10">
                <Select2Input fetching={menuFetching}
                              value={userMenu}
                              data={menuList}
                              multiple={true}
                              placeholder="메뉴를 지정하세요"
                              tokenSeparators={[',', ' ']}/>
              </div>
            </div>

            <div className="btn-group btn-group-sm pull-right">
              <button type="submit" className="btn btn-default">
                <i className="glyphicon glyphicon-file"/> 저장
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default UserPermissionForm;
