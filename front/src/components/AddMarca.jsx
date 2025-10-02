import React from "react";
import AddMarcaForm from "./AddMarcaForm";

const AddMarca = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="col-12">
        <button className="btn btn-dark" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Marca"}
        </button>
      </div>
      {show && (
        <div className="col-md-8 offset-md-2 mb-3">
          <AddMarcaForm setShow={setShow} />
        </div>
      )}
    </>
  );
};
export default AddMarca;
