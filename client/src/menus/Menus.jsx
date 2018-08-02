import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import { Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import { getPassThroughProps } from '../utils/component';
import SpinnerOverlay from '../components/SpinnerOverlay';
import MenuTree from './MenuTree';
import Submenus from './Submenus';
import MenuUsers from './MenuUsers';
import { mapMenuToRawMenu, mapRawMenuToMenu } from './menuMapper';
import { buildMenuTrees, flattenMenuTrees } from './menuTreeBuilder';
import './Menus.css';

export default class Menus extends React.Component {
  state = {
    menuDict: undefined,
    menuTreeItems: undefined,
    isFetching: false,
    menuUsers: {
      show: false,
      menuId: undefined,
    },
  };

  submenusModal = React.createRef();

  componentDidMount = async () => {
    await this.loadMenus();
  };

  loadMenus = () => new Promise((resolve) => {
    this.setState({ isFetching: true }, async () => {
      try {
        const { data: rawMenus } = await axios.get('/super/menus');

        const menuDict = _.keyBy(_.map(rawMenus, mapRawMenuToMenu), 'id');
        const menuTreeItems = this.mapRawMenusToMenuTreeItems(rawMenus);

        this.setState({
          menuDict,
          menuTreeItems,
        });
      } finally {
        this.setState({ isFetching: false }, resolve);
      }
    });
  });

  mapRawMenusToMenuTreeItems = (rawMenus) => {
    const menus = _.map(rawMenus, mapRawMenuToMenu);
    const sortedMenus = _.sortBy(menus, ['order']);
    return buildMenuTrees(sortedMenus);
  };

  onAddMenuButtonClick = () => {
    const { menuTreeItems } = this.state;

    const newMenu = {
      id: -Date.now(), // temporary numeric id
      title: '',
      url: '',
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
      const isCreated = !originalMenu;
      const isUnsaved = isCreated || _.some(originalMenu, (value, key) => (
        menu[key] !== value
      ));

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
        await this.loadMenus();
      } finally {
        this.setState({ isFetching: false });
      }
    });
  };

  onShowSubmenusButtonClick = (menu) => {
    this.submenusModal.current.show(menu.id, menu.title);
  };

  onShowUsersButtonClick = (menu) => {
    this.setState({
      menuUsers: {
        show: true,
        menuId: menu.id,
      },
    });
  };

  onHideUsersButtonClick = () => {
    this.setState({
      menuUsers: {
        show: false,
        menuId: undefined,
      },
    });
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
          onShowSubmenusButtonClick={this.onShowSubmenusButtonClick}
          onShowUsersButtonClick={this.onShowUsersButtonClick}
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
        <MenuUsers
          menuId={this.state.menuUsers.menuId}
          showModal={this.state.menuUsers.show}
          closeModal={this.onHideUsersButtonClick}
        />

        <SpinnerOverlay show={isFetching} />
      </div>
    );
  };
}
