import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
import AutosizeInput from 'react-input-autosize';
import './index.css';

const itemShape = {
  id: PropTypes.number,
  title: PropTypes.string,
  url: PropTypes.string,
  depth: PropTypes.number,
  order: PropTypes.number,
  isUse: PropTypes.bool,
  isNewTab: PropTypes.bool,
  isShow: PropTypes.bool,
  isModified: PropTypes.bool,
};
itemShape.children = PropTypes.arrayOf(PropTypes.shape(itemShape));
const itemType = PropTypes.shape(itemShape);

const getNodeKey = ({ node }) => node.id;

const NodePropTextInput = ({ node, updateNode, propKey, children }) => (
  <div>
    <AutosizeInput
      value={node[propKey]}
      onChange={(event) => updateNode({ [propKey]: event.target.value })}
    />
    {children}
  </div>
);

const NodePropCheckBox = ({ node, updateNode, propKey, children }) => (
  <label>
    <input
      type="checkbox"
      checked={node[propKey]}
      onChange={(event) => updateNode({ [propKey]: event.target.checked })}
    />
    {children}
  </label>
);

export default class MenuTree extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(itemType),
    onChange: PropTypes.func.isRequired,
  };

  generateNodeProps = ({ node, path }) => {
    const {
      items,
      onChange,
    } = this.props;

    const updateNode = (newNode) => {
      const newTreeData = changeNodeAtPath({
        treeData: items,
        path,
        newNode: { ...node, ...newNode },
        getNodeKey,
        ignoreCollapsed: false,
      });
      onChange(newTreeData);
    };

    return {
      className: cn(
        'item',
        `depth_${node.depth}`,
        {
          is_new_tab: node.isNewTab,
          is_use: node.isUse,
          is_show: node.isShow,
        },
      ),
      title: <NodePropTextInput node={node} updateNode={updateNode} propKey="title" />,
      subtitle: <NodePropTextInput node={node} updateNode={updateNode} propKey="url" />,
      buttons: [
        <div className="toolbar">
          <div className="checkbox-group">
            <NodePropCheckBox node={node} updateNode={updateNode} propKey="isNewTab">새 탭</NodePropCheckBox>
            <NodePropCheckBox node={node} updateNode={updateNode} propKey="isUse">사용</NodePropCheckBox>
            <NodePropCheckBox node={node} updateNode={updateNode} propKey="isShow">노출</NodePropCheckBox>
          </div>
          <div className="button-group btn-group-xs">
            <button className="btn btn-default">Ajax 관리</button>
            <button className="btn btn-default">사용자 보기</button>
            <button className="btn btn-default">태그 보기</button>
          </div>
          {node.isModified && (
            <div className="message">변경 됨</div>
          )}
        </div>,
      ],
    };
  };

  render = () => {
    const {
      items,
      onChange,
    } = this.props;

    return (
      <SortableTree
        className={cn('menu_tree')}
        treeData={items}
        rowHeight={70}
        onChange={onChange}
        getNodeKey={getNodeKey}
        generateNodeProps={this.generateNodeProps}
      />
    );
  };
}
