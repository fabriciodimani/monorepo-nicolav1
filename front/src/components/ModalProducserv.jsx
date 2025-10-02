import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormProducserv from "./ModalFormProducserv";

const ModalProducserv = ({ show, handleClose, producserv }) => {
  console.log(producserv);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Productos/Servicios</Modal.Title>
      </Modal.Header>
      <ModalFormProducserv producserv={producserv} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalProducserv;
