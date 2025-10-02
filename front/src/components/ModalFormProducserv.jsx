import React, { useState, useEffect } from "react";
import { modifProducserv } from "../helpers/rutaProducservs";
import { Modal, Button } from "react-bootstrap";
import { getProducservs } from "../helpers/rutaProducservs";
import { getMarcas } from "../helpers/rutaMarcas";
import { getRubros } from "../helpers/rutaRubros";
// import { getUnidades } from "../helpers/rutaUnidades";

const ModalFormProducserv = ({ producserv, handleClose }) => {
  console.log(producserv);
  const id = localStorage.getItem("id");
  const [formValues, setFormValues] = useState({
    // codprod: producserv.producservs.codprod,
    descripcion: producserv.producservs.descripcion,
    rubro: producserv.producservs.rubro,
    marca: producserv.producservs.marca,
    tipo: producserv.producservs.tipo,
    stkactual: producserv.producservs.stkactual,
    // usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    console.log(producserv.producservs._id);
    e.preventDefault();
    modifProducserv(formValues, producserv.producservs._id).then(
      (respuesta) => {
        console.log(respuesta);
        handleClose();
      }
    );
  };

  const [producservs, setProducservs] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getProducservs().then((producservs) => {
      setProducservs({
        data: producservs,
        loading: false,
      });
    });
  }, []);

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

  return (
    <>
      {!producservs.loading && !rubros.loading && !marcas.loading && (
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* <div className="form-group">
              <label>Cod. Prod/Serv</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="codprod"
                maxLength="11"
                minLength="1"
                required
                value={formValues.codprod}
                onChange={handleChange}
              />
            </div> */}

            <div className="form-group mt-3">
              <label>Descripcion</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="descripcion"
                maxLength="50"
                minLength="5"
                required
                value={formValues.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Rubro</label>
              <select
                className="form-control"
                name="rubro"
                value={formValues.rubro}
                onChange={handleChange}
                required
              >
                <option selected value="">
                  Elija la opción adecuada
                </option>
                {rubros.data.rubros.map((rubro) => (
                  <option value={rubro._id}>{rubro.rubro}</option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Marca</label>
              <select
                className="form-control"
                name="marca"
                value={formValues.marca}
                onChange={handleChange}
                required
              >
                <option selected value="">
                  Elija la opción adecuada
                </option>
                {marcas.data.marcas.map((marca) => (
                  <option value={marca._id}>{marca.marca}</option>
                ))}
              </select>
            </div>

            {/* <div className="form-group mt-3">
              <label>Stock Actual</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="stkactual"
                maxLength="30"
                minLength="1"
                required
                value={formValues.stkactual}
                onChange={handleChange}
              />
            </div> */}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="dark">
              Guardar
            </Button>
          </Modal.Footer>
        </form>
      )}
      ;
    </>
  );
};

export default ModalFormProducserv;
