import React, { useState, useEffect } from "react";
import { modifCliente } from "../helpers/rutaClientes";
import { Modal, Button } from "react-bootstrap";
import { getClientes } from "../helpers/rutaClientes";
import { getLocalidades } from "../helpers/rutaLocalidades";
import { getRutas } from "../helpers/rutaRutas";

const ModalFormCliente = ({ cliente, handleClose }) => {
  console.log(cliente);
  const id = localStorage.getItem("id");
  const saldoActual = cliente && cliente.clientes ? cliente.clientes.saldo : 0;
  const [formValues, setFormValues] = useState({
    codcli: cliente.clientes.codcli,
    razonsocial: cliente.clientes.razonsocial,
    domicilio: cliente.clientes.domicilio,
    telefono: cliente.clientes.telefono,
    cuit: cliente.clientes.cuit,
    email: cliente.clientes.email,
    localidad: cliente.clientes.localidad,
    ruta: cliente.clientes.ruta,
    lat: cliente.clientes.lat,
    lng: cliente.clientes.lng,
    // usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    console.log(cliente.clientes._id);
    e.preventDefault();
    modifCliente(formValues, cliente.clientes._id).then((respuesta) => {
      console.log(respuesta);
      handleClose();
    });
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
      {!clientes.loading && !localidades.loading && !rutas.loading && (
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* <div className="form-group">
            <label>Cod. Cliente</label>
            <input 
              rows="1"
              type="text"
              className="form-control"
              name="codcli"
              maxLength="4"
              minLength="1"
              required
              value={formValues.codcli}
              onChange={handleChange}
            />
          </div> */}

            <div className="form-group mt-3">
              <label>Razon Social</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="razonsocial"
                maxLength="50"
                minLength="5"
                required
                value={formValues.razonsocial}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Domicilio</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="domicilio"
                maxLength="50"
                minLength="5"
                required
                value={formValues.domicilio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Telefono</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="telefono"
                maxLength="30"
                minLength="5"
                required
                value={formValues.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>CUIT</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="cuit"
                maxLength="11"
                minLength="11"
                required
                value={formValues.cuit}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Email</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="email"
                maxLength="50"
                minLength="5"
                required
                value={formValues.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Localidad</label>
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

            <div className="form-group mt-3">
              <label>Rutas</label>
              <select
                className="form-control"
                name="ruta"
                value={formValues.ruta}
                onChange={handleChange}
                required
              >
                <option selected value="">
                  Elija la opción adecuada
                </option>
                {rutas.data.rutas.map((rutas) => (
                  <option value={rutas._id}>{rutas.ruta}</option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Saldo actual</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="saldo"
                value={saldoActual}
                readOnly
              />
            </div>

            <div className="form-group mt-3">
              <label>Latitud</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="lat"
                maxLength="20"
                minLength="1"
                required
                value={formValues.lat}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Longitud</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="lng"
                maxLength="20"
                minLength="1"
                required
                value={formValues.lng}
                onChange={handleChange}
              />
            </div>

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

export default ModalFormCliente;
