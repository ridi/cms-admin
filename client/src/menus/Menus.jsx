import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import { Button, ButtonToolbar, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import { connectStateStorage, getPassThroughProps } from '../utils/component';
import { handleError } from '../utils/error';
import SpinnerOverlay from '../components/SpinnerOverlay';
import MenuTree from './MenuTree';
import MenuTreeDragSource from './MenuTreeDragSource';
import Submenus from './Submenus';
import MenuUsers from './MenuUsers';
import { mapMenuToRawMenu, mapRawMenuToMenu } from './menuMapper';
import { buildMenuTrees, flattenMenuTrees } from './menuTreeBuilder';
import './Menus.css';

const isTouchDevice = !!('ontouchstart' in window || navigator.maxTouchPoints);

const DndBackend = isTouchDevice ? TouchBackend : HTML5Backend;

const createMenu = () => ({
  id: -Date.now(), // temporary numeric id
  title: '',
  url: '',
  depth: 0,
  order: 0,
  isUse: true,
  isNewTab: false,
  isShow: true,
});

class Menus extends React.Component {
  state = {
    originalMenuDict: undefined,
    menuTreeItems: undefined,
    menuExpandedStates: {},
    hasUnsavedMenus: false,
    isFetching: false,
    menuUsers: {
      show: false,
      menuId: undefined,
    },
  };

  menuTree = React.createRef();
  submenusModal = React.createRef();

  constructor(props) {
    super(props);
    connectStateStorage(this, {
      stateKeys: ['menuExpandedStates'],
    });
  }

  componentDidMount = async () => {
    try {
      await this.loadMenus();
    } catch (e) {
      handleError(e);
    }
  };

  getOriginalMenu = (menuId) => this.state.originalMenuDict[menuId];

  loadMenus = async () => {
    try {
      await this.setStateAsync({ isFetching: true });

      const { data: rawMenus } = await axios.get('/super/menus');

      const originalMenuDict = _.keyBy(_.map(rawMenus, mapRawMenuToMenu), 'id');
      const menuTreeItems = this.mapRawMenusToMenuTreeItems(rawMenus);

      await this.setStateAsync({ originalMenuDict });
      await this.updateMenuTreeItems(menuTreeItems);
    } finally {
      await this.setStateAsync({ isFetching: false });
    }
  };

  mapRawMenusToMenuTreeItems = (rawMenus) => {
    const restoreMenuExpandedState = menu => ({
      ...menu,
      expanded: !!this.state.menuExpandedStates[menu.id],
    });

    const menus = _.map(rawMenus, _.flow([
      mapRawMenuToMenu,
      restoreMenuExpandedState,
    ]));

    const sortedMenus = _.sortBy(menus, ['order']);

    return buildMenuTrees(sortedMenus);
  };

  onAddMenuButtonClick = async () => {
    const { menuTreeItems } = this.state;

    const newMenu = createMenu();
    const newMenuTreeItems = [
      ...menuTreeItems,
      newMenu,
    ];

    await this.updateMenuTreeItems(newMenuTreeItems);

    // Scroll to added menu
    const scrollContainer = this.menuTree.current.getContainer();
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  };

  onRefreshButtonClick = async () => {
    if (!this.state.hasUnsavedMenus || confirm('변경사항이 사라집니다. 계속하시겠습니까?')) {
      try {
        await this.loadMenus();
      } catch (e) {
        handleError(e);
      }
    }
  };

  updateMenuTreeItems = async (menuTreeItems) => {
    const menus = flattenMenuTrees(menuTreeItems);

    const menusWithOriginalOrder = _.map(menus, (menu, index) => {
      const originalMenu = this.getOriginalMenu(menu.id);
      const order = originalMenu ? originalMenu.order : index;
      return {
        ...menu,
        order,
      }
    });

    const orderCorrectedMenus = _.reduce(menusWithOriginalOrder, (newMenus, menu, index) => {
      const prevMenu = newMenus[index - 1];
      const nextMenu = newMenus[index + 1];

      const menuOrder = menu.order;
      const prevMenuOrder = prevMenu ? prevMenu.order : index - 1;
      const nextMenuOrder = nextMenu ? nextMenu.order : menuOrder + 1;

      if (menuOrder > prevMenuOrder && menuOrder < nextMenuOrder) {
        newMenus[index] = {
          ...menu,
          order: menuOrder,
        };
        return newMenus;
      }

      newMenus[index] = {
        ...menu,
        order: prevMenuOrder + 1,
      };
      return newMenus;
    }, [...menusWithOriginalOrder]);

    const modificationCheckedMenus = _.map(orderCorrectedMenus, menu => {
      const originalMenu = this.getOriginalMenu(menu.id);
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

    const newMenuTreeItems = buildMenuTrees(modificationCheckedMenus);

    const hasUnsavedMenus = _.some(modificationCheckedMenus, menu => menu.isUnsaved);

    const menuDict = _.keyBy(menus, 'id');
    const menuExpandedStates = _.mapValues(menuDict, menu => menu.expanded);

    await this.setStateAsync({
      menuTreeItems: newMenuTreeItems,
      hasUnsavedMenus,
      menuExpandedStates: {
        ...this.state.menuExpandedStates,
        ...menuExpandedStates,
      },
    });
  };

  onSaveButtonClick = async () => {
    try {
      await this.setStateAsync({ isFetching: true });

      const filterUnsavedMenus = menus => _.filter(menus, menu => menu.isUnsaved);

      const removeTemporaryIds = menus => _.map(menus, menu => {
        if (menu.isCreated) {
          return _.omit(menu, ['id']);
        }
        return menu;
      });

      // To guarantee order correction in server-side to be applied appropriately
      const sortMenusDescendingOrder = menus => _.sortBy(menus, [menu => -menu.order]);

      const mapMenusToRawMenus = menus => _.map(menus, mapMenuToRawMenu);

      const unsavedRawMenus = _.flow([
        flattenMenuTrees,
        filterUnsavedMenus,
        removeTemporaryIds,
        sortMenusDescendingOrder,
        mapMenusToRawMenus,
      ])(this.state.menuTreeItems);

      await axios.put('/super/menus', unsavedRawMenus);

      await this.loadMenus();
    } catch (e) {
      handleError(e);
    } finally {
      this.setState({ isFetching: false });
    }
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

  setStateAsync = (stateChange) => new Promise((resolve, reject) => {
    try {
      this.setState(stateChange, resolve);
    } catch (e) {
      reject(e);
    }
  });

  render = () => {
    const {
      menuTreeItems,
      hasUnsavedMenus,
      isFetching,
    } = this.state;

    return (
      <div className="menus" {...getPassThroughProps(this)}>
        <ButtonToolbar className="menus__toolbar">
          <Button
            disabled={isFetching}
            onClick={this.onRefreshButtonClick}
          >
            <Glyphicon glyph="refresh" /> 새로 고침
          </Button>

          <OverlayTrigger
            placement="left"
            overlay={<Tooltip id="add_menu_button_tooltip">클릭 또는 원하는 곳으로 드래그하세요!</Tooltip>}
          >
            <MenuTreeDragSource
              item={createMenu()}
              component="button"
              className="btn btn-success"
              disabled={isFetching}
              onClick={this.onAddMenuButtonClick}
            >
              <Glyphicon glyph="plus" /> 새 메뉴
            </MenuTreeDragSource>
          </OverlayTrigger>

          <Button
            bsStyle="primary"
            disabled={isFetching || !hasUnsavedMenus}
            onClick={this.onSaveButtonClick}
          >
            저장
          </Button>
        </ButtonToolbar>

        <MenuTree
          ref={this.menuTree}
          items={menuTreeItems}
          getOriginalMenu={this.getOriginalMenu}
          onChange={this.updateMenuTreeItems}
          onShowSubmenusButtonClick={this.onShowSubmenusButtonClick}
          onShowUsersButtonClick={this.onShowUsersButtonClick}
        />

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

export default DragDropContext(DndBackend)(Menus);
