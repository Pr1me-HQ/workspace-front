import React, { useState } from 'react';
import '../Modal.css';

const Modal = (props) => {
  const [isOpen, setIsOpen] = useState(props.open);

  const handleClose = () => {
    setIsOpen(false);
    props.onClose();
  }

  return (
    <>
    {isOpen && (
      <div className="modal-overlay">
        <div className="modal-content animated fadeIn">
          <button className="modal-close-button" onClick={handleClose}>
            X
          </button>
          {props.children}
        </div>
      </div>
    )}
    </>
  );
};

export default Modal;
