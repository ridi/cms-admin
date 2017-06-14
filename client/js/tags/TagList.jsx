import React from 'react';
import PropTypes from 'prop-types';
import TagRow from './TagRow';

export default class TagList extends React.Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    // 태그 목록 컬럼 변동 시 check
    $('#updateForm input[name=name], #updateForm input[name=is_use]').change(function onChange() {
      const $tr = $(this).parents('tr');
      $tr.find('input[name=changed]').prop('checked', true);
    });
  }

  handleDelete() {
    if (!confirm('선택한 항목들을 삭제하시겠습니까?')) {
      return;
    }

    $('#updateForm input[name=changed]:checked').map((i, e) => {
      const $tr = $(e).parents('tr');
      const tagId = $tr.find('input[name=id]').val();

      $.ajax({
        url: `/super/tags/${tagId}`,
        type: 'DELETE',
      }).done((result) => {
        if (result.success) {
          $tr.detach();
        }
      });

      return null;
    });
  }

  handleUpdate() {
    const args = $('#updateForm input[name=changed]:checked').map((i, e) => {
      const $tr = $(e).parents('tr');
      const tagId = $tr.find('input[name=id]').val();
      const data = {
        name: $tr.find('input[name=name]').val(),
        is_use: $tr.find('input[name=is_use]').prop('checked'),
      };

      return $.ajax({
        url: `/super/tags/${tagId}`,
        type: 'PUT',
        data,
      });
    });

    $.when(...args).done(() => {
      window.location.reload();
    });
  }

  render() {
    const { tags, onMenusCountClick, onActiveUsersCountClick, onInactiveUsersCountClick } = this.props;

    return (
      <form id="updateForm" className="form-horizontal form-inline">
        <h4>태그 목록</h4>
        <table className="table table-bordered">
          <colgroup>
            <col width="20" />
            <col width="20" />
            <col width="" />
            <col width="80" />
            <col width="80" />
            <col width="140" />
            <col width="140" />
            <col width="90" />
            <col width="90" />
            <col width="90" />
          </colgroup>
          <thead>
            <tr>
              <th />
              <th>ID</th>
              <th>태그 이름</th>
              <th>생성자</th>
              <th>사용 여부</th>
              <th>최초 생성일</th>
              <th>최근 수정일</th>
              <th>포함된 메뉴</th>
              <th>사용 중인<br/>활성화 계정</th>
              <th>사용 중인<br/>비활성화 계정</th>
            </tr>
          </thead>
          <tbody>
            {
              tags.map(tag =>
                <TagRow
                  key={tag.id}
                  id={tag.id}
                  isUse={tag.is_use}
                  name={tag.name}
                  creator={tag.creator ? tag.creator : ''}
                  createdAt={tag.created_at}
                  updatedAt={tag.updated_at}
                  menusCount={tag.menus_count}
                  activeUsersCount={tag.active_users_count}
                  inactiveUsersCount={tag.inactive_users_count}
                  onMenusCountClick={() => onMenusCountClick(tag.id)}
                  onActiveUsersCountClick={() => onActiveUsersCountClick(tag.id)}
                  onInactiveUsersCountClick={() => onInactiveUsersCountClick(tag.id)}
                />)
            }
          </tbody>
        </table>
        <div>
          <div className="pull-right">
            <button type="button" className="btn btn-danger" id="js_delete" onClick={this.handleDelete}>삭제</button>
            <button type="button" className="btn btn-primary" id="updateBtn" onClick={this.handleUpdate}>저장</button>
          </div>
        </div>
      </form>
    );
  }
}

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    is_use: PropTypes.bool,
    creator: PropTypes.string,
  })).isRequired,
  onMenusCountClick: PropTypes.func.isRequired,
  onActiveUsersCountClick: PropTypes.func.isRequired,
  onInactiveUsersCountClick: PropTypes.func.isRequired,
};

