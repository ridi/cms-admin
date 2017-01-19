import React from 'react';
import TagList from './TagList';
import UsersDialog from './UsersDialog';
import MenusDialog from './MenusDialog';

const TagCreate = () =>
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
  </form>;

export default class TagEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.tags,
      menus: [],
      menusTag: undefined,
      menusLoading: true,
      showMenusDlg: false,
      users: [],
      usersLoading: true,
      showUsersDlg: false
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
        menusLoading: false
      }));
    }, 'json');

    return false;
  }

  onAddMenu = (tagId, menuId) => {
    $.ajax({
      url: `/super/tags/${tagId}/menus/${menuId}`,
      type: 'PUT',
      success: (returnData) => {
        if (!returnData.success) {
          alert(returnData.msg);
        }

        const newTags = this.state.tags.map(tag => {
          if (tag.id == tagId) {
            ++tag.menus_count;
          }
          return tag;
        });

        const newMenu = this.state.menus.map(menu => {
          if (menu.id == menuId) {
            menu.selected = 'selected'
          }
          return menu;
        });

        this.setState(Object.assign({}, this.state, {
          tags: newTags,
          menus: newMenu,
        }));
      }
    });
  };

  onDeleteMenu = (tagId, menuId) => {
    $.ajax({
      url: `/super/tags/${tagId}/menus/${menuId}`,
      type: 'DELETE',
      success: (returnData) => {
        const newTags = this.state.tags.map(tag => {
          if (tag.id == tagId) {
            --tag.menus_count;
          }
          return tag;
        });

        const newMenu = this.state.menus.map(menu => {
          if (menu.id == menuId) {
            delete menu.selected;
          }
          return menu;
        });

        this.setState(Object.assign({}, this.state, {
          tags: newTags,
          menus: newMenu,
        }));
      }
    });
  };

  loadUsers(tagId) {
    $.get(`/super/tags/${tagId}/users`, (result) => {
      if (!result.success) {
        return;
      }

      this.setState(Object.assign({}, this.state, {
        users: result.data,
        usersLoading: false
      }));
    });
  }

  onMenusCountClick = (id) => {
    this.loadMenus(id);
    this.setState(Object.assign({}, this.state, {
      menusTag: id,
      showMenusDlg: true,
    }));
  };

  onMenusDlgClose = () => {
    this.setState(Object.assign({}, this.state, {
      menusLoading: true,
      showMenusDlg: false,
    }));
  };

  onUsersCountClick = (id) => {
    this.loadUsers(id);
    this.setState(Object.assign({}, this.state, {
      showUsersDlg: true,
    }));
  };

  onUsersDlgClose = () => {
    this.setState(Object.assign({}, this.state, {
      usersLoading: true,
      showUsersDlg: false,
    }));
  };

  render() {
    const { tags, menus, menusTag, menusLoading, showMenusDlg, users, usersLoading, showUsersDlg } = this.state;

    const menuSelected = menus.filter(menu => menu.selected === 'selected')
      .map(menu => menu.id);

    const menuDatas = menus.map(menu => {
      const menuUrls = menu.menu_url.split('#');
      const text = menu.menu_title + (menuUrls[1] ? `#${menuUrls[1]}` : '');
      return {id:menu.id, text:text};
    });

    return (
      <div>
        <TagCreate />
        <TagList
          tags={tags}
          onMenusCountClick={this.onMenusCountClick}
          onUsersCountClick={this.onUsersCountClick}
        />

        <MenusDialog
          tagId={menusTag}
          show={showMenusDlg}
          loading={menusLoading}
          data={menuDatas}
          selected={menuSelected}
          onAdd={this.onAddMenu}
          onDelete={this.onDeleteMenu}
          onClose={this.onMenusDlgClose} />

        <UsersDialog
          show={showUsersDlg}
          loading={usersLoading}
          data={users}
          onClose={this.onUsersDlgClose} />
      </div>
    );
  }
}
