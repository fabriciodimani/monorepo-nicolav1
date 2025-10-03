import React, { useState, useEffect } from "react";
import { getComandas, getComandaId, modifComanda } from "../helpers/rutaComandas";
import styled from "styled-components";
import axios from "axios";
import _ from "lodash";
import Table from "./TableContainerCamion";
import ModalCamion from "../components/ModalCamion";
var arrayComandas = [];

function AppCamionReactTable() {
  const [show, setShow] = useState(false);
  const [comandas, setComandas] = useState({
    data: {},
    loading: true,
  });
  const [comanda, setComanda] = useState({});
  const [data, setData] = useState([]);

  var iduser = localStorage.getItem("id");
  useEffect(() => {
    axios
      .get("http://localhost:3004/comandaspreparadas")
      .then((res) => {
        const filtro = res.data.comandas.filter(
          (tabla) => tabla.camionero === iduser
        );
        setData(filtro);
      })
      .catch((err) => console.log(err));
  }, []);

  const Styles = styled.div`
    sticky: true;
    padding: 0rem;

    table {
      sticky: true;
      color: black;
      background-color: #ffffff;
      border-spacing: 0;
      border: 1px solid black;
      font-size: 13px;
      z-index: 10;
     
      th {
        sticky: true;
        background-color: #548fcd;
        font-size: 12px;
        text-align: center;
        height: 10rem;
        position: sticky;
            // top: 100;
            z-index: -1;
      }
      ,
      td {
        // sticky: true;
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        background-color: #ffffff;
        font-size: 13px;

        :last-child {
          border-right: 0;
        }

        input {
          // sticky: true;
          font-size: 1rem;
          padding: 0;
          margin: 0;
          border: 2;
        }
      }
    }

    .pagination {
      padding: 0.5rem;
      background-color: #548fcd;
      font-size: 15px;
      font-weight: bold;
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: relative;
        z-index: 2;
        width: fit-content;
      }
    }

    .header {
      top: 0;
      box-shadow: 0px 3px 3px #ccc;
      position: sticky;
      z-index: 10;
      
    }

    [data-sticky-td] {
      position: sticky;
      // position: absolute;
      // z-index: 0;
    }
    
  }

  `;
  const consultaComandas = () => {
    getComandas().then((datos) => {
      setComandas({
        data: datos,
        loading: false,
      });
    });
  };

  const modificaComanda = (id) => {
    let id_comanda = id;
    getComandaId(id_comanda).then((resp) => {
      console.log(resp);
      setComanda(resp);
      handleShow();
    });
  };

  const handleClose = () => {
    setShow(false);
    consultaComandas();
  };

  const handleShow = () => setShow(true);
  const AddArrayComandas = (e, idcomanda, cantidadentregada) => {
    if (cantidadentregada === 0) {
      arrayComandas[arrayComandas.length] = idcomanda;
    } else {
      e.target.checked = false;
      alert("Solo entregas totales...")
    }
  }

  const DelArrayComandas = (e, idcomanda) => {
    const filtrados = arrayComandas.filter(item => item !== idcomanda)
    arrayComandas = filtrados;
  }

  const masivoCierreComandas = async (nrodecomandas) => {
    let auxArray = [];
    for (let i = 0; i < nrodecomandas.length; i++) {
      const buscacomanda = data.filter(function (element) {
        return element._id === nrodecomandas[i];
      });
      if (buscacomanda.length > 0) {
        for (let j = 0; j < buscacomanda.length; j++) {
          auxArray.push(buscacomanda[j]);
        }
      } else {
        auxArray.push(buscacomanda[0]);
      }
    };

    if (window.confirm("Confirma ENTREGA Masiva")) {
      for (let i = 0; i < auxArray.length; i++) {
        await modifComanda({ cantidadentregada: auxArray[i].cantidad }, auxArray[i]._id).then((respuesta) => {
          console.log(respuesta);
        })
      }
      alert("Ud. ha realizado un cambio masivo...")
      window.location.reload();
    }
  }

  const columns = [
    {
      sticky: "left",
      id: "comanda",
      Header: "Com",
      width: 60,
      accessor: "nrodecomanda",
      filter: "equals",

      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },

    {
      Header: "Cliente",
      accessor: "codcli.razonsocial",
      width: 120,
      sticky: "left",
    },

    {
      Header: "Producto",
      accessor: "codprod.descripcion",
    },

    {
      Header: "Cant",
      accessor: "cantidad",
      width: 80,

      Footer: (info) => {
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.cantidad + sum, 0),
          [info.rows]
        );

        return (
          <>
            <div style={{ textAlign: "center" }}>
              <b className="pie">{total}</b>{" "}
            </div>
          </>
        );
      },

      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },

    {
 
      Header: "Precio Unitario",
      accessor: "monto",
      width: 120,

      Cell: (row) => (
        <div style={{ textAlign: "right" }}>
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(row.value)}
        </div>
      ),
    },

    {
      Header: "Total",
      id: "total",
      width: 120,
      accessor: (d) => `${d.cantidad}` * `${d.monto}`,

      Cell: (props) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(props.value),

      Footer: (info) => {
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.total + sum, 0),
          [info.rows]
        );

        return (
          <div style={{ textAlign: "right" }}>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(total)}
          </div>
        );
      },

      Cell: (row) => (
        <div style={{ textAlign: "right" }}>
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(row.value)}
        </div>
      ),
    },

    {
      Header: "Cant Ent",
      accessor: "cantidadentregada",
      disableFilters: true,
      width: 80,

      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) => row.values.cantidadentregada + sum,
              0
            ),
          [info.rows]
        );

        return (
          <>
            <div style={{ textAlign: "center" }}>
              <b className="pie">{total}</b>{" "}
            </div>
          </>
        );
      },

      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },

    {
      Header: "Total Entreg",
      id: "totalentregada",
      width: 120,
      disableFilters: true,
      accessor: (d) => `${d.cantidadentregada}` * `${d.monto}`,

      Cell: (props) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(props.value),

      Footer: (info) => {
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.totalentregada + sum, 0),
          [info.rows]
        );

        return (
          <div style={{ textAlign: "right" }}>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(total)}
          </div>
        );
      },

      Cell: (row) => (
        <div style={{ textAlign: "right" }}>
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(row.value)}
        </div>
      ),
    },

    {
      Header: "Entrega x Items",
      Cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <div className="bootstrap-switch-square">
            <input onClick={(e) => { e.target.checked ? AddArrayComandas(e, row.row.original._id, row.row.original.cantidadentregada) : DelArrayComandas(e, row.row.original._id) }}
              type="checkbox" data-toggle="switch" name="Resend" id="Resend2" />
          </div>
        </div>
      ),
    },

    {
      Header: "Logista",
      width: 70,
      Cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <button
            id="acepto"
            className="btn btn-primary"
            onClick={(e) => modificaComanda(row.row.original._id)}
          >
            <i
              className="fa fa-pencil-square-o"
              aria-hidden="true"
              color="white"
            ></i>
          </button>
        </div>
      ),
    },

  ];

  return (
    <>
      <h1 className="col-md-2 ml-5">
        En Distribucion
      <button
        id="asignarmasivo"
        className="btn btn-danger ml-5 mt-2"
        onClick={(e) => masivoCierreComandas(arrayComandas)}
      >
        Entrega Masiva
      </button>
      </h1>
      <Styles className="table sticky" style={{ width: "auto", height: 400 }}>
        <div className="App">
          <Table columns={columns} data={data} />
        </div>
        <ModalCamion show={show} handleClose={handleClose} comanda={comanda} />
      </Styles>
    </>
  );
}

export default AppCamionReactTable;
