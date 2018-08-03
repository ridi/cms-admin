import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  SortableTreeWithoutDndContext as SortableTree,
  map,
  changeNodeAtPath,
  removeNodeAtPath,
} from 'react-sortable-tree';
import { getPassThroughProps } from '../utils/component';
import MenuTreeTheme from './MenuTreeTheme';
import MenuRenderer from './MenuRenderer';

export const DragSourceType = 'MenuTreeItem';

const MenuTreeItemShape = {
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
MenuTreeItemShape.children = PropTypes.arrayOf(PropTypes.shape(MenuTreeItemShape));
export const MenuTreeItemType = PropTypes.shape(MenuTreeItemShape);

export default class MenuTree extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(MenuTreeItemType),
    onChange: PropTypes.func.isRequired,
    onShowSubmenusButtonClick: PropTypes.func.isRequired,
    onShowUsersButtonClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
  };

  getNodeKey = ({ node }) => node.id;

  onChange = (treeData) => {
    const depthAndOrderUpdater = ({ node, path, treeIndex }) => ({
      ...node,
      depth: path.length - 1,
      order: treeIndex,
    });

    const depthAndOrderCorrectedTreeData = map({
      treeData,
      getNodeKey: this.getNodeKey,
      ignoreCollapsed: false,
      callback: depthAndOrderUpdater,
    });

    this.props.onChange(depthAndOrderCorrectedTreeData);
  };

  updateNode = (node, path) => {
    const newTreeData = changeNodeAtPath({
      treeData: this.props.items,
      path,
      newNode: node,
      getNodeKey: this.getNodeKey,
      ignoreCollapsed: false,
    });

    this.onChange(newTreeData);
  };

  removeNode = (node, path) => {
    const newTreeData = removeNodeAtPath({
      treeData: this.props.items,
      path,
      getNodeKey: this.getNodeKey,
      ignoreCollapsed: false,
    });

    this.onChange(newTreeData);
  };

  generateNodeProps = ({ node, path }) => {
    return {
      contentRenderer: MenuRenderer,
      contentRendererProps: {
        node,
        path,
        onChange: this.updateNode,
        onShowSubmenusButtonClick: this.props.onShowSubmenusButtonClick,
        onShowUsersButtonClick: this.props.onShowUsersButtonClick,
        onRemoveButtonClick: this.removeNode,
      },
    };
  };

  render = () => {
    return (
      <SortableTree
        className={cn('menu_tree')}
        treeData={this.props.items}
        theme={MenuTreeTheme}
        dndType={DragSourceType}
        onChange={this.onChange}
        getNodeKey={this.getNodeKey}
        generateNodeProps={this.generateNodeProps}
        {...getPassThroughProps(this)}
      />
    );
  };
}
