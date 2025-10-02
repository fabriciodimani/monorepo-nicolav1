import React from "react";
import { Modal } from "react-bootstrap";
import ModalFormCamion from "./ModalFormCamion";

const ModalCamion = ({ show, handleClose, comanda }) => {
  console.log(comanda);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Cantidad Entregada</Modal.Title>
      </Modal.Header>
      <ModalFormCamion comanda={comanda} handleClose={handleClose} />
    </Modal>
  );
};

export default ModalCamion;
