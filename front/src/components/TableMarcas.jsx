import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { getMarcas, delMarca, getMarcaId } from "../helpers/rutaMarcas";
import ModalMarca from "./ModalMarca";
import "../css/tableclientes.css";

const TableMarcas = () => {
  let id_marca = "";

  const [marcas, setMarcas] = useState({
    data: {},
    loading: true,
  });

  const [marca, setMarca] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaMarcas();
  }, []);

  const consultaMarcas = (desde) => {
    getMarcas(desde, 1000).then((datos) => {
      console.log(datos);
      setMarcas({
        data: datos,
        loading: false,
      });
    });
  };

  // console.log(comandas.data[0]);

  const handleClose = () => {
    setShow(false);
    consultaMarcas();
  };

  const handleShow = () => setShow(true);

  const modificaMarca = (id) => {
    id_marca = id;
    getMarcaId(id_marca).then((resp) => {
      console.log(resp);
      setMarca(resp);

      handleShow();
    });
  };

  const deleteMarca = (id) => {
    let validar = window.confirm("está seguro que desea borrar la marca?");
    if (validar) {
      delMarca(id).then((resp) => {
        consultaMarcas();
      });
    }
  };

  let count = 0;

  return (
    <div className="table-container">
      {!marcas.loading && (
        <>
          <div className="col-12 mt-4"></div>
          <div>
            <Table striped bordered hover className="table-container">
              <thead>
                <tr className="header">
                  <th className="cli">Marcas</th>
                  <th>Modif/Eliminar</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {marcas.data.marcas.map((marca) => (
                  <>
                    {marca.activo && (
                      <tr key={marca._id}>
                        <td>{marca.marca}</td>
                        {/* <td>{cliente.lista.lista}</td>
                        <td>{cliente.codprod.descripcion}</td> */}
                        {/* <td>{usuario.nombre}</td>*/}
                        {/* {(count = count + 1)} */}
                        <td>
                          <button
                            id="acepto"
                            className="btn btn-primary"
                            onClick={() => {
                              modificaMarca(marca._id);
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
                              deleteMarca(marca._id);
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
          <ModalMarca show={show} handleClose={handleClose} marca={marca} />
        </>
      )}
    </div>
  );
};

export default TableMarcas;
