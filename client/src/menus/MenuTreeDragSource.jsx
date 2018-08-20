import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { getPassThroughProps } from '../utils/component';
import { DragSourceType, MenuTreeItemType } from './MenuTree';

const dragSourceType = DragSourceType;
const dragSourceSpec = {
  beginDrag: props => ({
    node: { ...props.item },
  }),
};
const dragSourceCollector = (connect) => ({
  connectDragSource: connect.dragSource(),
});

class MenuTreeDragSource extends React.Component {
  render() {
    const { component: Component, children, connectDragSource } = this.props;

    return connectDragSource(
      <Component {...getPassThroughProps(this)}>{children}</Component>,
      { dropEffect: 'copy' },
    );
  }
}

MenuTreeDragSource.propTypes = {
  item: MenuTreeItemType.isRequired,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  connectDragSource: PropTypes.func.isRequired,
};

MenuTreeDragSource.defaultProps = {
  component: 'div',
  children: undefined,
};

export default DragSource(
  dragSourceType,
  dragSourceSpec,
  dragSourceCollector,
)(MenuTreeDragSource);
