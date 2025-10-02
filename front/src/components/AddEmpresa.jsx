import React from "react";
import AddEmpresaForm from "./AddEmpresaForm";

const AddEmpresa = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="col-12">
        <button className="btn btn-outline-info" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Empresa"}
        </button>
      </div>
      {show && (
        <div className="col-md-8 offset-md-2 mb-3">
          <AddEmpresaForm setShow={setShow} />
        </div>
      )}
    </>
  );
};
export default AddEmpresa;
