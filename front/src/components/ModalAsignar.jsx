import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormAsignar from "./ModalFormAsignar";

const ModalAsignar = ({ show, handleClose, comanda }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Asignacion de Vehiculos Masivo</Modal.Title>
      </Modal.Header>
      <ModalFormAsignar comanda={comanda} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalAsignar;
