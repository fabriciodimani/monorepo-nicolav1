import React from "react";
import AddProveedorForm from "./AddProveedorForm";

const AddProveedor = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="col-12">
        <button className="btn btn-dark" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Proveedor"}
        </button>
      </div>
      {show && (
        <div className="col-md-8 offset-md-2 mb-3">
          <AddProveedorForm setShow={setShow} />
        </div>
      )}
    </>
  );
};
export default AddProveedor;
