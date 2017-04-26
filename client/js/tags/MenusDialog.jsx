import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Select2Input from '../Select2Input';

export default class MenusDialog extends React.Component {
  renderBody() {
    const { tagId, loading, selected, data, onAdd, onDelete } = this.props;

    if (loading) {
      return <p>불러오는 중입니다...</p>;
    }

    return (
      <Select2Input
        name="menuSelect"
        value={loading ? [] : selected}
        data={data}
        multiple
        placeholder="권한 추가하기"
        onAdd={id => onAdd(tagId, id)}
        onRemove={id => onDelete(tagId, id)}
      />
    );
  }

  render() {
    const { show, onClose } = this.props;

    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>태그 메뉴 관리</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.renderBody() }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

MenusDialog.propTypes = {
  tagId: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  selected: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
