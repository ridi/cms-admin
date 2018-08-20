// Can override the following:
//
// style: PropTypes.shape({}),
// innerStyle: PropTypes.shape({}),
// reactVirtualizedListProps: PropTypes.shape({}),
// scaffoldBlockPxWidth: PropTypes.number,
// slideRegionSize: PropTypes.number,
// rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
// treeNodeRenderer: PropTypes.func,
// nodeContentRenderer: PropTypes.func,
// placeholderRenderer: PropTypes.func,

import treeNodeRenderer from './TreeNodeRenderer';
import nodeContentRenderer from './NodeContentRenderer';
import placeholderRenderer from './PlaceholderRenderer';

export default {
  treeNodeRenderer,
  nodeContentRenderer,
  placeholderRenderer,
  rowHeight: 70,
};
