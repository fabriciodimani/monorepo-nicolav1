import React, { useState, useEffect } from "react";
import { addMarca } from "../helpers/rutaMarcas";
import { getLocalidades } from "../helpers/rutaLocalidades";
import { getMarcas } from "../helpers/rutaMarcas";
import { getIva } from "../helpers/rutaIva";
import "../css/addclienteform.css";

const AddMarcaForm = ({ setShow }) => {
  //const id = JSON.parse(localStorage.getItem("id"));
  const [formValues, setFormValues] = useState({
    codmarca: "",
    marca: "",
    // usuario: id,
  });
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addMarca(formValues).then((resp) => {
      console.log(resp);
      setFormValues({
        codmarca: "",
        marca: "",
      });
      //   setShow(false);
    });
  };

  const [marcas, setMarcas] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getMarcas().then((marcas) => {
      setMarcas({
        data: marcas,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!marcas.loading && (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group mt-3 col-sm-2">
                <label className="">Codigo Marca</label>
                <input
                  type="text"
                  className="form-control"
                  name="codmarca"
                  maxLength="13"
                  required
                  value={formValues.codmarca}
                  onChange={handleChange}
                />
                {console.log(formValues.codmarca)}
              </div>
              <div className="form-group mt-3 col-sm-4">
                <label className="">Marca</label>
                <input
                  type="text"
                  className="form-control"
                  name="marca"
                  maxLength="30"
                  required
                  value={formValues.marca}
                  onChange={handleChange}
                />
                {console.log(formValues.marca)}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-dark mt-5 mb-3"
                id="button"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddMarcaForm;
