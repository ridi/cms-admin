import React from 'react';
import Sortable from 'react-sortablejs';
import Submenus from './Submenus';


function getMenuTypeString(menu) {
  if (!menu.is_use) return "danger";
  else if (!menu.is_show) return "warning";
  else if (menu.menu_deep == 0) return "success";
  return "";
}

class Menu extends React.Component {
  render() {
    return (
      <tr className={getMenuTypeString(this.props)}>
        <td>
          <input type="checkbox"/>
          <input type="hidden" name="id" defaultValue={this.props.id}/>
        </td>
        <td className="js_sortable_handle">{this.props.id}</td>
        <td><input type="text" className="form-control" name="menu_title" defaultValue={this.props.menu_title}/></td>
        <td><input type="text" className="form-control" name="menu_url" defaultValue={this.props.menu_url}/></td>
        <td><input type="text" className="form-control" name="menu_deep" defaultValue={this.props.menu_deep}/></td>
        <td><input type="text" className="form-control" name="menu_order" defaultValue={this.props.menu_order}/></td>
        <td>
          <select className="form-control" name="is_newtab" defaultValue={this.props.is_newtab}>
            <option value={true}>Y</option>
            <option value={false}>N</option>
          </select>
        </td>
        <td>
          <select className="form-control" name="is_use" defaultValue={this.props.is_use}>
            <option value={true}>Y</option>
            <option value={false}>N</option>
          </select>
        </td>
        <td>
          <select className="form-control" name="is_show" defaultValue={this.props.is_show}>
            <option value={true}>Y</option>
            <option value={false}>N</option>
          </select>
        </td>
        <td>
          <button type="button" className="btn btn-default btn-sm js_show_ajax_menus"
                  onClick={(e) => this.props.onShowAjaxMenus(this.props.id, this.props.menu_title)}>보기
          </button>
        </td>
      </tr>
    );
  }
}

Menu.propTypes = {
  id: React.PropTypes.number.isRequired,
  menu_title: React.PropTypes.string.isRequired,
  menu_url: React.PropTypes.string.isRequired,
  menu_deep: React.PropTypes.number.isRequired,
  menu_order: React.PropTypes.number.isRequired,
  is_use: React.PropTypes.bool.isRequired,
  is_newtab: React.PropTypes.bool.isRequired,
  is_show: React.PropTypes.bool.isRequired,

  onShowAjaxMenus: React.PropTypes.func.isRequired
};


function checkChangedRow($tr) {
  $tr.find('input[type=checkbox]').attr('checked', 'checked');
}

export default class MenuList extends React.Component {
  componentDidMount() {
    // 컬럼 변동 시 check
    $('#modifyForm input[type=text], #modifyForm select').change(function () {
      checkChangedRow($(this).parents('tr'));
    });

    // Ajax Menu 컬럼 변동 시 check
    $("#ajaxMenuBody").delegate("input[type=text]", "change", function () {
      checkChangedRow($(this).parents('tr'));
    });

    $("#ajax_url").on("keyup", function (event) {
      if (event.which == 13) {
        $("#insertAjaxUrlBtn").click();
      }
    });
  }

  onUpdate() {
    $.when.apply($,
      $('#modifyForm').find('input:checked').map((i, e) => {
        const $tr = $(e).parents('tr');
        const menuId = $tr.find('input[name=id]').val();
        const data = {
          menu_title: $tr.find('input[name=menu_title]').val(),
          menu_url: $tr.find('input[name=menu_url]').val(),
          menu_deep: $tr.find('input[name=menu_deep]').val(),
          menu_order: $tr.find('input[name=menu_order]').val(),
          is_newtab: $tr.find('select[name=is_newtab]').val() == "true" ? "1" : "0",
          is_use: $tr.find('select[name=is_use]').val() == "true" ? "1" : "0",
          is_show: $tr.find('select[name=is_show]').val() == "true" ? "1" : "0",
        };

        return $.ajax({
          url: `/super/menus/${menuId}`,
          type: 'PUT',
          data: data
        });
      })
    ).done((result) => {
      window.location.reload();
    });
  }

  onSortEnd(evt) {
    if (evt.oldIndex === evt.newIndex) {
      return;
    }

    const $tbody = $(evt.target);

    var targetIndex = (evt.newIndex > evt.oldIndex) ? evt.newIndex - 1 : evt.newIndex + 1;
    var newOrder = $tbody.find(`tr:nth-child(${targetIndex + 1}) input[name="menu_order"]`).attr('value');

    var changedRow = $tbody.find(`tr:nth-child(${evt.newIndex + 1})`);
    changedRow.find('input[name="menu_order"]').val(newOrder);
    checkChangedRow(changedRow);
  }

  showAjaxMenus(menu_id, menu_title) {
    this.modal.show(menu_id, menu_title);
  }

  render() {
    return (
      <div>
        <h4>메뉴 목록 및 수정</h4>
        <form id="modifyForm" className="form-group">
          <table className="table table-bordered table-condensed">
            <colgroup>
              <col width="20"/>
              <col width="20"/>
              <col width="250"/>
              <col width="400"/>
              <col width="80"/>
              <col width="80"/>
              <col width="80"/>
              <col width="80"/>
              <col width="80"/>
              <col width="80"/>
            </colgroup>
            <thead>
            <tr>
              <th/>
              <th>ID <span className="glyphicon glyphicon-resize-vertical"/></th>
              <th>메뉴 제목</th>
              <th>메뉴 URL</th>
              <th>메뉴 깊이</th>
              <th>메뉴 순서</th>
              <th>새탭 여부</th>
              <th>사용 여부</th>
              <th>노출 여부</th>
              <th>Ajax 관리</th>
            </tr>
            </thead>
            <Sortable
              tag="tbody"
              options={{
                handle: '.js_sortable_handle',
                onEnd: this.onSortEnd
              }}
              id='js_menu_list'>
              {this.props.menus.map((menu) =>
                <Menu key={menu.id} {...menu} onShowAjaxMenus={this.showAjaxMenus.bind(this)}/>
              )}
            </Sortable>
          </table>

          <nav className="navbar navbar-default navbar-fixed-bottom">
            <div className="pull-right">
              <button type="button" className="btn btn-primary" onClick={this.onUpdate}>저장</button>
            </div>
          </nav>
        </form>

        <Submenus ref={(e) => this.modal = e}/>
      </div>
    );
  }
}
