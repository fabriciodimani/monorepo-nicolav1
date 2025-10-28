import React, { useState, useEffect } from "react";
import { addProveedor } from "../helpers/rutaProveedores";
import { getLocalidades } from "../helpers/rutaLocalidades";
import { getIva } from "../helpers/rutaIva";
import "../css/addclienteform.css";

const AddProveedorForm = ({ setShow }) => {
  //const id = JSON.parse(localStorage.getItem("id"));
  const [formValues, setFormValues] = useState({
    codprov: "",
    razonsocial: "",
    domicilio: "",
    telefono: "",
    cuit: "",
    email: "",
    localidad: "",
    condicioniva: "",
    ruta: "",
    saldo: "0",

    // usuario: id,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === "saldo" ? value.replace(/[^0-9,.-]/g, "") : value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: nextValue,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const saldoNormalizado = () => {
      if (formValues.saldo === null || formValues.saldo === undefined) {
        return 0;
      }

      const normalizado = String(formValues.saldo).replace(/,/g, ".");
      const numero = Number(normalizado);

      return Number.isNaN(numero) ? 0 : numero;
    };

    addProveedor({
      ...formValues,
      saldo: saldoNormalizado(),
    }).then((resp) => {
      console.log(resp);
      setFormValues({
        codprov: "",
        razonsocial: "",
        domicilio: "",
        telefono: "",
        cuit: "",
        email: "",
        localidad: "",
        condicioniva: "",
        ruta: "",
        saldo: "0",
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
              <div className="form-group mt-3 col-sm-2">
                <label className="">Cod Prov</label>
                <input
                  type="text"
                  className="form-control"
                  name="codprov"
                  maxLength="20"
                  required
                  value={formValues.codprov}
                  onChange={handleChange}
                />
                {console.log(formValues.codprov)}
              </div>

              <div className="form-group mt-3 col-sm-4">
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

              <div className="form-group mt-3 col-sm-2">
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

              <div className="form-group mt-3 col-sm-3">
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

              <div className="form-group mt-3 col-sm-3">
                <label className="">Condicion IVA</label>
                <select
                  className="form-control"
                  name="condicioniva"
                  value={formValues.condicioniva}
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
                <label className="saldo-inicial-label">Saldo Inicial</label>
                <input
                  type="number"
                  className="form-control saldo-inicial-input"
                  name="saldo"
                  value={formValues.saldo}
                  step="0.01"
                  inputMode="decimal"
                  onChange={handleChange}
                />
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

export default AddProveedorForm;
