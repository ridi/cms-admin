import React from 'react';
import Sortable from 'react-sortablejs';
import PropTypes from 'prop-types';
import Submenus from './Submenus';
import MenuUsers from './MenuUsers';


function getMenuTypeString(isUse, isShow, menuDeep) {
  if (!isUse) return 'danger';
  else if (!isShow) return 'warning';
  else if (menuDeep === 0) return 'success';
  return '';
}

const MenuRow = ({
  id, menuTitle, menuUrl, menuDeep, menuOrder, isUse, isShow,
  isNewtab, onShowAjaxMenus, onShowMenuUsers,
}) => (
  <tr className={getMenuTypeString(isUse, isShow, menuDeep)}>
    <td>
      <input type="checkbox" />
      <input type="hidden" name="id" defaultValue={id} />
    </td>
    <td className="js_sortable_handle">{id}</td>
    <td>
      <input type="text" className="form-control" name="menu_title" defaultValue={menuTitle} />
    </td>
    <td>
      <input type="text" className="form-control" name="menu_url" defaultValue={menuUrl} />
    </td>
    <td>
      <input type="text" className="form-control" name="menu_deep" defaultValue={menuDeep} />
    </td>
    <td>
      <input type="text" className="form-control" name="menu_order" defaultValue={menuOrder} />
    </td>
    <td>
      <select className="form-control" name="is_newtab" defaultValue={isNewtab}>
        <option value>Y</option>
        <option value={false}>N</option>
      </select>
    </td>
    <td>
      <select className="form-control" name="is_use" defaultValue={isUse}>
        <option value>Y</option>
        <option value={false}>N</option>
      </select>
    </td>
    <td>
      <select className="form-control" name="is_show" defaultValue={isShow}>
        <option value>Y</option>
        <option value={false}>N</option>
      </select>
    </td>
    <td>
      <button
        type="button"
        className="btn btn-default btn-sm js_show_ajax_menus"
        onClick={() => onShowAjaxMenus(id, menuTitle)}
      >
        보기
      </button>
    </td>
    <td>
      <button
        type="button"
        className="btn btn-default btn-sm js_show_ajax_menus"
        onClick={() => onShowMenuUsers()}
      >
        보기
      </button>
    </td>
  </tr>
);

MenuRow.propTypes = {
  id: PropTypes.number.isRequired,
  menuTitle: PropTypes.string.isRequired,
  menuUrl: PropTypes.string.isRequired,
  menuDeep: PropTypes.number.isRequired,
  menuOrder: PropTypes.number.isRequired,
  isUse: PropTypes.bool.isRequired,
  isNewtab: PropTypes.bool.isRequired,
  isShow: PropTypes.bool.isRequired,
  onShowAjaxMenus: PropTypes.func.isRequired,
  onShowMenuUsers: PropTypes.func.isRequired,
};


function checkChangedRow($tr) {
  $tr.find('input[type=checkbox]').prop('checked', true);
}

export default class MenuList extends React.Component {
  static onSortEnd(evt) {
    if (evt.oldIndex === evt.newIndex) {
      return;
    }

    const $tbody = $(evt.target);

    const targetIndex = (evt.newIndex > evt.oldIndex) ? evt.newIndex - 1 : evt.newIndex + 1;
    const newOrder = $tbody.find(`tr:nth-child(${targetIndex + 1}) input[name="menu_order"]`).attr('value');

    const changedRow = $tbody.find(`tr:nth-child(${evt.newIndex + 1})`);
    changedRow.find('input[name="menu_order"]').val(newOrder);
    checkChangedRow(changedRow);
  }

