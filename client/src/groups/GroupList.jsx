import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';

export default class GroupList extends React.Component {
  componentDidMount() {
    // 태그 목록 컬럼 변동 시 check
    $('#updateForm input[name!=changed]').change(function onChange() {
      const $tr = $(this).parents('tr');
      $tr.find('input[name=changed]').prop('checked', true);
    });
  }

  handleUpdate() {
    const args = $('#updateForm input[name=changed]:checked').map((i, e) => {
      const $tr = $(e).parents('tr');
      const groupId = parseInt($tr.find('input[name=id]').val(), 10);
      const data = {
        name: $tr.find('input[name=name]').val(),
        is_use: $tr.find('input[name=is_use]').prop('checked'),
      };

      return axios.put(`/super/groups/${groupId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    Promise.all(args).then(() => {
      window.location.reload();
    });
  }

  handleDelete() {
    if (!window.confirm('선택한 항목들을 삭제하시겠습니까?')) {
      return;
    }

    const args = $('#updateForm input[name=changed]:checked').map((i, e) => {
      const $tr = $(e).parents('tr');
      const groupId = $tr.find('input[name=id]').val();

      return axios.delete(`/super/groups/${groupId}`);
    });

    Promise.all(args).then(() => {
      window.location.reload();
    });
  }

  renderHead() {
    return (
      <thead>
        <tr>
          <th />
          <th>ID</th>
          <th>태그 이름</th>
          <th>생성자</th>
          <th>사용 여부</th>
          <th>최초 생성일</th>
          <th>최근 수정일</th>
          <th>부여된 태그</th>
          <th>사용자</th>
        </tr>
      </thead>
    );
  }

  renderBody() {
    const { onShowTagsClick, onShowUsersClick } = this.props;

    return (
      <tbody>
        {
          this.props.groups.map((group) => {
            const {
              id, name, creator, is_use, created_at, updated_at,
            } = group;

            return (
              <tr key={id} className={!is_use ? 'danger' : ''}>
                <td>
                  <input type="checkbox" name="changed" />
                  <input type="hidden" name="id" value={id} />
                </td>
                <td>{id}</td>
                <td><input type="text" className="input-block-level" name="name" defaultValue={name} /></td>
                <td>{creator}</td>
                <td>
                  <input type="checkbox" className="input-block-level" name="is_use" defaultChecked={is_use} />
                </td>
                <td>{created_at}</td>
                <td>{updated_at}</td>
                <td>
                  <Button onClick={() => onShowTagsClick(id)}>보기</Button>
                </td>
                <td>
                  <Button onClick={() => onShowUsersClick(id)}>보기</Button>
                </td>
              </tr>
            );
          })
        }
      </tbody>
    );
  }


  render() {
    return (
      <form id="updateForm" className="form-horizontal form-inline">
        <h4>그룹 목록</h4>
        <Table striped bordered condensed hover>
          { this.renderHead() }
          { this.renderBody() }
        </Table>
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

GroupList.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    is_use: PropTypes.number,
    creator: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  })).isRequired,
  onShowTagsClick: PropTypes.func.isRequired,
  onShowUsersClick: PropTypes.func.isRequired,
};
