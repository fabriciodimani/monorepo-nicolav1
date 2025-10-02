import React from "react";
import AddLocalidadForm from "./AddLocalidadForm";

const AddLocalidad = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="col-12">
        <button className="btn btn-dark" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Localidad"}
        </button>
      </div>
      {show && (
        <div className="col-md-8 offset-md-2 mb-3">
          <AddLocalidadForm setShow={setShow} />
        </div>
      )}
    </>
  );
};
export default AddLocalidad;
