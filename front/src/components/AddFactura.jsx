import React from "react";
import AddFacturaForm from "./AddFacturaForm";

const AddFactura = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="col-12">
        <button className="btn btn-dark" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Factura"}
        </button>
      </div>
      {show && (
        <div className="col-md-8 offset-md-2 mb-3">
          <AddFacturaForm setShow={setShow} />
        </div>
      )}
    </>
  );
};

export default AddFactura;
