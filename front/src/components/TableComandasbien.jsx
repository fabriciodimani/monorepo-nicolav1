import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GetDataInvoiceAdmin from "../report/GetDataInvoiceAdmin";

import ComandaProvider from "../Context/ComandaContext";
import BarraBusqueda from "../components/BarraBusqueda";

import { Table } from "react-bootstrap";
// import BarraBusqueda from "./BarraBusqueda";

import { getComandas, delComanda, getComandaId } from "../helpers/rutaComandas";
import ModalComanda from "./ModalComanda";
import "../css/tablecomandas.css";

const TableComandas = (props) => {
  let id_comanda = "";

  const [mostrar, setMostrar] = useState(false);

  const [comandas, setComandas] = useState({
    data: {},
    loading: true,
  });

  const [comanda, setComanda] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    consultaComandas();
  }, []);

  // const consultaComandas = (desde) => {
  //   getComandas(desde, 1000).then((datos) => {
  //     // console.log(datos);
  //     setComandas({
  //       data: datos,
  //       loading: false,
  //     });
  //   });
  // };

  const consultaComandas = () => {
    getComandas().then((datos) => {
      // console.log(datos);
      setComandas({
        data: datos,
        loading: false,
      });
    });
  };

  // console.log(comandas.data[0]);

  const handleClose = () => {
    setShow(false);
    consultaComandas();
  };

  const handleShow = () => setShow(true);

  // const updateComanda = () => {
  //   <ComandaProvider>
  //     <BarraBusqueda />
  //   </ComandaProvider>;
  // };

  const modificaComanda = (id) => {
    id_comanda = id;
    getComandaId(id_comanda).then((resp) => {
      console.log(resp);
      setComanda(resp);

      handleShow();
    });
    // <h1>HOLAAA</h1>;
    // updateComanda();
  };

  const deleteComanda = (id) => {
    let validar = window.confirm("está seguro que desea borrar la Comanda?");
    if (validar) {
      delComanda(id).then((resp) => {
        consultaComandas();
      });
    }
  };

  const onButtonClick = () => {
    setMostrar(true);
  };
  // const buscaComanda = (nrocomanda) => {
  //   console.log(nrocomanda);
  //   return <GetDataInvoiceAdmin datacomanda={nrocomanda} />;
  // };

  let count = 0;

  // let temp = new Date(this.props.datacomanda[0].fecha);

  //   let fecha = temp.toLocaleString("es-AR");
  //   console.log("fecha 2:", fecha);
  //   let fechacomanda = fecha.substr(0, 10);
  //   console.log("fecha final", fechacomanda);

  return (
    <div className="table-container">
      {/* {!comandas.loading && ( */}
      <>
        <div className="col-12 mt-4"></div>
        <div>
          <Table striped bordered hover className="table-container">
            <thead>
              <tr className="sticky1">
                <th className="sticky2">NroCom</th>
                <th className="cli">Cliente</th>
                <th className="lis">Lista</th>
                <th className="pro">Producto</th>
                <th className="cant">Cant</th>
                <th className="uni">PUnit</th>
                <th className="tot">PTotal</th>
                <th className="fec">Fec/Hora</th>
                <th className="ent">Ent</th>
                <th className="mod">Modif/Elimin</th>
                <th>Crea/Imprime</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {props.comandasFiltradas.map((comanda) => (
                <>
                  {comanda.activo && (
                    <tr key={comanda._id}>
                      <td>{comanda.nrodecomanda}</td>
                      <td>{comanda.codcli.razonsocial}</td>
                      <td>{comanda.lista.lista}</td>
                      <td>{comanda.codprod.descripcion}</td>
                      <td>{comanda.cantidad}</td>
                      <td>{comanda.monto}</td>
                      <td>{comanda.cantidad * comanda.monto}</td>
                      <td>
                        {comanda.fecha.toLocaleString("en-GB").substr(0, 10)}
                        {/* {console.log(comanda.fecha)} */}
                      </td>
                      <td className="mod">{comanda.entregado && "SI"}</td>
                      {/* <td>{usuario.nombre}</td>*/}
                      {/* {(count = count + 1)} */}
                      <td>
                        <button
                          id="acepto"
                          className="btn btn-primary"
                          onClick={() => {
                            modificaComanda(comanda._id);
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
                            deleteComanda(comanda._id);
                          }}
                        >
                          <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </button>

                        {/* <button
                            id="acepto"
                            // type="submit"
                            className=""
                            onClick={() => {
                              onButtonClick();
                            }}
                          >
                          </button> */}
                      </td>
                      <td>
                        {setMostrar ? (
                          <GetDataInvoiceAdmin
                            datacomanda={comanda.nrodecomanda}
                          />
                        ) : null}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </Table>
          {/* <h1>{count}</h1> */}
        </div>
        <ModalComanda show={show} handleClose={handleClose} comanda={comanda} />

        {/* <ModalComandaImp
            show={show}
            handleClose={handleClose}
            comanda={comanda}
          /> */}
      </>
      {/* )} */}
    </div>
  );
};

export default TableComandas;
