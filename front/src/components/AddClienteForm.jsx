import React, { useState, useEffect } from "react";
import {
  addCliente,
  getClientes,
  delCliente,
  getClienteId,
} from "../helpers/rutaClientes";
import { getLocalidades } from "../helpers/rutaLocalidades";
import { getRutas } from "../helpers/rutaRutas";
import { getIva } from "../helpers/rutaIva";
import "../css/addclienteform.css";

const AddClienteForm = ({ setShow }) => {
  //const id = JSON.parse(localStorage.getItem("id"));
  const [formValues, setFormValues] = useState({
    codcli: "",
    razonsocial: "",
    domicilio: "",
    telefono: "",
    cuit: "",
    email: "",
    localidad: "",
    condicioniva: "",
    ruta: "",
    lat: "",
    lng: "",

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
    addCliente(formValues).then((resp) => {
      console.log(resp);
      setFormValues({
        codcli: "",
        razonsocial: "",
        domicilio: "",
        telefono: "",
        cuit: "",
        email: "",
        localidad: "",
        condicioniva: "",
        ruta: "",
        lat:"", 
        lng:"",

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
      {!localidades.loading && !iva.loading && !rutas.loading && (
        <div className="container">
          {/* {localidades.data.localidades.map((localidad) => (
            <h3>{localidad.localidad}</h3>
          ))} */}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              {/* <div className="form-group mt-3 col-sm-2">
                <label className="">Codigo Cliente</label>
                <input
                  type="text"
                  className="form-control"
                  name="codcli"
                  maxLength="20"
                  required
                  value={formValues.codcli}
                  onChange={handleChange}
                />
                {console.log(formValues.codcli)}
              </div> */}

              <div className="form-group mt-3 col-sm-5">
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

              <div className="form-group mt-3 col-sm-4">
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

              <div className="form-group mt-3 col-sm-3">
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

            <div className="form-row">
              <div className="form-group mt-3 col-sm-2">
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

              <div className="form-group mt-3 col-sm-4">
                <label className="">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  maxLength="50"
                  required
                  value={formValues.email}
                  onChange={handleChange}
                />
                {console.log(formValues.email)}
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Localidad</label>
                <select
                  className="form-control"
                  name="localidad"
                  value={formValues.localidad}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {localidades.data.localidades.map((localidad) => (
                    <option value={localidad._id}>{localidad.localidad}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Cond. IVA</label>
                <select
                  className="form-control"
                  name="condicioniva"
                  value={formValues.condidicioniva}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {iva.data.iva.map((iva) => (
                    <option value={iva._id}>{iva.iva}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Ruta</label>
                <select
                  className="form-control"
                  name="ruta"
                  value={formValues.ruta}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {rutas.data.rutas.map((ruta) => (
                    <option value={ruta._id}>{ruta.ruta}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group mt-3 col-sm-2">
                <label className="">Latitud</label>
                <input
                  type="text"
                  className="form-control"
                  name="lat"
                  maxLength="20"
                  value={formValues.lat}
                  onChange={handleChange}
                />
                {console.log(formValues.lat)}
              </div>
              <div className="form-group mt-3 col-sm-2">
                <label className="">Longitud</label>
                <input
                  type="text"
                  className="form-control"
                  name="lng"
                  maxLength="20"
                  value={formValues.lng}
                  onChange={handleChange}
                />
                {console.log(formValues.lng)}
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

export default AddClienteForm;

{
  /* <div className="form-group">
        <label>Estado Propiedad</label>
        <select
          className="form-control"
          name="EstadoPropiedad"
          value={formValues.EstadoPropiedad}
          onChange={handleChange}
          required>
          <option selected value="">Elija la opción adecuada</option>
          <option value="Venta">Venta</option>
          <option value="Alquiler">Alquiler</option>
          <option value="Venta-Alquiler">Venta-Alquiler</option>
        </select>
      </div> */
}
