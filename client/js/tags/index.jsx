import React from 'react';
import ReactDOM from 'react-dom';
import '../base';
import TagEdit from './TagEdit';

ReactDOM.render(
  <div>
    <TagEdit tags={window.tags} />
  </div>,
  document.getElementById('content')
);
