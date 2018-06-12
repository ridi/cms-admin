import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Select2Input from './Select2Input';

export default class SelectModal extends React.Component {
  renderBody() {
    const {
      title, subjectId, loading, selectedItems, data, disabled, onAdd, onDelete,
    } = this.props;

    if (loading) {
      return <p>불러오는 중입니다...</p>;
    }

    return (
      <Select2Input
        id="menuSelect"
        value={loading ? [] : selectedItems}
        data={data}
        disabled={disabled}
        multiple
        placeholder="추가하기"
        onAdd={id => onAdd(subjectId, id)}
        onRemove={id => onDelete(subjectId, id)}
      />
    );
  }

  render() {
    const { show, onClose, title } = this.props;

    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
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

SelectModal.defaultProps = {
  disabled: false,
  selectedItems: null,
};

SelectModal.propTypes = {
  title: PropTypes.string.isRequired,
  subjectId: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  disabled: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    text: PropTypes.string,
  })).isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
