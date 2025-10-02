import React, { useState, useEffect } from "react";
import { modifPrecio } from "../helpers/rutaPrecios";
import { Modal, Button } from "react-bootstrap";
import { getPrecios } from "../helpers/rutaPrecios";
import { getListas } from "../helpers/rutaListas";
// import { getProducServs } from "../helpers/rutaProducservs";

const ModalFormPrecio = ({ precio, handleClose }) => {
  console.log(precio);
  const id = localStorage.getItem("id");
  const [formValues, setFormValues] = useState({
    // codcli: cliente.clientes.codcli,
    lista: precio.precios.lista,
    precionetocompra: precio.precios.precionetocompra,
    ivacompra: precio.precios.ivacompra,
    preciototalcompra: precio.precios.preciototalcompra,
    precionetoventa: precio.precios.precionetoventa,
    ivaventa: precio.precios.ivaventa,
    preciototalventa: precio.precios.preciototalventa,
    // usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    console.log(precio.precios._id);
    e.preventDefault();
    modifPrecio(formValues, precio.precios._id).then((respuesta) => {
      console.log(respuesta);
      handleClose();
    });
  };

  const [precios, setPrecios] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getPrecios().then((precios) => {
      setPrecios({
        data: precios,
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

  return (
    <>
      {!precios.loading && !listas.loading && (
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="form-group mt-3">
              <label>Lista</label>
              <select
                className="form-control"
                name="lista"
                value={formValues.lista}
                onChange={handleChange}
                required
              >
                <option selected value="">
                  Elija la opción adecuada
                </option>
                {listas.data.listas.map((lista) => (
                  <option value={lista._id}>{lista.lista}</option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Precio Neto Compra</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="precionetocompra"
                maxLength="30"
                minLength="1"
                required
                value={formValues.precionetocompra}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Iva Compra</label>
              <select
                className="form-control"
                name="ivacompra"
                value={formValues.ivacompra}
                onChange={handleChange}
                required
              >
                <option selected value="">
                  Elija la opción
                </option>
                <option>10.5</option>,<option>21</option>
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Precio Total Compra</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="preciototalcompra"
                maxLength="30"
                minLength="1"
                required
                value={formValues.preciototalcompra}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Precio Neto Venta</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="precionetoventa"
                maxLength="30"
                minLength="1"
                required
                value={formValues.precionetoventa}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Iva Compra</label>
              <select
                className="form-control"
                name="ivaventa"
                value={formValues.ivaventa}
                onChange={handleChange}
                required
              >
                <option selected value="">
                  Elija la opción
                </option>
                <option>10.5</option>,<option>21</option>
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Precio Total Venta</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="preciototalventa"
                maxLength="30"
                minLength="1"
                required
                value={formValues.preciototalventa}
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

export default ModalFormPrecio;
