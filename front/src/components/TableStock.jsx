import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import {
  getProducservs,
  delProducserv,
  getProducservId,
} from "../helpers/rutaProducservs";
import ModalProducserv from "./ModalProducserv";
import "../css/tableproducservs.css";

const TableStock = () => {
  let id_producserv = "";

  const [producservs, setProducservs] = useState({
    data: {},
    loading: true,
  });

  const [producserv, setProducserv] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaProducservs();
  }, []);

  const consultaProducservs = (desde) => {
    getProducservs(desde, 1000).then((datos) => {
      console.log(datos);
      setProducservs({
        data: datos,
        loading: false,
      });
    });
  };

  // console.log(comandas.data[0]);

  const handleClose = () => {
    setShow(false);
    consultaProducservs();
  };

  const handleShow = () => setShow(true);

  const modificaProducserv = (id) => {
    id_producserv = id;
    console.log(id_producserv);
    getProducservId(id_producserv).then((resp) => {
      console.log(resp);
      setProducserv(resp);

      handleShow();
    });
  };

  const deleteProducserv = (id) => {
    let validar = window.confirm(
      "está seguro que desea borrar el producto/servcicio?"
    );
    if (validar) {
      delProducserv(id).then((resp) => {
        consultaProducservs();
      });
    }
  };

  let count = 0;

  return (
    <div className="table-container">
      {!producservs.loading && (
        <>
          <div className="col-12 mt-4"></div>
          <div>
            <Table striped bordered hover className="table-container">
              <thead>
                <tr className="header">
                  <th className="">Cod.Pro</th>
                  <th className="cli">Descripcion</th>
                  <th className="dom">Rubro</th>
                  <th className="tel">Marca</th>
                  <th className="cuit">Unid.</th>
                  <th className="email">Tipo</th>
                  <th className="loca">Stk.Act.</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {producservs.data.producservs.map((producserv) => (
                  <>
                    {producserv.activo && (
                      <tr key={producserv._id}>
                        <td>{producserv.codprod}</td>
                        <td>{producserv.descripcion}</td>
                        <td>{producserv.rubro.rubro}</td>
                        <td>{producserv.marca.marca}</td>
                        <td>{producserv.unidaddemedida.unidaddemedida}</td>
                        <td>{producserv.tipo}</td>
                        <td>{producserv.stkactual}</td>

                        {/* <td>{cliente.lista.lista}</td>
                    <td>{cliente.codprod.descripcion}</td> */}
                        {/* <td>{usuario.nombre}</td>*/}
                        {/* {(count = count + 1)} */}
                        {/* <td>
                          <button
                            id="acepto"
                            className="btn btn-primary"
                            onClick={() => {
                              modificaProducserv(producserv._id);
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
                              deleteProducserv(producserv._id);
                            }}
                          >
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                          </button>
                        </td> */}
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </Table>
            {/* <h1>{count}</h1> */}
          </div>
          <ModalProducserv
            show={show}
            handleClose={handleClose}
            producserv={producserv}
          />
        </>
      )}
    </div>
  );
};

export default TableStock;
