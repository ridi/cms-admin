import '../base';
import React from 'react';
import ReactDOM from 'react-dom';

import UserDetailForm from './UserDetailForm';
import UserPermissionForm from './UserPermissionForm';
import UserCpForm from './UserCpForm';
ReactDOM.render(
  <div>
    <div className="col-xs-12 col-md-6">
      <UserDetailForm id={window.userDetail.id}
                      name={window.userDetail.name}
                      team={window.userDetail.team}
                      is_use={window.userDetail.is_use}/>
    </div>
    <div className="col-xs-12 col-md-6">
      <UserPermissionForm id={window.userDetail.id}
                          userTag={window.userTag===''? [] : window.userTag.split(',')}
                          userMenu={window.userMenu===''? [] : window.userMenu.split(',')}/>

      <UserCpForm id={window.userDetail.id}
                  admin_id={window.admin_id}/>
    </div>

    <div className="col-xs-12 pull-right">
      <a id="js_delete_admin" className="btn btn-default btn-danger pull-right">삭제</a>
    </div>
  </div>,
  document.getElementById('content')
);
