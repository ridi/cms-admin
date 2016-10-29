import React from 'react';

export default class Submenus extends React.Component {
  componentDidMount() {
    $("#ajaxMenuModal").modal({
      keyboard: true,
      show: false
    });
  }

  onCreate() {
    const menu_id = $("#ajax_menu_id").val();
    const data = $("#ajaxMenuInsertForm").serialize();
    $.ajax(`/super/menus/${menu_id}/submenus`, data, (returnData) => {
      if (returnData.success) {
        alert(returnData.msg);
        $("#ajax_url").val('');
        this.show(menu_id, $("#ajax_menu_title").val());
      } else {
        alert(returnData.msg);
      }
    }, 'json');
  }

  onUpdate() {
    const menuId = $("#ajax_menu_id").val();
    $.when.apply($,
      $('#ajaxMenuUpdateForm').find("input:checked").map((i, e) => {
        const $tr = $(e).parents('tr');
        const submenuId = $tr.find('input[type=checkbox]').val();
        const data = {
          ajax_url: $tr.find('input[name=ajax_url]').val(),
        };

        return $.ajax({
          url: `/super/menus/${menuId}/submenus/${submenuId}`,
          type: 'PUT',
          data: data
        });
      })
    ).done((result) => {
      this.show($("#ajax_menu_id").val(), $("#ajax_menu_title").val());
    });
  }

  onDelete() {
    if (!confirm('선택한 항목들을 삭제하시겠습니까?')) {
      return;
    }

    const menu_id = $("#ajax_menu_id").val();
    $('#ajaxMenuUpdateForm').find("input:checked").map((i, e) => {
      const $tr = $(e).parents('tr');
      const submenu_id = $tr.find('input[type=checkbox]').val();

      $.ajax({
        url: `/super/menus/${menu_id}/submenus/${submenu_id}`,
        type: 'DELETE'
      }).done((result) => {
        if (result.success) {
          $tr.detach();
        }
      });
    });
  }

  show(menu_id, menu_title) {
    $.get(`/super/menus/${menu_id}/submenus`, (returnData) => {
      if (returnData.success) {
        var menu_list = returnData.data;
        var html = '';
        if (menu_list.length != 0) {
          for (var i in menu_list) {
            html += '<tr>';
            html += '<td>' + menu_list[i]['id'] + '</td>';
            html += '<td><input type="checkbox" value="' + menu_list[i]['id'] + '"/></td>';
            html += '<td><input type="text" class="form-control" name="ajax_url" value="' + menu_list[i]['ajax_url'] + '"/></td>';
            html += '</tr>';
          }
        } else {
          html += '<tr><td colspan="3">등록된 Ajax 메뉴가 없습니다.</td></tr>';
        }

        $("#ajaxMenuBody").html(html);
        $("#ajaxMenuModalLabel").html(menu_title + ' Ajax 등록 및 수정');
        $("#ajax_menu_id").val(menu_id);
        $("#ajax_menu_title").val(menu_title);
        $("#ajax_url").val('');
        $("#ajaxMenuModal").modal('show');
      } else {
        alert(returnData.msg);
      }
    }, 'json');
  }

  render() {
    return (
      <div id="ajaxMenuModal" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="ajaxMenuModalLabel"
           aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <a type="button" className="close" data-dismiss="modal" aria-hidden="true">×</a>
              <h4 id="ajaxMenuModalLabel">메뉴 Ajax 목록 및 수정</h4>
            </div>
            <div className="modal-body">
              <form id="ajaxMenuInsertForm" className="form-inline" onSubmit={() => false}>
                <input type="hidden" id="ajax_menu_title"/>

                <div className="form-group">
                  <input type="text" className="form-control" id="ajax_url" name="ajax_url" placeholder="Ajax 메뉴 Url 입력"/>
                  <button type="button" className="btn btn-success" onClick={this.onCreate.bind(this)}>추가</button>
                </div>
              </form>
              <form id="ajaxMenuUpdateForm" className="form-group">
                <input type="hidden" id="ajax_menu_id" name="menu_id"/>
                <table className="table table-bordered table-condensed">
                  <colgroup>
                    <col width="25"/>
                    <col width="25"/>
                    <col width=""/>
                  </colgroup>
                  <thead>
                  <tr>
                    <th/>
                    <th>ID</th>
                    <th>Ajax 메뉴 URL</th>
                  </tr>
                  </thead>
                  <tbody id="ajaxMenuBody"/>
                </table>
              </form>
            </div>
            <div className="modal-footer">
              <div className="btn-group pull-left">
                <button className="btn btn-warning btn-sm" onClick={this.onDelete}>삭제</button>
              </div>
              <div className="btn-group pull-right">
                <button className="btn btn-primary btn-sm" onClick={this.onUpdate.bind(this)}>저장</button>
                <button className="btn btn-default btn-sm" data-dismiss="modal" aria-hidden="true">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

