import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormFactura from "./ModalFormFactura";

const ModalFactura = ({ show, handleClose, factura }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Modificar Factura</Modal.Title>
    </Modal.Header>
    <ModalFormFactura factura={factura} handleClose={handleClose} />
  </Modal>
);

export default ModalFactura;
