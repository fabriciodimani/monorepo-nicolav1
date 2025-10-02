import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { getPrecios, delPrecio, getPrecioId } from "../helpers/rutaPrecios";
import ModalPrecio from "./ModalPrecio";
import "../css/tableclientes.css";

const TablePrecios = () => {
  let id_precio = "";

  const [precios, setPrecios] = useState({
    data: {},
    loading: true,
  });

  const [precio, setPrecio] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaPrecios();
  }, []);

  const consultaPrecios = (desde) => {
    getPrecios(desde, 1000).then((datos) => {
      console.log(datos);
      setPrecios({
        data: datos,
        loading: false,
      });
    });
  };

  // console.log(comandas.data[0]);

  const handleClose = () => {
    setShow(false);
    consultaPrecios();
  };

  const handleShow = () => setShow(true);

  const modificaPrecio = (id) => {
    id_precio = id;
    getPrecioId(id_precio).then((resp) => {
      console.log(resp);
      setPrecio(resp);

      handleShow();
    });
  };

  const deletePrecio = (id) => {
    let validar = window.confirm("está seguro que desea borrar el precio?");
    if (validar) {
      delPrecio(id).then((resp) => {
        consultaPrecios();
      });
    }
  };

  if (!precios.loading) {
    precios.data.precios.sort(function (a, b) {
      if (
        a.codproducto.descripcion.toLowerCase() <
        b.codproducto.descripcion.toLowerCase()
      )
        return -1;
      if (
        a.codproducto.descripcion.toLowerCase() >
        b.codproducto.descripcion.toLowerCase()
      )
        return 1;
      return 0;
    });
  }

  let count = 0;

  return (
    <div className="table-container">
      {!precios.loading && (
        <>
          <div className="col-12 mt-4"></div>
          <div>
            <Table striped bordered hover className="table-container">
              <thead>
                <tr className="header">
                  {/* <th className="">Nro</th> */}
                  <th className="cli">Producto/Servicio</th>
                  <th className="dom">Lista</th>
                  <th className="cuit">PNC</th>
                  <th className="cuit">IvaC</th>
                  <th className="cuit">PTC</th>
                  <th className="cuit">PNV</th>
                  <th className="cuit">IvaV</th>
                  <th className="cuit">PTV</th>
                  <th>Modif/Eliminar</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {precios.data.precios.map((precio) => (
                  <>
                    {precio.activo && (
                      <tr key={precio._id}>
                        <td>{precio.codproducto.descripcion}</td>
                        <td>{precio.lista.lista}</td>
                        <td>{precio.precionetocompra}</td>
                        <td>{precio.ivacompra}</td>
                        <td>{precio.preciototalcompra}</td>
                        <td>{precio.precionetoventa}</td>
                        <td>{precio.ivaventa}</td>
                        <td>{precio.preciototalventa}</td>
                        {/* <td>{cliente.localidad.localidad}</td> */}
                        {/* <td>{cliente.lista.lista}</td>
                    <td>{cliente.codprod.descripcion}</td> */}
                        {/* <td>{usuario.nombre}</td>*/}
                        {/* {(count = count + 1)} */}
                        <td>
                          <button
                            id="acepto"
                            className="btn btn-primary"
                            onClick={() => {
                              modificaPrecio(precio._id);
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
                              deletePrecio(precio._id);
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
          <ModalPrecio show={show} handleClose={handleClose} precio={precio} />
        </>
      )}
    </div>
  );
};

export default TablePrecios;
