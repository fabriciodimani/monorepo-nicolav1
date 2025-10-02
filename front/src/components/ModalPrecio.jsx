import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormPrecio from "./ModalFormPrecio";

const ModalPrecio = ({ show, handleClose, precio }) => {
  console.log(precio);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Precio</Modal.Title>
      </Modal.Header>
      <ModalFormPrecio precio={precio} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalPrecio;