  static onUpdate() {
    const args = $('#modifyForm').find('input:checked').map((i, e) => {
      const $tr = $(e).parents('tr');
      const menuId = $tr.find('input[name=id]').val();
      const data = {
        menu_title: $tr.find('input[name=menu_title]').val(),
        menu_url: $tr.find('input[name=menu_url]').val(),
        menu_deep: $tr.find('input[name=menu_deep]').val(),
        menu_order: $tr.find('input[name=menu_order]').val(),
        is_newtab: $tr.find('select[name=is_newtab]').val() === 'true' ? '1' : '0',
        is_use: $tr.find('select[name=is_use]').val() === 'true' ? '1' : '0',
        is_show: $tr.find('select[name=is_show]').val() === 'true' ? '1' : '0',
      };

      return $.ajax({
        url: `/super/menus/${menuId}`,
        type: 'PUT',
        data,
      });
    });

    $.when(...args)
      .done(() => {
        window.location.reload();
      });
  }

  constructor() {
    super();
    this.showAjaxMenus = this.showAjaxMenus.bind(this);
    this.showMenuUsers = this.showMenuUsers.bind(this);
    this.hideMenuUsers = this.hideMenuUsers.bind(this);

    this.state = {
      menuUsers: {
        show: false,
        menuId: 0,
      },
    };
  }

  componentDidMount() {
    // 컬럼 변동 시 check
    $('#modifyForm input[type=text], #modifyForm select').change(function onChange() {
      checkChangedRow($(this).parents('tr'));
    });

    // Ajax Menu 컬럼 변동 시 check
    $('#ajaxMenuBody').delegate('input[type=text]', 'change', function onChange() {
      checkChangedRow($(this).parents('tr'));
    });

    $('#ajax_url').on('keyup', (event) => {
      if (event.which === 13) {
        $('#insertAjaxUrlBtn').click();
      }
    });
  }

  showAjaxMenus(menuId, menuTitle) {
    this.modal.show(menuId, menuTitle);
  }

  showMenuUsers(menuId) {
    this.setState({
      menuUsers: {
        show: true,
        menuId,
      },
    });
  }

  hideMenuUsers() {
    this.setState({
      menuUsers: {
        show: false,
        menuId: 0,
      },
    });
  }

  render() {
    return (
      <div>
        <h4>메뉴 목록 및 수정</h4>
        <form id="modifyForm" className="form-group">
          <table className="table table-bordered table-condensed">
            <colgroup>
              <col width="20" />
              <col width="20" />
              <col width="250" />
              <col width="400" />
              <col width="80" />
              <col width="80" />
              <col width="80" />
              <col width="80" />
              <col width="80" />
              <col width="80" />
              <col width="80" />
            </colgroup>
            <thead>
              <tr>
                <th />
                <th>ID <span className="glyphicon glyphicon-resize-vertical" /></th>
                <th>메뉴 제목</th>
                <th>메뉴 URL</th>
                <th>메뉴 깊이</th>
                <th>메뉴 순서</th>
                <th>새탭 여부</th>
                <th>사용 여부</th>
                <th>노출 여부</th>
                <th>Ajax 관리</th>
                <th>사용자</th>
              </tr>
            </thead>
            <Sortable
              tag="tbody"
              options={{
                handle: '.js_sortable_handle',
                onEnd: this.onSortEnd,
              }}
              id="js_menu_list"
            >
              {
                this.props.menus.map(menu => (
                  <MenuRow
                    key={menu.id}
                    id={menu.id}
                    menuTitle={menu.menu_title}
                    menuUrl={menu.menu_url}
                    menuDeep={menu.menu_deep}
                    menuOrder={menu.menu_order}
                    isUse={menu.is_use}
                    isNewtab={menu.is_newtab}
                    isShow={menu.is_show}
                    onShowAjaxMenus={this.showAjaxMenus}
                    onShowMenuUsers={() => this.showMenuUsers(menu.id)}
                  />
                ))
              }
            </Sortable>
          </table>

          <nav className="navbar navbar-default navbar-fixed-bottom">
            <div className="pull-right">
              <button type="button" className="btn btn-primary" onClick={this.onUpdate}>저장</button>
            </div>
          </nav>
        </form>

        <Submenus ref={(e) => { this.modal = e; }} />
        <MenuUsers
          showModal={this.state.menuUsers.show}
          menuId={this.state.menuUsers.menuId}
          closeModal={this.hideMenuUsers}
        />
      </div>
    );
  }
}

MenuList.propTypes = {
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
