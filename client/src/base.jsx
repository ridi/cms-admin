import React from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
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

$(() => {
  const $menuSelect = $('.menu_select');
  $menuSelect.select2({
    placeholder: '메뉴를 검색하세요',
  });

  $menuSelect.on('select2:select', (e) => {
    window.location.href = e.params.data.id;
  });
});
