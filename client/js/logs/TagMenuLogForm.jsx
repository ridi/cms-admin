import React from 'react';
import PropTypes from 'prop-types';
import { Button, Pagination, Table } from 'react-bootstrap';

class TagMenuLogForm extends React.Component {
  renderHead() {
    return (
      <thead>
        <tr>
          <th>실행 ID</th>
          <th>대상 ID</th>
          <th>변경한 시각</th>
          <th>메뉴 저장 내용</th>
          <th>태그 저장 내용</th>
        </tr>
      </thead>
    );
  }

  renderBody() {
    const { datas, loading, onShowMenuChange, onShowTagChange } = this.props;

    if (loading) {
      return (
        <tbody>
          <tr>
            <td colSpan="5" className="center">Loading...</td>
          </tr>
        </tbody>
      );
    }

    if (!datas || datas.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan="5" className="center">변경 내역이 없습니다.</td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>{
        datas.map(data => (
          <tr key={data.id}>
            <td><a href={`/super/users/${data.edited_by}`}>{data.edited_by}</a></td>
            <td><a href={`/super/users/${data.user_id}`}>{data.user_id}</a></td>
            <td>{data.created_at}</td>
            <td><Button bsSize="xsmall" onClick={() => onShowMenuChange(data)}>보기</Button></td>
            <td><Button bsSize="xsmall" onClick={() => onShowTagChange(data)}>보기</Button></td>
          </tr>
        ))
      }</tbody>
    );
  }

  renderFoot() {
    const { pageLength, nowPage, pageEnd, onSelectPage } = this.props;

    return (
      <tfoot>
        <tr>
          <td colSpan="5">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              items={pageEnd}
              maxButtons={pageLength}
              activePage={nowPage}
              onSelect={onSelectPage}
            />
          </td>
        </tr>
      </tfoot>
    );
  }

  render() {
    return (
      <form className="form-horizontal" method="POST">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">메뉴, 태그 변경 내역</h4>
          </div>
          <div className="panel-body">
            <Table striped bordered condensed hover>
              { this.renderHead() }
              { this.renderBody() }
              { this.renderFoot() }
            </Table>
          </div>
        </div>
      </form>
    );
  }
}

TagMenuLogForm.propTypes = {
  datas: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onShowMenuChange: PropTypes.func.isRequired,
  onShowTagChange: PropTypes.func.isRequired,
  pageLength: PropTypes.number.isRequired,
  nowPage: PropTypes.number.isRequired,
  pageEnd: PropTypes.number.isRequired,
  onSelectPage: PropTypes.func.isRequired,
};

export default TagMenuLogForm;
