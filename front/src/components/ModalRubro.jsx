import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormRubro from "./ModalFormRubro";

const ModalRubro = ({ show, handleClose, rubro }) => {
  console.log(rubro);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Rubro</Modal.Title>
      </Modal.Header>
      <ModalFormRubro rubro={rubro} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalRubro;
