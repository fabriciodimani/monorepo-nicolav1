import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import {
  getProveedores,
  delProveedor,
  getProveedorId,
} from "../helpers/rutaProveedores";
import ModalProveedor from "./ModalProveedor";
import "../css/tableproveedores.css";

const TableProveedores = () => {
  let id_proveedor = "";

  const [proveedores, setProveedores] = useState({
    data: {},
    loading: true,
  });

  const [proveedor, setProveedor] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaProveedores();
  }, []);

  const consultaProveedores = (desde) => {
    getProveedores(desde, 1000).then((datos) => {
      console.log(datos);
      setProveedores({
        data: datos,
        loading: false,
      });
    });
  };

  const handleClose = () => {
    setShow(false);
    consultaProveedores();
  };

  const handleShow = () => setShow(true);

  const modificaProveedor = (id) => {
    id_proveedor = id;
    getProveedorId(id_proveedor).then((resp) => {
      console.log(resp);
      setProveedor(resp);

      handleShow();
    });
  };

  const deleteProveedor = (id) => {
    let validar = window.confirm("está seguro que desea borrar el proveedor?");
    if (validar) {
      delProveedor(id).then((resp) => {
        consultaProveedores();
      });
    }
  };

  let count = 0;

  return (
    <div className="table-container">
      {!proveedores.loading && (
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
                  <th className="saldo">Saldo</th>
                  <th>Modif/Eliminar</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {proveedores.data.proveedores.map((proveedor) => (
                  <>
                    {proveedor.activo && (
                      <tr key={proveedor._id}>
                        <td>{proveedor.codprov}</td>
                        <td>{proveedor.razonsocial}</td>
                        <td>{proveedor.domicilio}</td>
                        <td>{proveedor.telefono}</td>
                        <td>{proveedor.cuit}</td>
                        <td>{proveedor.email}</td>
                        <td>{proveedor.localidad.localidad}</td>
                        <td>
                          {Number(proveedor.saldo || 0).toFixed(2)}
                        </td>

                        {/* <td>{cliente.lista.lista}</td>
                    <td>{cliente.codprod.descripcion}</td> */}
                        {/* <td>{usuario.nombre}</td>*/}
                        {/* {(count = count + 1)} */}
                        <td>
                          <button
                            id="acepto"
                            className="btn btn-primary"
                            onClick={() => {
                              modificaProveedor(proveedor._id);
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
                              deleteProveedor(proveedor._id);
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
          <ModalProveedor
            show={show}
            handleClose={handleClose}
            proveedor={proveedor}
          />
        </>
      )}
    </div>
  );
};

export default TableProveedores;
