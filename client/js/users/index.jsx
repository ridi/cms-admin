import React from 'react';
import ReactDOM from 'react-dom';
import '../base';
import UserTable from './UserTable';

ReactDOM.render(
  <UserTable
    page={window.page}
    perPage={window.perPage}
    searchText={window.searchText}
  />,
  document.getElementById('content'),
);
