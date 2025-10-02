import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { getRutas, delRuta, getRutaId } from "../helpers/rutaRutas";
import ModalRuta from "./ModalRuta";
import "../css/tablerutas.css";

const TableRutas = () => {
  let id_ruta = "";

  const [rutas, setRutas] = useState({
    data: {},
    loading: true,
  });

  const [ruta, setRuta] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaRutas();
  }, []);

  const consultaRutas = (desde) => {
    getRutas(desde, 1000).then((datos) => {
      console.log(datos);
      setRutas({
        data: datos,
        loading: false,
      });
    });
  };

  // console.log(comandas.data[0]);

  const handleClose = () => {
    setShow(false);
    consultaRutas();
  };

  const handleShow = () => setShow(true);

  const modificaRuta = (id) => {
    id_ruta = id;
    getRutaId(id_ruta).then((resp) => {
      console.log(resp);
      setRuta(resp);

      handleShow();
    });
  };

  const deleteRuta = (id) => {
    let validar = window.confirm("está seguro que desea borrar la ruta?");
    if (validar) {
      delRuta(id).then((resp) => {
        consultaRutas();
      });
    }
  };

  let count = 0;

  return (
    <div className="table-container">
      {!rutas.loading && (
        <>
          <div className="col-12 mt-4"></div>
          <div>
            <Table striped bordered hover className="table sticky">
              <thead>
                <tr className="header">
                  <th className="sticky">Rutas</th>
                  <th className="sticky">Modif/Eliminar</th>
                  <th className="sticky"></th>
                </tr>
              </thead>

              <tbody>
                {rutas.data.rutas.map((ruta) => (
                  <>
                    {ruta.activo && (
                      <tr key={ruta._id}>
                        <td>{ruta.ruta}</td>
                        {/* <td>{cliente.lista.lista}</td>
                        <td>{cliente.codprod.descripcion}</td> */}
                        {/* <td>{usuario.nombre}</td>*/}
                        {/* {(count = count + 1)} */}
                        <td>
                          <button
                            id="acepto"
                            className="btn btn-primary"
                            onClick={() => {
                              modificaRuta(ruta._id);
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
                              deleteRuta(ruta._id);
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
          <ModalRuta show={show} handleClose={handleClose} ruta={ruta} />
        </>
      )}
    </div>
  );
};

export default TableRutas;
