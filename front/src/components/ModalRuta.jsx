import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormRuta from "./ModalFormRuta";

const ModalRuta = ({ show, handleClose, ruta }) => {
  console.log(ruta);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Ruta</Modal.Title>
      </Modal.Header>
      <ModalFormRuta ruta={ruta} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalRuta;
