import React, { useState, useEffect } from "react";
import { addCliente } from "../helpers/rutaClientes";
import { addProducserv } from "../helpers/rutaProducservs";
import { getRubros } from "../helpers/rutaRubros";
import { getMarcas } from "../helpers/rutaMarcas";
import { getUnidades } from "../helpers/rutaUnidades";
import { getLocalidades } from "../helpers/rutaLocalidades";
import { getRutas } from "../helpers/rutaRutas";
import { getIva } from "../helpers/rutaIva";
import "../css/addclienteform.css";

const AddProducservForm = ({ setShow }) => {
  //const id = JSON.parse(localStorage.getItem("id"));
  const [formValues, setFormValues] = useState({
    codprod: "",
    descripcion: "",
    rubro: "",
    marca: "",
    unidaddemedida: "",
    tipo: "",
    iva: "",
    stkactual: "",
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
    addProducserv(formValues).then((resp) => {
      console.log(resp);
      setFormValues({
        codprod: "",
        descripcion: "",
        rubro: "",
        marca: "",
        unidaddemedida: "",
        tipo: "",
        iva: "",
        stkactual: "",
      });
      //   setShow(false);
    });
  };

  const [rubros, setRubros] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getRubros().then((rubros) => {
      setRubros({
        data: rubros,
        loading: false,
      });
    });
  }, []);

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

  const [unidades, setUnidades] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getUnidades().then((unidades) => {
      setUnidades({
        data: unidades,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!rubros.loading && !marcas.loading && !unidades.loading && (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group mt-3 col-sm-3">
                <label className="">Cod. Prod/Serv</label>
                <input
                  type="text"
                  className="form-control"
                  name="codprod"
                  maxLength="13"
                  required
                  value={formValues.codprod}
                  onChange={handleChange}
                />
                {console.log(formValues.codprod)}
              </div>

              <div className="form-group mt-3 col-sm-9">
                <label className="">Descripcion</label>
                <input
                  type="text"
                  className="form-control"
                  name="descripcion"
                  maxLength="50"
                  required
                  value={formValues.descripcion}
                  onChange={handleChange}
                />
                {console.log(formValues.descripcion)}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group mt-3 col-sm-2">
                <label className="">Rubros</label>
                <select
                  className="form-control"
                  name="rubro"
                  value={formValues.rubro}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {rubros.data.rubros.map((rubro) => (
                    <option value={rubro._id}>{rubro.rubro}</option>
                  ))}
                </select>
                {console.log(formValues.rubro._id)}
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Marcas</label>
                <select
                  className="form-control"
                  name="marca"
                  value={formValues.marca}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {marcas.data.marcas.map((marca) => (
                    <option value={marca._id}>{marca.marca}</option>
                  ))}
                </select>
                {console.log(formValues.marca._id)}
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Unid. Medida</label>
                <select
                  className="form-control"
                  name="unidaddemedida"
                  value={formValues.unidaddemedida}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {unidades.data.unidades.map((unidaddemedida) => (
                    <option value={unidaddemedida._id}>
                      {unidaddemedida.unidaddemedida}
                    </option>
                  ))}
                </select>
                {console.log(formValues.unidaddemedida._id)}
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Tipo</label>
                <select
                  className="form-control"
                  name="tipo"
                  value={formValues.tipo}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  <option>PRODUCTO</option>
                  <option>SERVICIO</option>
                </select>
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Iva</label>
                <select
                  className="form-control"
                  name="iva"
                  value={formValues.iva}
                  onChange={handleChange}
                  // required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  <option>10.5</option>
                  <option>21</option>
                </select>
              </div>

              <div className="form-group mt-3 col-sm-2">
                <label className="">Stock Actual</label>
                <input
                  type="text"
                  className="form-control"
                  name="stkactual"
                  maxLength="5"
                  required
                  value={formValues.stkactual}
                  onChange={handleChange}
                />
                {console.log(formValues.stkactual)}
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

export default AddProducservForm;
