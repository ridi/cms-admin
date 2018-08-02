import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isDescendant } from 'react-sortable-tree';
import cn from 'classnames';
import './NodeContentRenderer.css';

class NodeContentRenderer extends Component {
  render() {
    const {
      // DnD props
      connectDragPreview,
      connectDragSource,
      isDragging,
      didDrop,
      draggedNode,
      isOver, // Not needed, but preserved for other renderers
      canDrop,

      // Shared props
      treeIndex,
      scaffoldBlockPxWidth,
      node,
      path,
      treeId,
      rowDirection,

      // Node props
      parentNode, // Needed for dndManager
      isSearchMatch,
      isSearchFocus,
      canDrag,
      toggleChildrenVisibility,

      // Content renderer props
      contentRenderer,
      contentRendererProps,

      ...otherProps
    } = this.props;
    const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;

    let handle;
    if (canDrag) {
      if (typeof node.children === 'function' && node.expanded) {
        // Show a loading symbol on the handle when the children are expanded
        //  and yet still defined by a function (a callback to fetch the children)
        handle = (
          <div className="rst__loadingHandle">
            <div className="rst__loadingCircle">
              {[...new Array(12)].map((_, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className={cn(
                    'rst__loadingCirclePoint',
                    rowDirectionClass,
                  )}
                />
              ))}
            </div>
          </div>
        );
      } else {
        // Show the handle used to initiate a drag-and-drop
        handle = connectDragSource(<div className="rst__moveHandle" />, {
          dropEffect: 'copy',
        });
      }
    }

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;

    let buttonStyle = { left: -0.5 * scaffoldBlockPxWidth };
    if (rowDirection === 'rtl') {
      buttonStyle = { right: -0.5 * scaffoldBlockPxWidth };
    }

    const ContentRenderer = contentRenderer;

    return (
      <div style={{ height: '100%' }} {...otherProps}>
        {toggleChildrenVisibility &&
        node.children &&
        (node.children.length > 0 || typeof node.children === 'function') && (
          <div>
            <button
              type="button"
              aria-label={node.expanded ? 'Collapse' : 'Expand'}
              className={cn(
                node.expanded ? 'rst__collapseButton' : 'rst__expandButton',
                rowDirectionClass,
              )}
              style={buttonStyle}
              onClick={() =>
                toggleChildrenVisibility({
                  node,
                  path,
                  treeIndex,
                })
              }
            />

            {node.expanded &&
            !isDragging && (
              <div
                style={{ width: scaffoldBlockPxWidth }}
                className={cn(
                  'rst__lineChildren',
                  rowDirectionClass,
                )}
              />
            )}
          </div>
        )}

        <div className={cn('rst__rowWrapper', rowDirectionClass)}>
          {/* Set the row preview to be used during drag and drop */}
          {connectDragPreview(
            <div
              className={cn(
                'rst__row',
                isLandingPadActive && 'rst__rowLandingPad',
                isLandingPadActive && !canDrop && 'rst__rowCancelPad',
                isSearchMatch && 'rst__rowSearchMatch',
                isSearchFocus && 'rst__rowSearchFocus',
                rowDirectionClass,
              )}
              style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
              }}
            >
              {handle}

              <div
                className={cn(
                  'rst__rowContents',
                  !canDrag && 'rst__rowContentsDragDisabled',
                  rowDirectionClass,
                )}
              >
                <ContentRenderer {...contentRendererProps} />
              </div>
            </div>,
          )}
        </div>
      </div>
    );
  }
}

NodeContentRenderer.propTypes = {
  // DnD props
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  didDrop: PropTypes.bool.isRequired,
  draggedNode: PropTypes.shape({}),
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,

  // Shared props
  treeIndex: PropTypes.number.isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  treeId: PropTypes.string.isRequired,
  rowDirection: PropTypes.string, // rtl support

  // Node props
  parentNode: PropTypes.shape({}), // Needed for dndManager
  isSearchMatch: PropTypes.bool,
  isSearchFocus: PropTypes.bool,
  canDrag: PropTypes.bool,
  toggleChildrenVisibility: PropTypes.func,

  // Content renderer props
  contentRenderer: PropTypes.func,
  contentRendererProps: PropTypes.shape({}),
};

NodeContentRenderer.defaultProps = {
  // DnD props
  draggedNode: null,
  canDrop: false,

  // Shared props
  rowDirection: 'ltr',

  // Node props
  parentNode: null,
  isSearchMatch: false,
  isSearchFocus: false,
  canDrag: false,
  toggleChildrenVisibility: null,

  // Content renderer props
  contentRenderer: () => {},
  contentRendererProps: undefined,
};

export default NodeContentRenderer;
