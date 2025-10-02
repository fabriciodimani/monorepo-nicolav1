import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import {
  getLocalidades,
  delLocalidad,
  getLocalidadId,
} from "../helpers/rutaLocalidades";
import ModalLocalidad from "./ModalLocalidad";
import "../css/tableclientes.css";

const TableLocalidades = () => {
  let id_localidad = "";

  const [localidades, setLocalidades] = useState({
    data: {},
    loading: true,
  });

  const [localidad, setLocalidad] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaLocalidades();
  }, []);

  const consultaLocalidades = (desde) => {
    getLocalidades(desde, 1000).then((datos) => {
      console.log(datos);
      setLocalidades({
        data: datos,
        loading: false,
      });
    });
  };

  // console.log(comandas.data[0]);

  const handleClose = () => {
    setShow(false);
    consultaLocalidades();
  };

  const handleShow = () => setShow(true);

  const modificaLocalidad = (id) => {
    id_localidad = id;
    getLocalidadId(id_localidad).then((resp) => {
      console.log(resp);
      setLocalidad(resp);

      handleShow();
    });
  };

  const deleteLocalidad = (id) => {
    let validar = window.confirm("está seguro que desea borrar la Localidad?");
    if (validar) {
      delLocalidad(id).then((resp) => {
        consultaLocalidades();
      });
    }
  };

  let count = 0;

  return (
    <div className="table-container">
      {!localidades.loading && (
        <>
          <div className="col-12 mt-4"></div>
          <div>
            <Table striped bordered hover className="table-container">
              <thead>
                <tr className="header">
                  <th className="cli">Localidad</th>
                  <th className="dom">Cod Pos</th>
                  <th className="tel">Provincia</th>
                  <th>Modif/Eliminar</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {localidades.data.localidades.map((localidad) => (
                  <>
                    {localidad.activo && (
                      <tr key={localidad._id}>
                        <td>{localidad.localidad}</td>
                        <td>{localidad.codigopostal}</td>
                        <td>{localidad.provincia.provincia}</td>

                        {/* <td>{cliente.lista.lista}</td>
                    <td>{cliente.codprod.descripcion}</td> */}
                        {/* <td>{usuario.nombre}</td>*/}
                        {/* {(count = count + 1)} */}
                        <td>
                          <button
                            id="acepto"
                            className="btn btn-primary"
                            onClick={() => {
                              modificaLocalidad(localidad._id);
                            }}
                          >
                            <i
                              className="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <button
                            id="acepto"
                            className="btn btn-danger ml-2"
                            onClick={() => {
                              deleteLocalidad(localidad._id);
                            }}
                          >
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </Table>
            {/* <h1>{count}</h1> */}
          </div>
          <ModalLocalidad
            show={show}
            handleClose={handleClose}
            localidad={localidad}
          />
        </>
      )}
    </div>
  );
};

export default TableLocalidades;
