import React from 'react';
import ReactDOM from 'react-dom';
import '../base';
import LogApp from './LogApp';

ReactDOM.render(
  <LogApp />,
  document.getElementById('content'),
);

if (module.hot) {
  module.hot.accept();
}
