import React from "react";
import { Modal, Button } from "react-bootstrap";

function ConfirmationModal ({ show, name, handleClose, handleDelete }) {

  return (
    <Modal show={show} onHide={handleClose} className="confirmation" style={{display: "none"}}>
      <Modal.Header closeButton>
        <Modal.Title>Удаление {name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Вы уверены, что хотите удалить {name}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
  
}

export default ConfirmationModal;