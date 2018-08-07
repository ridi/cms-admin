import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import { Button, ButtonToolbar, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connectStateStorage, getPassThroughProps } from '../utils/component';
import SpinnerOverlay from '../components/SpinnerOverlay';
import MenuTree from './MenuTree';
import MenuTreeDragSource from './MenuTreeDragSource';
import Submenus from './Submenus';
import MenuUsers from './MenuUsers';
import { mapMenuToRawMenu, mapRawMenuToMenu } from './menuMapper';
import { buildMenuTrees, flattenMenuTrees } from './menuTreeBuilder';
import './Menus.css';

const createMenu = () => ({
  id: -Date.now(), // temporary numeric id
  title: '',
  url: '',
  depth: 0,
  order: 0,
  isUse: false,
  isNewTab: false,
  isShow: false,
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
      this.handleError(e);
    }
  };

  getOriginalMenu = (menuId) => this.state.originalMenuDict[menuId];

  loadMenus = () => new Promise((resolve, reject) => {
    this.setState({ isFetching: true }, async () => {
      try {
        const { data: rawMenus } = await axios.get('/super/menus');

        const originalMenuDict = _.keyBy(_.map(rawMenus, mapRawMenuToMenu), 'id');
        const menuTreeItems = this.mapRawMenusToMenuTreeItems(rawMenus);

        this.setState({
          originalMenuDict,
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

  handleError = (e) => {
    alert(e.response && e.response.data ? e.response.data : e.message);
  };

  onAddMenuButtonClick = () => {
    const { menuTreeItems } = this.state;

    const newMenu = createMenu();

    this.onMenuTreeItemsChange([
      ...menuTreeItems,
      newMenu,
    ], () => {
      const scrollContainer = this.menuTree.current.getContainer();
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    });
  };

  onRefreshButtonClick = async () => {
    if (!this.state.hasUnsavedMenus || confirm('변경사항이 사라집니다. 계속하시겠습니까?')) {
      try {
        await this.loadMenus();
      } catch (e) {
        this.handleError(e);
      }
    }
  };

  onMenuTreeItemsChange = (menuTreeItems, callback) => {
    const menus = flattenMenuTrees(menuTreeItems);

    const modificationCheckedMenus = _.map(menus, menu => {
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

    const hasUnsavedMenus = _.some(modificationCheckedMenus, menu => menu.isUnsaved);

    const menuDict = _.keyBy(menus, 'id');
    const menuExpandedStates = _.mapValues(menuDict, menu => menu.expanded);

    this.setState({
      menuTreeItems: buildMenuTrees(modificationCheckedMenus),
      hasUnsavedMenus,
      menuExpandedStates: {
        ...this.state.menuExpandedStates,
        ...menuExpandedStates,
      },
    }, callback);
  };

  onSaveButtonClick = () => {
    this.setState({ isFetching: true }, async () => {
      try {
        const filterUnsavedMenus = menus => _.filter(menus, menu => menu.isUnsaved);

        const removeTemporaryIds = menus => _.map(menus, menu => {
          if (menu.isCreated) {
            return _.omit(menu, ['id']);
          }
          return menu;
        });

        const mapMenusToRawMenus = menus => _.map(menus, mapMenuToRawMenu);

        const unsavedRawMenus = _.flow([
          flattenMenuTrees,
          filterUnsavedMenus,
          removeTemporaryIds,
          mapMenusToRawMenus,
        ])(this.state.menuTreeItems);

        await axios.put('/super/menus', unsavedRawMenus);

        await this.loadMenus();
      } catch (e) {
        this.handleError(e);
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
          onChange={this.onMenuTreeItemsChange}
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

export default DragDropContext(HTML5Backend)(Menus);
