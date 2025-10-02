import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormProveedor from "./ModalFormProveedor";

const ModalProveedor = ({ show, handleClose, proveedor }) => {
  console.log(proveedor);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Proveedor</Modal.Title>
      </Modal.Header>
      <ModalFormProveedor proveedor={proveedor} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalProveedor;
