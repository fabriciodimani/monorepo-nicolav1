import React, { useState, useEffect } from "react";
import { modifComanda } from "../helpers/rutaComandas";

// import ComandaProvider from "../Context/ComandaContext";
// import BarraBusqueda from "../components/BarraBusqueda";

import { Modal, Button } from "react-bootstrap";
import { getClientes } from "../helpers/rutaClientes";
import { getProducservs } from "../helpers/rutaProducservs";
import { getListas } from "../helpers/rutaListas";
import { getEstados } from "../helpers/rutaEstados";
import { getCamiones } from "../helpers/rutaCamiones";

import "../css/modalcamion.css";

const ModalFormCamion = ({ comanda, handleClose }) => {
  console.log(comanda);
  const id = localStorage.getItem("id");
  const [formValues, setFormValues] = useState({
    codcli: comanda.comandas.codcli,
    lista: comanda.comandas.lista,
    codprod: comanda.comandas.codprod,
    cantidad: comanda.comandas.cantidad,
    monto: comanda.comandas.monto,
    codestado: comanda.comandas.codestado,
    camion: comanda.comandas.camion,
    cantidadentregada: comanda.comandas.cantidadentregada,
    fechadeentrega: comanda.comandas.fechadeentregada,
    entregado: comanda.comandas.entregado,
    // usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    // console.log(comanda.comandas._id);
    e.preventDefault();
    if (formValues.cantidad >= formValues.cantidadentregada) {
      modifComanda(formValues, comanda.comandas._id).then((respuesta) => {
        console.log(respuesta);
      });
      handleClose();
      alert(
        "Cambio Exitoso !!! " +
          "Su cantidad ingresada fue de: " +
          formValues.cantidadentregada
      );
      window.location.reload();
    } else {
      alert(
        "Revise la cantidad entregada, solo puede entregar: " +
          formValues.cantidad
      );
    }

    // <ComandaProvider>
    //   <BarraBusqueda />
    // </ComandaProvider>;
  };

  const [clientes, setClientes] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getClientes().then((clientes) => {
      setClientes({
        data: clientes,
        loading: false,
      });
    });
  }, []);

  const [listas, setListas] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getListas().then((listas) => {
      setListas({
        data: listas,
        loading: false,
      });
    });
  }, []);

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

  const [estados, setEstados] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getEstados().then((estados) => {
      setEstados({
        data: estados,
        loading: false,
      });
    });
  }, []);

  const [camiones, setCamiones] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getCamiones().then((camiones) => {
      setCamiones({
        data: camiones,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!clientes.loading &&
        !listas.loading &&
        !producservs.loading &&
        !estados.loading &&
        !camiones.loading && (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-group">
                <label>Cliente</label>
                <select
                  className="form-control"
                  name="codcli"
                  value={formValues.codcli}
                  // onChange={handleChange}
                  // required
                  disabled
                >
                  <option selected value="">
                    Elija la opción adecuada
                  </option>
                  {clientes.data.clientes.map((cliente) => (
                    <option value={cliente._id}>{cliente.razonsocial}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mt-3">
                <label>Producto/Servicio</label>
                <select
                  className="form-control"
                  name="codprod"
                  value={formValues.codprod}
                  // onChange={handleChange}
                  // required
                  disabled
                >
                  <option selected value="">
                    Elija la opción adecuada
                  </option>
                  {producservs.data.producservs.map((producserv) => (
                    <option value={producserv._id}>
                      {producserv.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mt-3">
                <label>Cantidad</label>
                <input
                  rows="1"
                  type="text"
                  className="form-control"
                  name="cantidad"
                  maxLength="4"
                  minLength="1"
                  required
                  value={formValues.cantidad}
                  disabled
                  // onChange={handleChange}
                />
              </div>

              <div className="form-group mt-3" id="cantent">
                <label>Cantidad Entregada</label>
                <input
                  rows="1"
                  type="text"
                  className="form-control"
                  id="form-controlcantent"
                  name="cantidadentregada"
                  maxLength="4"
                  minLength="1"
                  min="0"
                  required
                  value={formValues.cantidadentregada}
                  onChange={handleChange}
                />
              </div>
              {/* 
            <div className="form-group mt-3">
              <label>Precio Unitario</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="monto"
                maxLength="4"
                minLength="1"
                required
                value={formValues.monto}
                onChange={handleChange}
              />
            </div> */}

              {/* <div className="form-check mt-3">
                <label className="form-check-label mr-5" for="defaultCheck1">
                  Entregado
                </label>
                {formValues.entregado ? (
                  <input
                    className="form-check-input mr-5"
                    defaultChecked
                    name="entregado"
                    type="checkbox"
                    value={0}
                    onChange={handleChange}
                    id="flexCheckChecked"
                  />
                ) : (
                  <input
                    className="form-check-input mr-5"
                    name="entregado"
                    type="checkbox"
                    value={1}
                    onChange={handleChange}
                    id="flexCheckChecked"
                  />
                )}
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

export default ModalFormCamion;
