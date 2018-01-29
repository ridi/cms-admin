import React from 'react';
import PropTypes from 'prop-types';
import TagList from './TagList';
import UsersDialog from './UsersDialog';
import MenusDialog from './MenusDialog';

const TagCreate = () => (
  <form className="clearfix" method="POST">
    <h4>태그 등록</h4>
    <table className="table table-bordered">
      <colgroup>
        <col width="200" />
        <col width="80" />
      </colgroup>
      <thead>
        <tr>
          <th>태그 이름</th>
          <th>사용 여부</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" className="input-block-level" name="name" /></td>
          <td>
            <select className="input-block-level" name="is_use">
              <option value="1">Y</option>
              <option value="0">N</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <div className="pull-right">
      <button type="submit" className="btn btn-primary">저장</button>
    </div>
  </form>
);

export default class TagEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddMenu = this.handleAddMenu.bind(this);
    this.handleDeleteMenu = this.handleDeleteMenu.bind(this);
    this.handleMenusCountClick = this.handleMenusCountClick.bind(this);
    this.handleMenusDlgClose = this.handleMenusDlgClose.bind(this);
    this.handleActiveUsersCountClick = this.handleActiveUsersCountClick.bind(this);
    this.handleInactiveUsersCountClick = this.handleInactiveUsersCountClick.bind(this);
    this.handleUsersDlgClose = this.handleUsersDlgClose.bind(this);

    this.state = {
      tags: props.tags,
      menus: [],
      menusTag: 0,
      menusLoading: true,
      menusDisabled: true,
      showMenusDlg: false,
      users: [],
      usersLoading: true,
      showUsersDlg: false,
    };
  }

  loadMenus(tagId) {
    $.get(`/super/tags/${tagId}/menus`, (returnData) => {
      if (!returnData.success) {
        alert(returnData.msg);
        return;
      }

      this.setState(Object.assign({}, this.state, {
        menus: returnData.data.menus,
        menusLoading: false,
        menusDisabled: false,
      }));
    }, 'json');
  }

  handleAddMenu(tagId, menuId) {
    this.setState({ menusDisabled: true });

    $.ajax({
      url: `/super/tags/${tagId}/menus/${menuId}`,
      type: 'PUT',
      success: (returnData) => {
        if (!returnData.success) {
          alert(returnData.msg);
        }

        const newTags = this.state.tags.map((tag) => {
          let result = tag;
          if (tag.id === parseInt(tagId, 10)) {
            result = Object.assign({}, tag, {
              menus_count: tag.menus_count + 1,
            });
          }
          return result;
        });

        const newMenu = this.state.menus.map((menu) => {
          let result = menu;
          if (menu.id === parseInt(menuId, 10)) {
            result = Object.assign({}, menu, {
              selected: 'selected',
            });
          }
          return result;
        });

        this.setState({
          menusDisabled: false,
          tags: newTags,
          menus: newMenu,
        });
      },
    });
  }

  handleDeleteMenu(tagId, menuId) {
    this.setState({ menusDisabled: true });
    $.ajax({
      url: `/super/tags/${tagId}/menus/${menuId}`,
      type: 'DELETE',
      success: () => {
        const newTags = this.state.tags.map((tag) => {
          let result = tag;
          if (tag.id === parseInt(tagId, 10)) {
            result = Object.assign({}, tag, {
              menus_count: tag.menus_count - 1,
            });
          }
          return result;
        });

        const newMenu = this.state.menus.map((menu) => {
          let result = menu;
          if (menu.id === parseInt(menuId, 10)) {
            result = Object.assign({}, menu, {
              selected: null,
            });
          }
          return result;
        });

        this.setState(Object.assign({}, this.state, {
          menusDisabled: false,
          tags: newTags,
          menus: newMenu,
        }));
      },
    });
  }

  loadActiveUsers(tagId) {
    $.get(`/super/tags/${tagId}/users?is_use=1`, (result) => {
      if (!result.success) {
        return;
      }

      this.setState(Object.assign({}, this.state, {
        users: result.data,
        usersLoading: false,
      }));
    });
  }

  loadInactiveUsers(tagId) {
    $.get(`/super/tags/${tagId}/users?is_use=0`, (result) => {
      if (!result.success) {
        return;
      }

      this.setState(Object.assign({}, this.state, {
        users: result.data,
        usersLoading: false,
      }));
    });
  }

  handleMenusCountClick(id) {
    this.loadMenus(id);
    this.setState(Object.assign({}, this.state, {
      menusTag: id,
      showMenusDlg: true,
    }));
  }

  handleMenusDlgClose() {
    this.setState(Object.assign({}, this.state, {
      menusLoading: true,
      showMenusDlg: false,
    }));
  }

  handleActiveUsersCountClick(id) {
    this.loadActiveUsers(id);
    this.setState(Object.assign({}, this.state, {
      showUsersDlg: true,
    }));
  }

  handleInactiveUsersCountClick(id) {
    this.loadInactiveUsers(id);
    this.setState(Object.assign({}, this.state, {
      showUsersDlg: true,
    }));
  }

  handleUsersDlgClose() {
    this.setState(Object.assign({}, this.state, {
      usersLoading: true,
      showUsersDlg: false,
    }));
  }

  render() {
    const {
      tags, menus, menusTag, menusLoading, menusDisabled, showMenusDlg,
      users, usersLoading, showUsersDlg,
    } = this.state;

    users.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (b.name > a.name) return -1;
      return 0;
    });

    const menuSelected = menus.filter(menu => menu.selected === 'selected')
      .map(menu => menu.id);

    const menuDatas = menus.map((menu) => {
      const menuUrls = menu.menu_url.split('#');
      const text = menu.menu_title + (menuUrls[1] ? `#${menuUrls[1]}` : '');
      return { id: menu.id, text };
    });
    menuDatas.sort((a, b) => {
      if (a.text > b.text) return 1;
      if (b.text > a.text) return -1;
      return 0;
    });

    return (
      <div>
        <TagCreate />
        <TagList
          tags={tags}
          onMenusCountClick={this.handleMenusCountClick}
          onActiveUsersCountClick={this.handleActiveUsersCountClick}
          onInactiveUsersCountClick={this.handleInactiveUsersCountClick}
        />

        <MenusDialog
          tagId={menusTag}
          show={showMenusDlg}
          loading={menusLoading}
          data={menuDatas}
          selected={menuSelected}
          disabled={menusDisabled}
          onAdd={this.handleAddMenu}
          onDelete={this.handleDeleteMenu}
          onClose={this.handleMenusDlgClose}
        />

        <UsersDialog
          show={showUsersDlg}
          loading={usersLoading}
          data={users}
          onClose={this.handleUsersDlgClose}
        />
      </div>
    );
  }
}

TagEdit.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    is_use: PropTypes.bool,
    creator: PropTypes.string,
  })).isRequired,
};
