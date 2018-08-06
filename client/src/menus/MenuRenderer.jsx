import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import { Button, Label } from 'react-bootstrap';
import AutosizeInput from 'react-input-autosize';
import './MenuRenderer.css';

const PropTextInput = ({
  node,
  path,
  propKey,
  className,
  children,
  placeholder,
  onChange,
  ...props
}) => (
  <div className={cn(_.snakeCase(propKey), 'prop_text_input', className)} {...props}>
    <AutosizeInput
      value={node[propKey]}
      placeholder={placeholder}
      onChange={(event) => onChange({
        ...node,
        [propKey]: event.target.value,
      }, path)}
    />
    {children}
  </div>
);

const PropCheckbox = ({
  node,
  path,
  propKey,
  className,
  children,
  placeholder,
  onChange,
  ...props
}) => (
  <label className={cn(_.snakeCase(propKey), 'prop_checkbox', className)} {...props}>
    <input
      type="checkbox"
      checked={node[propKey]}
      placeholder={placeholder}
      onChange={(event) => onChange({
        ...node,
        [propKey]: event.target.checked,
      }, path)}
    />
    {children}
  </label>
);

const MenuRenderer = ({
  node,
  path,
  handle,
  onChange,
  onShowSubmenusButtonClick,
  onShowUsersButtonClick,
  onRemoveButtonClick,
  ...props
}) => {
  const inputProps = {
    node,
    path,
    onChange,
  };

  const className = cn(
    'menu_tree__menu',
    'panel',
    'panel-default', {
      is_new_tab: node.isNewTab,
      is_use: node.isUse,
      is_show: node.isShow,
    }, {
      created: node.isCreated,
      unsaved: node.isUnsaved,
    },
  );

  const message = node.isCreated ? '추가됨' : node.isUnsaved ? '변경됨' : '';

  return (
    <div className={className} {...props}>
      {handle}

      <div className="title_container">
        <PropTextInput {...inputProps} propKey="title" placeholder="메뉴 제목" />
        <PropTextInput {...inputProps} propKey="url" placeholder="메뉴 URL" />
      </div>

      <div className="checkbox-group">
        <PropCheckbox {...inputProps} propKey="isNewTab">새 탭</PropCheckbox>
        <PropCheckbox {...inputProps} propKey="isUse">사용</PropCheckbox>
        <PropCheckbox {...inputProps} propKey="isShow">노출</PropCheckbox>
      </div>
      <div className="button-group btn-group-xs">
        <Button onClick={() => onShowSubmenusButtonClick(node)}>Ajax 관리</Button>
        <Button onClick={() => onShowUsersButtonClick(node)}>사용자 보기</Button>
        {node.isCreated && (
          <Button bsStyle="danger" onClick={() => onRemoveButtonClick(node, path)}>삭제</Button>
        )}
      </div>
      {message && (
        <div className="message">
          {message}
        </div>
      )}
    </div>
  );
};

MenuRenderer.propTypes = {
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  handle: PropTypes.node.isRequired,

  onChange: PropTypes.func.isRequired,
  onShowSubmenusButtonClick: PropTypes.func.isRequired,
  onShowUsersButtonClick: PropTypes.func.isRequired,
  onRemoveButtonClick: PropTypes.func.isRequired,
};

export default MenuRenderer;
