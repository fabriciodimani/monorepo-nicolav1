import React, { useState, useEffect } from "react";
import { modifRubro } from "../helpers/rutaRubros";
import { Modal, Button } from "react-bootstrap";
import { getRubros } from "../helpers/rutaRubros";

const ModalFormRubro = ({ rubro, handleClose }) => {
  console.log(rubro);
  const id = localStorage.getItem("id");
  const [formValues, setFormValues] = useState({
    rubro: rubro.rubros.rubro,
    // usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    console.log(rubro.rubros._id);
    e.preventDefault();
    modifRubro(formValues, rubro.rubros._id).then((respuesta) => {
      console.log(respuesta);
      handleClose();
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

  return (
    <>
      {!rubros.loading && (
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
              <label>Rubro</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="rubro"
                maxLength="30"
                minLength="5"
                required
                value={formValues.rubro}
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

export default ModalFormRubro;
