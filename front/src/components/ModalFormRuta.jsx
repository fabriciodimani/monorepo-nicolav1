import React, { useState, useEffect } from "react";
import { modifRuta } from "../helpers/rutaRutas";
import { Modal, Button } from "react-bootstrap";
import { getRutas } from "../helpers/rutaRutas";

const ModalFormRuta = ({ ruta, handleClose }) => {
  console.log(ruta);
  const id = localStorage.getItem("id");
  const [formValues, setFormValues] = useState({
    ruta: ruta.rutas.ruta,
    // usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    console.log(ruta.rutas._id);
    e.preventDefault();
    modifRuta(formValues, ruta.rutas._id).then((respuesta) => {
      console.log(respuesta);
      handleClose();
    });
  };

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
      {!rutas.loading && (
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
              <label>Ruta</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="ruta"
                maxLength="30"
                minLength="5"
                required
                value={formValues.ruta}
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

export default ModalFormRuta;
