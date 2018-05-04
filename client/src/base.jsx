import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'select2/dist/js/select2.full';
import 'select2/dist/css/select2.min.css';

import { Menu } from '@ridi/cms-ui';
import './base.css';

ReactDOM.render(
  <Menu items={window.menuItems} />,
  document.getElementById('menu_container'),
);
