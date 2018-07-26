import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MenuTree from './MenuTree';
import { mapRawMenuToMenu } from './menuMapper';
import { buildMenuTrees } from './treeBuilder';

const mapRawMenusToMenuTreeItems = (rawMenus) => {
  const menus = _.map(rawMenus, mapRawMenuToMenu);
  return buildMenuTrees(menus);
};

export default class Menus extends React.Component {
  state = {
    menuTreeItems: mapRawMenusToMenuTreeItems(this.props.menus),
  };

  onMenuTreeItemsChange = (menuTreeItems) => {
    this.setState({ menuTreeItems });
  };

  render = () => {
    return (
      <React.Fragment>
        <MenuTree
          items={this.state.menuTreeItems}
          onChange={this.onMenuTreeItemsChange}
        />
      </React.Fragment>
    );
  };
}

Menus.propTypes = {
  menus: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    menu_title: PropTypes.string,
    menu_url: PropTypes.string,
    menu_deep: PropTypes.number,
    menu_order: PropTypes.number,
    is_use: PropTypes.bool,
    is_show: PropTypes.bool,
    is_newtab: PropTypes.bool,
  })).isRequired,
};
