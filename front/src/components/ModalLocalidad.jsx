import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormLocalidad from "./ModalFormLocalidad";

const ModalLocalidad = ({ show, handleClose, localidad }) => {
  console.log(localidad);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Localidad</Modal.Title>
      </Modal.Header>
      <ModalFormLocalidad localidad={localidad} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalLocalidad;
