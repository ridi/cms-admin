import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './TreeNodeRenderer.css';

class TreeNodeRenderer extends Component {
  render() {
    const {
      children,
      listIndex,
      swapFrom,
      swapLength,
      swapDepth,
      scaffoldBlockPxWidth,
      lowerSiblingCounts,
      connectDropTarget,
      isOver,
      draggedNode,
      canDrop,
      treeIndex,
      treeId, // Delete from otherProps
      getPrevRow, // Delete from otherProps
      node, // Delete from otherProps
      path, // Delete from otherProps
      rowDirection,
      ...otherProps
    } = this.props;

    const rowDirectionClass = rowDirection === 'rtl' ? 'stt__rtl' : null;

    // Construct the scaffold representing the structure of the tree
    const scaffoldBlockCount = lowerSiblingCounts.length;
    const scaffold = [];
    lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
      let lineClass = '';
      if (lowerSiblingCount > 0) {
        // At this level in the tree, the nodes had sibling nodes further down

        if (listIndex === 0) {
          // Top-left corner of the tree
          // +-----+
          // |     |
          // |  +--+
          // |  |  |
          // +--+--+
          lineClass =
            'stt__lineHalfHorizontalRight stt__lineHalfVerticalBottom';
        } else if (i === scaffoldBlockCount - 1) {
          // Last scaffold block in the row, right before the row content
          // +--+--+
          // |  |  |
          // |  +--+
          // |  |  |
          // +--+--+
          lineClass = 'stt__lineHalfHorizontalRight stt__lineFullVertical';
        } else {
          // Simply connecting the line extending down to the next sibling on this level
          // +--+--+
          // |  |  |
          // |  |  |
          // |  |  |
          // +--+--+
          lineClass = 'stt__lineFullVertical';
        }
      } else if (listIndex === 0) {
        // Top-left corner of the tree, but has no siblings
        // +-----+
        // |     |
        // |  +--+
        // |     |
        // +-----+
        lineClass = 'stt__lineHalfHorizontalRight';
      } else if (i === scaffoldBlockCount - 1) {
        // The last or only node in this level of the tree
        // +--+--+
        // |  |  |
        // |  +--+
        // |     |
        // +-----+
        lineClass = 'stt__lineHalfVerticalTop stt__lineHalfHorizontalRight';
      }

      scaffold.push(
        <div
          key={`pre_${1 + i}`}
          style={{ width: scaffoldBlockPxWidth }}
          className={cn('stt__lineBlock', lineClass, rowDirectionClass)}
        />,
      );

      if (treeIndex !== listIndex && i === swapDepth) {
        // This row has been shifted, and is at the depth of
        // the line pointing to the new destination
        let highlightLineClass = '';

        if (listIndex === swapFrom + swapLength - 1) {
          // This block is on the bottom (target) line
          // This block points at the target block (where the row will go when released)
          highlightLineClass = 'stt__highlightBottomLeftCorner';
        } else if (treeIndex === swapFrom) {
          // This block is on the top (source) line
          highlightLineClass = 'stt__highlightTopLeftCorner';
        } else {
          // This block is between the bottom and top
          highlightLineClass = 'stt__highlightLineVertical';
        }

        let style;
        if (rowDirection === 'rtl') {
          style = {
            width: scaffoldBlockPxWidth,
            right: scaffoldBlockPxWidth * i,
          };
        } else {
          // Default ltr
          style = {
            width: scaffoldBlockPxWidth,
            left: scaffoldBlockPxWidth * i,
          };
        }

        scaffold.push(
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            style={style}
            className={cn(
              'stt__absoluteLineBlock',
              highlightLineClass,
              rowDirectionClass,
            )}
          />,
        );
      }
    });

    let style;
    if (rowDirection === 'rtl') {
      style = { right: scaffoldBlockPxWidth * scaffoldBlockCount };
    } else {
      // Default ltr
      style = { left: scaffoldBlockPxWidth * scaffoldBlockCount };
    }

    return connectDropTarget(
      <div
        {...otherProps}
        className={cn('stt__node', rowDirectionClass)}
      >
        {scaffold}

        <div className="stt__nodeContent" style={style}>
          {Children.map(children, child =>
            cloneElement(child, {
              isOver,
              canDrop,
              draggedNode,
            }),
          )}
        </div>
      </div>,
    );
  }
}

TreeNodeRenderer.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null,
  rowDirection: 'ltr',
};

TreeNodeRenderer.propTypes = {
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,
  swapFrom: PropTypes.number,
  swapDepth: PropTypes.number,
  swapLength: PropTypes.number,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,

  listIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,

  // Drop target
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  draggedNode: PropTypes.shape({}),

  // used in dndManager
  getPrevRow: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,

  // rtl support
  rowDirection: PropTypes.string,
};

export default TreeNodeRenderer;
