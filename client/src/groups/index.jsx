import React from 'react';
import ReactDOM from 'react-dom';
import '../base';
import GroupApp from './GroupApp';

ReactDOM.render(
  <div>
    <GroupApp groups={window.groups} />
  </div>,
  document.getElementById('content'),
);

if (module.hot) {
  module.hot.accept();
}
