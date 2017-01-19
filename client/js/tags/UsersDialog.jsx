import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class UsersDialog extends React.Component {
  renderAdmins() {
    const { loading, data } = this.props;

    if (loading) {
      return <span>불러오는 중입니다</span>;
    }

    return (
      <ul id="tag_admins">
        {data.map(admin => (
          <li key={admin.id}>
            <h4>
              <a className="label label-default" href={`/super/users/${admin.id}`} target="_blank" rel="noopener noreferrer">{admin.name}</a>
            </h4>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { show, onClose } = this.props;
    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>태그 사용자 관리</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderAdmins()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UsersDialog.propTypes = {
  loading: React.PropTypes.bool,
  data: React.PropTypes.array,
  show: React.PropTypes.bool,
  onClose: React.PropTypes.func,
};
