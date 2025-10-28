import React, { useState, useEffect } from "react";
import { modifProveedor } from "../helpers/rutaProveedores";
import { Modal, Button } from "react-bootstrap";
import { getProveedores } from "../helpers/rutaProveedores";
import { getLocalidades } from "../helpers/rutaLocalidades";
import "../css/addclienteform.css";

const ModalFormProveedor = ({ proveedor, handleClose }) => {
  console.log(proveedor);
  const id = localStorage.getItem("id");
  const [formValues, setFormValues] = useState({
    codprov: proveedor.proveedores.codprov,
    razonsocial: proveedor.proveedores.razonsocial,
    domicilio: proveedor.proveedores.domicilio,
    telefono: proveedor.proveedores.telefono,
    cuit: proveedor.proveedores.cuit,
    email: proveedor.proveedores.email,
    localidad: proveedor.proveedores.localidad,
    saldo:
      proveedor.proveedores.saldo === undefined
        ? 0
        : proveedor.proveedores.saldo,
    // usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    console.log(proveedor.proveedores._id);
    e.preventDefault();
    modifProveedor(formValues, proveedor.proveedores._id).then((respuesta) => {
      console.log(respuesta);
      handleClose();
    });
  };

  const [proveedores, setProveedores] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getProveedores().then((proveedores) => {
      setProveedores({
        data: proveedores,
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

  return (
    <>
      {!proveedores.loading && !localidades.loading && (
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* <div className="form-group">
              <label>Cod. Prov</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="codprov"
                maxLength="4"
                minLength="1"
                required
                value={formValues.codprov}
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
              <label className="saldo-inicial-label">Saldo Inicial</label>
              <input
                rows="1"
                type="number"
                className="form-control saldo-inicial-input"
                name="saldo"
                value={formValues.saldo}
                readOnly
                disabled
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

export default ModalFormProveedor;
