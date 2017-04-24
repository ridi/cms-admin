import React from 'react';
import { Modal, Button, Label } from 'react-bootstrap';

const LogDetailDlg = (props) => (
  <Modal show={props.show}>
    <Modal.Header>
      <h4>{props.title}</h4>
    </Modal.Header>
    <Modal.Body>
      {
        props.loading? 'Loading...' :
          (!props.datas || props.datas.length === 0)? '전부 삭제되었습니다.' :
            props.datas.map(data => <h4 key={data}><Label>{data}</Label>&nbsp;</h4>)
      }
    </Modal.Body>
    <Modal.Footer>
      <Button bsSize="small" onClick={props.onClose}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default LogDetailDlg;
