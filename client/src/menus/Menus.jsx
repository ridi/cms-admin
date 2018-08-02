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
    hasUnsavedMenus: false,
    isFetching: false,
    menuUsers: {
      show: false,
      menuId: undefined,
    },
  };

  submenusModal = React.createRef();

  componentDidMount = () => {
    this.loadMenus();
  };

  loadMenus = () => new Promise((resolve, reject) => {
    this.setState({ isFetching: true }, async () => {
      try {
        const { data: rawMenus } = await axios.get('/super/menus');

        const menuDict = _.keyBy(_.map(rawMenus, mapRawMenuToMenu), 'id');
        const menuTreeItems = this.mapRawMenusToMenuTreeItems(rawMenus);

        this.setState({
          menuDict,
          menuTreeItems,
          hasUnsavedMenus: false,
        }, resolve);
      } catch (e) {
        reject(e);
      } finally {
        this.setState({ isFetching: false });
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

  onRefreshButtonClick = () => {
    if (!this.state.hasUnsavedMenus || confirm('변경사항이 사라집니다. 계속하시겠습니까?')) {
      this.loadMenus();
    }
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

    const hasUnsavedMenus = _.some(modificationCheckedMenus, menu => menu.isUnsaved);

    this.setState({
      menuTreeItems: buildMenuTrees(modificationCheckedMenus),
      hasUnsavedMenus,
    });
  };

  onSaveButtonClick = () => {
    this.setState({ isFetching: true }, async () => {
      try {
        const menus = flattenMenuTrees(this.state.menuTreeItems);
        const unsavedMenus = _.filter(menus, menu => menu.isUnsaved);
        const unsavedRawMenus = _.map(unsavedMenus, mapMenuToRawMenu);
        await axios.put('/super/menus', unsavedRawMenus);
        await this.loadMenus();
      } catch (e) {
        alert(e.response ? e.response.data : e.message);
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
      hasUnsavedMenus,
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
            disabled={isFetching}
            onClick={this.onRefreshButtonClick}
          >
            <Glyphicon glyph="refresh" /> 새로 고침
          </Button>

          <Button
            bsStyle="success"
            disabled={isFetching}
            onClick={this.onAddMenuButtonClick}
          >
            <Glyphicon glyph="plus" /> 새 메뉴
          </Button>

          <Button
            bsStyle="primary"
            disabled={isFetching || !hasUnsavedMenus}
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
