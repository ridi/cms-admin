import React from 'react';
import ReactDOM from 'react-dom';
import '../base';

import UserEditApp from './UserEditApp';

ReactDOM.render(
  <UserEditApp
    userDetail={window.userDetail}
    userTag={window.userTag}
    userMenu={window.userMenu}
    userGroup={window.userGroup}
  />,
  document.getElementById('content'),
);

if (module.hot) {
  module.hot.accept();
}
