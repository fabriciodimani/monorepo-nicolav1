import React from "react";
import AddClienteForm from "./AddClienteForm";

const AddCliente = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="">
        <button className="btn btn-dark" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Cliente"}
        </button>
      </div>
      {show && (
        <div className="mt-2">
          <AddClienteForm setShow={setShow} />
        </div>
      )}
    </>
  );
};
export default AddCliente;
