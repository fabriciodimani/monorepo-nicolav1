import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormMarca from "./ModalFormMarca";

const ModalMarca = ({ show, handleClose, marca }) => {
  console.log(marca);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Marca</Modal.Title>
      </Modal.Header>
      <ModalFormMarca marca={marca} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalMarca;
