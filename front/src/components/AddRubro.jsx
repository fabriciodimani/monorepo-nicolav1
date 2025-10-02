import React from "react";
import AddRubroForm from "./AddRubroForm";

const AddRubro = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="col-12">
        <button className="btn btn-dark" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Rubro"}
        </button>
      </div>
      {show && (
        <div className="col-md-8 offset-md-2 mb-3">
          <AddRubroForm setShow={setShow} />
        </div>
      )}
    </>
  );
};
export default AddRubro;
