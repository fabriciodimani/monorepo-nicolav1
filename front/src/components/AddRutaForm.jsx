import React, { useState, useEffect } from "react";
import { addRuta } from "../helpers/rutaRutas";
import { getLocalidades } from "../helpers/rutaLocalidades";
import { getRutas } from "../helpers/rutaRutas";
import { getIva } from "../helpers/rutaIva";
import "../css/addclienteform.css";

const AddRutaForm = ({ setShow }) => {
  //const id = JSON.parse(localStorage.getItem("id"));
  const [formValues, setFormValues] = useState({
    ruta: "",
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
    addRuta(formValues).then((resp) => {
      console.log(resp);
      setFormValues({
        ruta: "",
      });
      //   setShow(false);
    });
  };

  const [rutas, setRutas] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getRutas().then((rutas) => {
      setRutas({
        data: rutas,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!rutas.loading && (
        <div className="container">
          {/* {localidades.data.localidades.map((localidad) => (
            <h3>{localidad.localidad}</h3>
          ))} */}

          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3 col-sm-6">
              <label className="">Rutas</label>
              <input
                type="text"
                className="form-control"
                name="ruta"
                maxLength="30"
                required
                value={formValues.ruta}
                onChange={handleChange}
              />
              {console.log(formValues.ruta)}
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

export default AddRutaForm;
