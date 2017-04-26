import React from 'react';

export default class Submenus extends React.Component {
  constructor() {
    super();
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    $('#ajaxMenuModal').modal({
      keyboard: true,
      show: false,
    });
  }

  handleCreate() {
    const menuId = $('#ajax_menu_id').val();
    const data = $('#ajaxMenuInsertForm').serialize();
    $.post(`/super/menus/${menuId}/submenus`, data, (result) => {
      alert(result);
      $('#ajax_url').val('');
      this.show(menuId, $('#ajax_menu_title').val());
    });
  }

  handleUpdate() {
    const menuId = $('#ajax_menu_id').val();
    const args = $('#ajaxMenuUpdateForm').find('input:checked').map((i, e) => {
      const $tr = $(e).parents('tr');
      const submenuId = $tr.find('input[type=checkbox]').val();
      const data = {
        ajax_url: $tr.find('input[name=ajax_url]').val(),
      };

      return $.ajax({
        url: `/super/menus/${menuId}/submenus/${submenuId}`,
        type: 'PUT',
        data,
      });
    });

    $.when(...args).done(() => {
      this.show($('#ajax_menu_id').val(), $('#ajax_menu_title').val());
    });
  }

  handleDelete() {
    if (!confirm('선택한 항목들을 삭제하시겠습니까?')) {
      return;
    }

    const menuId = $('#ajax_menu_id').val();
    $('#ajaxMenuUpdateForm').find('input:checked').map((i, e) => {
      const $tr = $(e).parents('tr');
      const submenuId = $tr.find('input[type=checkbox]').val();

      $.ajax({
        url: `/super/menus/${menuId}/submenus/${submenuId}`,
        type: 'DELETE',
      }).done(() => {
        $tr.detach();
      });

      return null;
    });
  }

  show(menuId, menuTitle) {
    $.get(`/super/menus/${menuId}/submenus`, (returnData) => {
      if (returnData.success) {
        const menuList = returnData.data;
        let html = '';
        if (menuList.length !== 0) {
          for (const i in menuList) {
            if (Object.prototype.hasOwnProperty.call(menuList, i)) {
              html += '<tr>';
              html += `<td>${menuList[i].id}</td>`;
              html += `<td><input type="checkbox" value="${menuList[i].id}"/></td>`;
              html += `<td><input type="text" class="form-control" name="ajax_url" value="${menuList[i].ajax_url}"/></td>`;
              html += '</tr>';
            }
          }
        } else {
          html += '<tr><td colspan="3">등록된 Ajax 메뉴가 없습니다.</td></tr>';
        }

        $('#ajaxMenuBody').html(html);
        $('#ajaxMenuModalLabel').html(`${menuTitle} Ajax 등록 및 수정`);
        $('#ajax_menu_id').val(menuId);
        $('#ajax_menu_title').val(menuTitle);
        $('#ajax_url').val('');
        $('#ajaxMenuModal').modal('show');
      } else {
        alert(returnData.msg);
      }
    }, 'json');
  }

  render() {
    return (
      <div
        id="ajaxMenuModal" className="modal fade" tabIndex="-1" role="dialog"
        aria-labelledby="ajaxMenuModalLabel" aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <a type="button" className="close" data-dismiss="modal" aria-hidden="true">×</a>
              <h4 id="ajaxMenuModalLabel">메뉴 Ajax 목록 및 수정</h4>
            </div>
            <div className="modal-body">
              <form id="ajaxMenuInsertForm" className="form-inline" onSubmit={() => false}>
                <input type="hidden" id="ajax_menu_title" />

                <div className="form-group">
                  <input type="text" className="form-control" id="ajax_url" name="ajax_url" placeholder="Ajax 메뉴 Url 입력" />
                  <button type="button" className="btn btn-success" onClick={this.handleCreate}>추가</button>
                </div>
              </form>
              <form id="ajaxMenuUpdateForm" className="form-group">
                <input type="hidden" id="ajax_menu_id" name="menu_id" />
                <table className="table table-bordered table-condensed">
                  <colgroup>
                    <col width="25" />
                    <col width="25" />
                    <col width="" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th />
                      <th>ID</th>
                      <th>Ajax 메뉴 URL</th>
                    </tr>
                  </thead>
                  <tbody id="ajaxMenuBody" />
                </table>
              </form>
            </div>
            <div className="modal-footer">
              <div className="btn-group pull-left">
                <button className="btn btn-warning btn-sm" onClick={this.handleDelete}>삭제</button>
              </div>
              <div className="btn-group pull-right">
                <button className="btn btn-primary btn-sm" onClick={this.handleUpdate}>저장</button>
                <button className="btn btn-default btn-sm" data-dismiss="modal" aria-hidden="true">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

