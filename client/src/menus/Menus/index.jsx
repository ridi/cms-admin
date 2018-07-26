import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MenuTree from '../MenuTree';
import { mapMenuToRawMenu, mapRawMenuToMenu } from './menuMapper';
import { buildMenuTrees, flattenMenuTrees } from './treeBuilder';
import './index.css';

const mapRawMenusToMenuTreeItems = (rawMenus) => {
  const menus = _.map(rawMenus, mapRawMenuToMenu);
  return buildMenuTrees(menus);
};

export default class Menus extends React.Component {
  state = {
    menuDict: _.keyBy(_.map(this.props.menus, mapRawMenuToMenu), 'id'),
    menuTreeItems: mapRawMenusToMenuTreeItems(this.props.menus),
  };

  onMenuTreeItemsChange = (menuTreeItems) => {
    const menus = flattenMenuTrees(menuTreeItems);

    const modificationCheckedMenus = _.map(menus, menu => {
      const originalMenu = this.state.menuDict[menu.id];
      const isModified = _.some(_.keys(originalMenu), key => (
        menu[key] !== originalMenu[key]
      ));
      return {
        ...menu,
        isModified,
      };
    });

    this.setState({ menuTreeItems: buildMenuTrees(modificationCheckedMenus) });
  };

  render = () => {
    return (
      <div className="menus">
        <MenuTree
          items={this.state.menuTreeItems}
          onChange={this.onMenuTreeItemsChange}
        />

        <div className="toolbar btn-group-sm">
          <button className="btn btn-primary">저장</button>
        </div>
      </div>
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
