import React from "react";
import AddStockForm from "./AddStockForm";

const AddStock = ({ show, setShow }) => {
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div className="col-12">
        <button className="btn btn-outline-info" onClick={handleShow}>
          {show ? "Ocultar Form" : "Agregar Stocks"}
        </button>
      </div>
      {show && (
        <div className="col-md-8 offset-md-2 mb-3">
          <AddStockForm setShow={setShow} />
        </div>
      )}
    </>
  );
};
export default AddStock;
