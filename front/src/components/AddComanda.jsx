import React from "react";
import AddComandaForm from "./AddComandaForm";
import "../css/admin.css";

const AddComanda = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="">
        <div className="">
          <button className="btn btn-dark" onClick={handleShow}>
            {show ? "Ocultar Form" : "Agregar Comanda"}
          </button>
          <hr />
        </div>
        {show && (
          <div className="col offset-md-2 mb-3">
            <AddComandaForm setShow={setShow} />
          </div>
        )}
      </div>
    </>
  );
};
export default AddComanda;
