import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { getRubros, delRubro, getRubroId } from "../helpers/rutaRubros";
import ModalRubro from "./ModalRubro";
import "../css/tableclientes.css";

const TableRubros = () => {
  let id_rubro = "";

  const [rubros, setRubros] = useState({
    data: {},
    loading: true,
  });

  const [rubro, setRubro] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaRubros();
  }, []);

  const consultaRubros = (desde) => {
    getRubros(desde, 1000).then((datos) => {
      console.log(datos);
      setRubros({
        data: datos,
        loading: false,
      });
    });
  };

  // console.log(comandas.data[0]);

  const handleClose = () => {
    setShow(false);
    consultaRubros();
  };

  const handleShow = () => setShow(true);

  const modificaRubro = (id) => {
    id_rubro = id;
    getRubroId(id_rubro).then((resp) => {
      console.log(resp);
      setRubro(resp);

      handleShow();
    });
  };

  const deleteRubro = (id) => {
    let validar = window.confirm("está seguro que desea borrar el rubro?");
    if (validar) {
      delRubro(id).then((resp) => {
        consultaRubros();
      });
    }
  };

  let count = 0;

  return (
    <div className="table-container">
      {!rubros.loading && (
        <>
          <div className="col-12 mt-4"></div>
          <div>
            <Table striped bordered hover className="table-container">
              <thead>
                <tr className="header">
                  <th className="cli">Rubros</th>
                  <th>Modif/Eliminar</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {rubros.data.rubros.map((rubro) => (
                  <>
                    {rubro.activo && (
                      <tr key={rubro._id}>
                        <td>{rubro.rubro}</td>
                        {/* <td>{cliente.lista.lista}</td>
                        <td>{cliente.codprod.descripcion}</td> */}
                        {/* <td>{usuario.nombre}</td>*/}
                        {/* {(count = count + 1)} */}
                        <td>
                          <button
                            id="acepto"
                            className="btn btn-primary"
                            onClick={() => {
                              modificaRubro(rubro._id);
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
                              deleteRubro(rubro._id);
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
          <ModalRubro show={show} handleClose={handleClose} rubro={rubro} />
        </>
      )}
    </div>
  );
};

export default TableRubros;
