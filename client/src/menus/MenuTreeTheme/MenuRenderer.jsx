import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import { Button } from 'react-bootstrap';
import AutosizeInput from 'react-input-autosize';
import './MenuRenderer.css';

const PropTextInput = ({ node, path, propKey, className, children, onChange, ...props }) => (
  <div className={cn(_.snakeCase(propKey), 'prop_text_input', className)} {...props}>
    <AutosizeInput
      value={node[propKey]}
      onChange={(event) => onChange({
        ...node,
        [propKey]: event.target.value,
      }, path)}
    />
    {children}
  </div>
);

const PropCheckbox = ({ node, path, propKey, className, children, onChange, ...props }) => (
  <label className={cn(_.snakeCase(propKey), 'prop_checkbox', className)} {...props}>
    <input
      type="checkbox"
      checked={node[propKey]}
      onChange={(event) => onChange({
        ...node,
        [propKey]: event.target.checked,
      }, path)}
    />
    {children}
  </label>
);

const Index = ({
  node,
  path,
  onChange,
  onShowSubmenusButtonClick,
  onShowUsersButtonClick,
  ...props
}) => {
  const inputProps = {
    node,
    path,
    onChange,
  };

  return (
    <div
      className={cn(
        'menu_tree__menu',
        `depth_${node.depth}`,
        {
          is_new_tab: node.isNewTab,
          is_use: node.isUse,
          is_show: node.isShow,
        },
      )}
      {...props}
    >
      <div className="title_container">
        <PropTextInput {...inputProps} propKey="title" />
        <PropTextInput {...inputProps} propKey="url" />
      </div>

      <div className="checkbox-group">
        <PropCheckbox {...inputProps} propKey="isNewTab">새 탭</PropCheckbox>
        <PropCheckbox {...inputProps} propKey="isUse">사용</PropCheckbox>
        <PropCheckbox {...inputProps} propKey="isShow">노출</PropCheckbox>
      </div>
      <div className="button-group btn-group-xs">
        <Button onClick={() => onShowSubmenusButtonClick(node)}>Ajax 관리</Button>
        <Button onClick={() => onShowUsersButtonClick(node)}>사용자 보기</Button>
        <Button>태그 보기</Button>
      </div>
      <div className="message">
        {node.isCreated ? '추가 됨' : node.isUnsaved ? '변경 됨' : ''}
      </div>
    </div>
  );
};

Index.propTypes = {
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,

  onChange: PropTypes.func.isRequired,
  onShowSubmenusButtonClick: PropTypes.func.isRequired,
  onShowUsersButtonClick: PropTypes.func.isRequired,
};

export default Index;
