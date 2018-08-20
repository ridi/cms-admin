import React from 'react';
import ReactDOM from 'react-dom';
import '../base';
import Menus from './Menus';
import './index.css';

ReactDOM.render(
  <Menus />,
  document.getElementById('content'),
);

if (module.hot) {
  module.hot.accept();
}
