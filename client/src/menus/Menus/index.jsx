import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';
import { Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import { getPassThroughProps } from '../../utils/component';
import MenuTree from '../MenuTree';
import Submenus from '../Submenus';
import { mapMenuToRawMenu, mapRawMenuToMenu } from './menuMapper';
import { buildMenuTrees, flattenMenuTrees } from './treeBuilder';
import './index.css';

const mapRawMenusToMenuTreeItems = (rawMenus) => {
  const menus = _.map(rawMenus, mapRawMenuToMenu);
  const sortedMenus = _.sortBy(menus, ['order']);
  return buildMenuTrees(sortedMenus);
};

export default class Menus extends React.Component {
  state = {
    menuDict: _.keyBy(_.map(this.props.menus, mapRawMenuToMenu), 'id'),
    menuTreeItems: mapRawMenusToMenuTreeItems(this.props.menus),
    isFetching: false,
  };

  submenusModal = React.createRef();

  onAddMenuButtonClick = () => {
    const { menuTreeItems } = this.state;

    const newMenu = {
      id: -Date.now(), // temporary numeric id
      title: '새 메뉴',
      url: '#',
      depth: 0,
      order: 0,
      isUse: false,
      isNewTab: false,
      isShow: false,
    };

    this.onMenuTreeItemsChange([
      ...menuTreeItems,
      newMenu,
    ]);
  };

  onMenuTreeItemsChange = (menuTreeItems) => {
    const menus = flattenMenuTrees(menuTreeItems);

    const modificationCheckedMenus = _.map(menus, menu => {
      const originalMenu = this.state.menuDict[menu.id];

      const isUnsaved = !originalMenu || _.some(_.keys(originalMenu), key => (
        menu[key] !== originalMenu[key]
      ));

      const isCreated = !originalMenu;

      return {
        ...menu,
        isUnsaved,
        isCreated,
      };
    });

    this.setState({ menuTreeItems: buildMenuTrees(modificationCheckedMenus) });
  };

  onSaveButtonClick = () => {
    this.setState({ isFetching: true }, async () => {
      try {
        const menus = flattenMenuTrees(this.state.menuTreeItems);
        const unsavedMenus = _.filter(menus, menu => menu.isUnsaved);
        const unsavedRawMenus = _.map(unsavedMenus, mapMenuToRawMenu);
        await axios.put('/super/menus', unsavedRawMenus);
        window.location.reload();
      } finally {
        this.setState({ isFetching: false });
      }
    });
  };

  onSubmenusButtonClick = (menu) => {
    this.submenusModal.current.show(menu.id, menu.title);
  };

  render = () => {
    const {
      menuTreeItems,
      isFetching,
    } = this.state;

    return (
      <div className="menus" {...getPassThroughProps(this)}>
        <MenuTree
          items={menuTreeItems}
          onChange={this.onMenuTreeItemsChange}
          onSubmenusButtonClick={this.onSubmenusButtonClick}
        />

        <ButtonToolbar className="menus__toolbar">
          <Button
            bsStyle="success"
            disabled={isFetching}
            onClick={this.onAddMenuButtonClick}
          >
            <Glyphicon glyph="plus" /> 새 메뉴
          </Button>

          <Button
            bsStyle="primary"
            disabled={isFetching}
            onClick={this.onSaveButtonClick}
          >
            저장
          </Button>
        </ButtonToolbar>

        <Submenus ref={this.submenusModal} />
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
