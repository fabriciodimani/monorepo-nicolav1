import React from "react";
import AddRutaForm from "./AddRutaForm";

const AddRuta = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="col-12">
        <button className="btn btn-dark" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Ruta"}
        </button>
      </div>
      {show && (
        <div className="col-md-8 offset-md-2 mb-3">
          <AddRutaForm setShow={setShow} />
        </div>
      )}
    </>
  );
};
export default AddRuta;
