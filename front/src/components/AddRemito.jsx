import React from "react";
import AddRemitoForm from "./AddRemitoForm";
import "../css/admin.css";

const AddRemito = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="">
        <div className="">
          <button className="btn btn-dark" onClick={handleShow}>
            {show ? "Ocultar Form" : "Agregar Remito"}
          </button>
          <hr />
        </div>
        {show && (
          <div className="col offset-md-2 mb-3">
            <AddRemitoForm setShow={setShow} />
          </div>
        )}
      </div>
    </>
  );
};
export default AddRemito;
