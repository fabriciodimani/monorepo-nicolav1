import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { getClientes, delCliente, getClienteId } from "../helpers/rutaClientes";
import ModalCliente from "./ModalCliente";
import "../css/tableclientes.css";

const TableClientes = () => {
  let id_cliente = "";

  const [clientes, setClientes] = useState({
    data: {},
    loading: true,
  });

  const [cliente, setCliente] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaClientes();
  }, []);

  const consultaClientes = () => {
    getClientes().then((datos) => {
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

  const modificaCliente = (id) => {
    id_cliente = id;
    getClienteId(id_cliente).then((resp) => {
      console.log(resp);
      setCliente(resp);

      handleShow();
    });
  };

  const deleteCliente = (id) => {
    let validar = window.confirm("está seguro que desea borrar el cliente?");
    if (validar) {
      delCliente(id).then((resp) => {
        consultaClientes();
      });
    }
  };

  let count = 0;

  return (
    <div className="table-container">
      {!clientes.loading && (
        <>
          <div className="col-12 mt-4"></div>
          <div>
            <Table striped bordered hover className="table-container">
              <thead>
                <tr className="header">
                  <th className="">Nro</th>
                  <th className="cli">Razon Social</th>
                  <th className="dom">Domicilio</th>
                  <th className="tel">Telefono</th>
                  <th className="cuit">CUIT</th>
                  <th className="email">Email</th>
                  <th className="loca">Localidad</th>
                  <th className="ruta">Ruta</th>
                  <th className="latitud">Latitud</th>
                  <th className="longitud">Longitud</th>
                  <th>Modif/Eliminar</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {clientes.data.clientes.map((cliente) => (
                  <>
                    {cliente.activo && (
                      <tr key={cliente._id}>
                        <td>{cliente.codcli}</td>
                        <td>{cliente.razonsocial}</td>
                        <td>{cliente.domicilio}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.cuit}</td>
                        <td>{cliente.email}</td>
                        <td>{cliente.localidad.localidad}</td>
                        <td>{cliente.ruta.ruta}</td>
                        <td>{cliente.lat}</td>
                        <td>{cliente.lng}</td>
                        {/* <td>{cliente.lista.lista}</td>
                    <td>{cliente.codprod.descripcion}</td> */}
                        {/* <td>{usuario.nombre}</td>*/}
                        {/* {(count = count + 1)} */}
                        <td>
                          <button
                            id="acepto"
                            className="btn btn-primary"
                            onClick={() => {
                              modificaCliente(cliente._id);
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
                              deleteCliente(cliente._id);
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
          <ModalCliente
            show={show}
            handleClose={handleClose}
            cliente={cliente}
          />
        </>
      )}
    </div>
  );
};

export default TableClientes;
