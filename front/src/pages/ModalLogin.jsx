import React from "react";
import { Modal } from "react-bootstrap";
// import ModalFormCliente from "./ModalFormCliente";
import Login from "../pages/Login";

const ModalLogin = ({ show, handleClose, cliente }) => {
  console.log(cliente);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Cliente</Modal.Title>
      </Modal.Header>
      <Login />
      {/* <ModalFormCliente cliente={cliente} handleClose={handleClose} /> */}
    </Modal>
  );
};

export default ModalLogin;
