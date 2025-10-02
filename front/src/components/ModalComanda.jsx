import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormComanda from "./ModalFormComanda";

const ModalComanda = ({ show, handleClose, comanda }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar comanda</Modal.Title>
      </Modal.Header>
      <ModalFormComanda comanda={comanda} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalComanda;
