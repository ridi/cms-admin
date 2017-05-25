import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Label } from 'react-bootstrap';

const LogDetailDlg = (props) => {
  let contents = null;
  if (props.loading) {
    contents = 'Loading...';
  } else {
    contents = (!props.datas || props.datas.length === 0) ? '전부 삭제되었습니다.' :
      props.datas.map(data => <h4 key={data.id}><Label>{data.title}</Label>&nbsp;</h4>);
  }
  return (
    <Modal show={props.show}>
      <Modal.Header>
        <h4>{props.title}</h4>
      </Modal.Header>
      <Modal.Body>
        {contents}
      </Modal.Body>
      <Modal.Footer>
        <Button bsSize="small" onClick={props.onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

LogDetailDlg.propTypes = {
  show: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  datas: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LogDetailDlg;
