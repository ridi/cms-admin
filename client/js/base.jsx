import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import 'select2/dist/js/select2.full';
import 'select2/dist/css/select2.css';

$(() => {
  const $menuSelect = $('.menu_select');
  $menuSelect.select2({
    placeholder: '메뉴를 검색하세요',
  });

  $menuSelect.on('select2:select', (e) => {
    window.location.href = e.params.data.id;
  });
});
