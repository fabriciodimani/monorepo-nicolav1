import React, { useState, useEffect } from "react";
import { modifLocalidad } from "../helpers/rutaLocalidades";
import { Modal, Button } from "react-bootstrap";
import { getLocalidades } from "../helpers/rutaLocalidades";
import { getProvincias } from "../helpers/rutaProvincias";

const ModalFormLocalidad = ({ localidad, handleClose }) => {
  console.log(localidad);
  const id = localStorage.getItem("id");
  const [formValues, setFormValues] = useState({
    localidad: localidad.localidades.localidad,
    codigopostal: localidad.localidades.codigopostal,
    provincia: localidad.localidades.provincia,
    // usuario: id,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    console.log(localidad.localidades._id);
    e.preventDefault();
    modifLocalidad(formValues, localidad.localidades._id).then((respuesta) => {
      console.log(respuesta);
      handleClose();
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

  const [provincias, setProvincias] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getProvincias().then((provincias) => {
      setProvincias({
        data: provincias,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!localidades.loading && !provincias.loading && (
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="form-group mt-3">
              <label>Localidad</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="localidad"
                maxLength="50"
                minLength="5"
                required
                value={formValues.localidad}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Cod Postal</label>
              <input
                rows="1"
                type="text"
                className="form-control"
                name="codigopostal"
                maxLength="4"
                minLength="4"
                required
                value={formValues.codigopostal}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Provincia</label>
              <select
                className="form-control"
                name="provincia"
                value={formValues.provincia}
                onChange={handleChange}
                required
              >
                <option selected value="">
                  Elija la opción adecuada
                </option>
                {provincias.data.provincias.map((provincia) => (
                  <option value={provincia._id}>{provincia.provincia}</option>
                ))}
              </select>
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

export default ModalFormLocalidad;
