import React, { useState, useEffect } from "react";
import { addEmpresa } from "../helpers/rutaEmpresas";
import { getLocalidades } from "../helpers/rutaLocalidades";
import { getIva } from "../helpers/rutaIva";
import "../css/addempresaform.css";

const AddEmpresaForm = ({ setShow }) => {
  const id = JSON.parse(localStorage.getItem("id"));

  console.log(id);

  const [formValues, setFormValues] = useState({
    razonsocial: "",
    domicilio: "",
    telefono: "",
    cuit: "",
    email: "",
    localidad: "",
    condicioniva: "",
    usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addEmpresa(formValues).then((resp) => {
      console.log(resp);
      setFormValues({
        razonsocial: "",
        domicilio: "",
        telefono: "",
        cuit: "",
        email: "",
        localidad: "",
        condicioniva: "",
        usuario: id,
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

  const [iva, setIva] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getIva().then((iva) => {
      setIva({
        data: iva,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!localidades.loading && !iva.loading && (
        <div className="container">
          {/* {localidades.data.localidades.map((localidad) => (
            <h3>{localidad.localidad}</h3>
          ))} */}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-sm-5">
                <label className="">Razon Social</label>
                <input
                  type="text"
                  className="form-control"
                  name="razonsocial"
                  maxLength="50"
                  required
                  value={formValues.razonsocial}
                  onChange={handleChange}
                />
                {console.log(formValues.razonsocial)}
              </div>

              <div className="form-group col-sm-5">
                <label className="">Domicilio</label>
                <input
                  type="text"
                  className="form-control"
                  name="domicilio"
                  maxLength="50"
                  required
                  value={formValues.domicilio}
                  onChange={handleChange}
                />
                {console.log(formValues.domicilio)}
              </div>

              <div className="form-group col-sm-2">
                <label className="">Telefono</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  maxLength="20"
                  required
                  value={formValues.telefono}
                  onChange={handleChange}
                />
                {console.log(formValues.telefono)}
              </div>
            </div>

            <div className="form-row mt-5">
              <div className="form-group col-sm-2">
                <label className="">CUIT</label>
                <input
                  type="text"
                  className="form-control"
                  name="cuit"
                  maxLength="11"
                  required
                  value={formValues.cuit}
                  onChange={handleChange}
                />
                {console.log(formValues.cuit)}
              </div>

              <div className="form-group col-sm-4">
                <label className="">Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  maxLength="50"
                  required
                  value={formValues.email}
                  onChange={handleChange}
                />
                {console.log(formValues.email)}
              </div>

              <div className="form-group col-sm-3">
                <label className="">Localidad</label>
                <select
                  className="form-control"
                  name="localidad"
                  value={formValues.localidad}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija la opción adecuada
                  </option>
                  {localidades.data.localidades.map((localidad) => (
                    <option value={localidad._id}>{localidad.localidad}</option>
                  ))}
                </select>
              </div>

              <div className="form-group col-sm-3">
                <label className="">Condicion de IVA</label>
                <select
                  className="form-control"
                  name="condicioniva"
                  value={formValues.condidicioniva}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija la opción adecuada
                  </option>
                  {iva.data.iva.map((iva) => (
                    <option value={iva._id}>{iva.iva}</option>
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
      ;
    </>
  );
};

export default AddEmpresaForm;
