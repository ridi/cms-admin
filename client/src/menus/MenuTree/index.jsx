import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import SortableTree, { map, changeNodeAtPath } from 'react-sortable-tree';
import { Button } from 'react-bootstrap';
import AutosizeInput from 'react-input-autosize';
import { getPassThroughProps } from '../../utils/component';
import NodeRenderer from './NodeRenderer';
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
  isUnsaved: PropTypes.bool,
  isCreated: PropTypes.bool,
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
    items: PropTypes.arrayOf(itemType).isRequired,
    onChange: PropTypes.func.isRequired,
    onShowSubmenusButtonClick: PropTypes.func.isRequired,
    onShowUsersButtonClick: PropTypes.func.isRequired,
  };

  onChange = (treeData) => {
    const {
      onChange,
    } = this.props;

    const mapper = ({
      node,
      path,
      treeIndex,
    }) => ({
      ...node,
      depth: path.length - 1,
      order: treeIndex,
    });

    const depthAndOrderCorrectedTreeData = map({
      treeData,
      getNodeKey,
      ignoreCollapsed: false,
      callback: mapper,
    });

    onChange(depthAndOrderCorrectedTreeData);
  };

  generateNodeProps = ({ node, path }) => {
    const {
      items,
      onShowSubmenusButtonClick,
      onShowUsersButtonClick,
    } = this.props;

    const updateNode = (newNode) => {
      const newTreeData = changeNodeAtPath({
        treeData: items,
        path,
        newNode: { ...node, ...newNode },
        getNodeKey,
        ignoreCollapsed: false,
      });
      this.onChange(newTreeData);
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
            <NodePropCheckBox node={node} updateNode={updateNode} propKey="isNewTab">새
              탭</NodePropCheckBox>
            <NodePropCheckBox node={node} updateNode={updateNode} propKey="isUse">사용</NodePropCheckBox>
            <NodePropCheckBox node={node} updateNode={updateNode} propKey="isShow">노출</NodePropCheckBox>
          </div>
          <div className="button-group btn-group-xs">
            <Button onClick={() => onShowSubmenusButtonClick(node)}>Ajax 관리</Button>
            <Button onClick={() => onShowUsersButtonClick(node)}>사용자 보기</Button>
            <Button>태그 보기</Button>
          </div>
          <div className="message">
            {node.isCreated ? '추가 됨' : node.isUnsaved ? '변경 됨' : ''}
          </div>
        </div>,
      ],
    };
  };

  render = () => {
    const {
      items,
    } = this.props;

    return (
      <SortableTree
        className={cn('menu_tree')}
        nodeContentRenderer={NodeRenderer}
        treeData={items}
        rowHeight={70}
        onChange={this.onChange}
        getNodeKey={getNodeKey}
        generateNodeProps={this.generateNodeProps}
        {...getPassThroughProps(this)}
      />
    );
  };
}
