import React, { useState, useEffect } from "react";
import { addEmpresa } from "../helpers/rutaEmpresas";
import { addLocalidad } from "../helpers/rutaLocalidades";
import { getLocalidades } from "../helpers/rutaLocalidades";
import { getProvincias } from "../helpers/rutaProvincias";
import { getIva } from "../helpers/rutaIva";
import "../css/addlocalidadform.css";

const AddLocalidadForm = ({ setShow }) => {
  //const id = JSON.parse(localStorage.getItem("id"));
  const [formValues, setFormValues] = useState({
    localidad: "",
    codigopostal: "",
    provincia: "",

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
    addLocalidad(formValues).then((resp) => {
      console.log(resp);
      setFormValues({
        localidad: "",
        codigopostal: "",
        provincia: "",
      });
      //   setShow(false);
    });
  };

  const [localidades, setLocalidades] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getLocalidades().then((localidades) => {
      setLocalidades({
        data: localidades,
        loading: false,
      });
    });
  }, []);

  const [provincias, setProvincias] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getProvincias().then((provincias) => {
      setProvincias({
        data: provincias,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!localidades.loading && !provincias.loading && (
        <div className="container">
          {/* {localidades.data.localidades.map((localidad) => (
            <h3>{localidad.localidad}</h3>
          ))} */}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group mt-3 col-sm-4">
                <label className="">Localidad</label>
                <input
                  type="text"
                  className="form-control"
                  name="localidad"
                  maxLength="50"
                  required
                  value={formValues.localidad}
                  onChange={handleChange}
                />
                {console.log(formValues.localidad)}
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Codigo Postal</label>
                <input
                  type="text"
                  className="form-control"
                  name="codigopostal"
                  maxLength="4"
                  required
                  value={formValues.codigopostal}
                  onChange={handleChange}
                />
                {console.log(formValues.codigopostal)}
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Provincia</label>
                <select
                  className="form-control"
                  name="provincia"
                  value={formValues.provincia}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {provincias.data.provincias.map((provincia) => (
                    <option value={provincia._id}>{provincia.provincia}</option>
                  ))}
                </select>
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

export default AddLocalidadForm;
