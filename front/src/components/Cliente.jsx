import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClientes, delCliente, getClienteId } from "../helpers/rutaClientes";

import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddClienteForm from "./AddClienteForm";
// let busqueda = [];

const Clientes = () => {
  let id_cliente = "";

  const [clientes, setClientes] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getClientes().then((clientes) => {
      setClientes({
        data: clientes,
        loading: false,
      });
    });
  }, []);

  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaClientes();
  }, []);

  const consultaClientes = (desde) => {
    getClientes(desde, 1000).then((datos) => {
      console.log(datos);
      setClientes({
        data: datos,
        loading: false,
      });
    });
  };

  // console.log(comandas.data[0]);

  const handleClose = () => {
    setShow(false);
    consultaClientes();
  };

  const handleShow = () => setShow(true);

  return (
    <>
      {!clientes.loading && (
        <div className="container">
          <div className="mb-4">
            <div className="mt-3">
              <h2>ALTA DE CLIENTES</h2>
              <hr></hr>
            </div>
          </div>

          <div className="row ml-4">
            <div id="card" className="col-lg-12 ml-5">
              {/* <Link
                      to={`/cliente/${cliente._id}`}
                      className="text-decoration-none"> 
                      <div className="card ml-4 mb-4">
                        <div className="card-body">
                          <h3 className="card-title">{cliente.razonsocial}</h3>
                        </div>
                      </div>
                    </Link> */}
            </div>
          </div>
        </div>
      )}
      <AddClienteForm />
    </>
  );
};

export default Clientes;
