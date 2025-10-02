import React, { useState, useEffect } from "react";
import { modifMarca } from "../helpers/rutaMarcas";
import { Modal, Button } from "react-bootstrap";
import { getMarcas } from "../helpers/rutaMarcas";

const ModalFormMarca = ({ marca, handleClose }) => {
  console.log(marca);
  const id = localStorage.getItem("id");
  const [formValues, setFormValues] = useState({
    marca: marca.marcas.marca,
    // usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    console.log(marca.marcas._id);
    e.preventDefault();
    modifMarca(formValues, marca.marcas._id).then((respuesta) => {
      console.log(respuesta);
      handleClose();
    });
  };

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
      {!marcas.loading && (
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
              <label>Marca</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="marca"
                maxLength="30"
                minLength="5"
                required
                value={formValues.marca}
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
    </>
  );
};

export default ModalFormMarca;
