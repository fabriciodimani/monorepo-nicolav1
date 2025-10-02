import React from "react";
import AddPrecioForm from "./AddPrecioForm";

const AddPrecio = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="col-12">
        <button className="btn btn-dark" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Precios"}
        </button>
      </div>
      {show && (
        <div className="col-md-8 offset-md-2 mb-3">
          <AddPrecioForm setShow={setShow} />
        </div>
      )}
    </>
  );
};
export default AddPrecio;
