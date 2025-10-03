import React, { useState, useEffect } from "react";
// import GetDataInvoiceAdmin from "../report/GetDataInvoiceAdmin";
import { getComandas, delComanda, getComandaId } from "../helpers/rutaComandas";
import { delRemito } from "../helpers/rutaRemitos";
import { modifProducserv, getProducservId } from "../helpers/rutaProducservs";

// import ReactTable from "react-table";
import styled from "styled-components";
import axios from "axios";
import _ from "lodash";
import Table from "./TableContainer";
import { SelectColumnFilter } from "./Filter";
import ModalComanda from "../components/ModalComanda";
// import "../css/tablecomandas.css";

// import "./App.css";

function AppMovStockReactTable() {
  const [show, setShow] = useState(false);
  const [comandas, setComandas] = useState({
    data: {},
    loading: true,
  });
  const [comanda, setComanda] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    axios("http://localhost:3004/stocks")
      .then((res) => {
        setData(res.data.stocks);
      })
      .catch((err) => console.log(err));
  }, []);

  const Styles = styled.div`
  sticky: true;  
  padding: 0rem;
  
  table {
    sticky: true;
    // background-color: #548fcd;
    color: black;
    border-spacing: 0;
    border: 1px solid black;
    font-size: 13px;
    z-index: 1;

    th {
      sticky: true;
      background-color: #548fcd;
      font-size: 12px;
      text-align: center;
      height: 10rem;
      // position: sticky;
      top: 100;
      z-index: 1;
    }
    ,
    td {
      sticky: true;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      // background-color: #548f0a;
      background-color: #ffffff;
      font-size: 13px;
      // top: 100;
      // z-index: 1;
      

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
    header,
    footer {
      position: sticky;
      z-index: 1;
      // width: fit-content;
    }
  }
    
    .header {
      top: 0;
      box-shadow: 0px 3px 3px #ccc;
      position: sticky;
      z-index:10;
      
    }

    [data-sticky-td] {
      // position: sticky;
      position: absolute;
      z-index: 0;
    }


`;

  // fn filtro fecha

  function dateBetweenFilterFn(rows, id, filterValues) {
    const sd = filterValues[0] ? new Date(filterValues[0]) : undefined;
    const ed = filterValues[1] ? new Date(filterValues[1]) : undefined;

    if (ed || sd) {
      return rows.filter((r) => {
        const cellDate = new Date(r.values[id]);

        if (ed && sd) {
          return cellDate >= sd && cellDate <= ed;
        } else if (sd) {
          return cellDate >= sd;
        } else if (ed) {
          return cellDate <= ed;
        }
      });
    } else {
      return rows;
    }
  }

  // filtro fecha
  function DateRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
  }) {
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length
        ? new Date(preFilteredRows[0].values[id])
        : new Date(0);
      let max = preFilteredRows.length
        ? new Date(preFilteredRows[0].values[id])
        : new Date(0);

      preFilteredRows.forEach((row) => {
        const rowDate = new Date(row.values[id]);

        min = rowDate <= min ? rowDate : min;
        max = rowDate >= max ? rowDate : max;
      });

      return [min, max];
    }, [id, preFilteredRows]);

    return (
      <div>
        <input
          min={min.toISOString().slice(0, 10)}
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [val ? val : undefined, old[1]]);
          }}
          type="date"
          style={{
            width: "100px",
            marginRight: "0.5rem",
            marginBottom: "2.2rem",
          }}
          value={filterValue[0] || ""}
        />
        {/* {" a "} */}
        <input
          max={max.toISOString().slice(0, 10)}
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              old[0],
              val ? val.concat("T23:59:59.999Z") : undefined,
            ]);
          }}
          type="date"
          style={{
            width: "100px",
            marginRight: "0.5rem",
            marginBottom: "2.2rem",
          }}
          value={filterValue[1]?.slice(0, 10) || ""}
        />
      </div>
    );
  }

  const consultaComandas = () => {
    getComandas().then((datos) => {
      // console.log(datos);
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
      // alert("Comanda Modificada")

      handleShow();
    });
  };

  const handleClose = () => {
    setShow(false);
    consultaComandas();
  };

  const handleShow = () => setShow(true);

  const deleteRemito = (nroderemito) => {
    // console.log("com", data);
    // console.log("nrodecomanda", nrodecomanda);

    const buscaremito = data.filter(function (element) {
      return element.nroderemito === nroderemito;
    });
    //console.log(buscacomanda);

    let validar = window.confirm(
      "Está seguro que desea borrar el remito Nro " + nroderemito
    );

    if (validar) {
      for (let i = 0; i < buscaremito.length; i++) {
        delRemito(buscaremito[i]._id).then((resp) => {
          // consultaComandas();
        });

        // aca suma cantidada + stock actual
        // console.log("bc[i].cod._id", buscacomanda[i].codprod._id);
        // debugger;

        getProducservId(buscaremito[i].codprod._id).then((stk) => {
          console.log("stk", stk);
          let resstk =
            parseInt(stk.producservs.stkactual) -
            parseInt(buscaremito[i].cantidad);
          console.log("resstk", resstk);
          // debugger;
          modifProducserv(
            { stkactual: resstk },
            buscaremito[i].codprod._id
          ).then((respuesta) => {
            // dejar este console.log
            console.log(respuesta);

            // alert("Remito Eliminado");
            // debugger;
          });
        });
      }
      window.location.reload();
    }
  };

  console.log(data);
  const columns = [
    {
      sticky: "left",
      id: "fecha",
      Header: "Fecha",
      style: { marginBottom: "2rem" },
      accessor: "fecha",
      Cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.value.slice(0, 10)}</div>
      ),
      Filter: DateRangeColumnFilter,

      filter: dateBetweenFilterFn,
    },

    {
      Header: "Producto",
      width: 200,
      accessor: "codprod.descripcion",
      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },

    {
      Header: "Cantidad",
      width: 100,
      accessor: "cantidad",
      filter: "equals",
      // id: "cantidad",

      Footer: (info) => {
        // Only calculate total visits if rows change
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
      Header: "Movimiento",
      accessor: "movimiento.movimiento",
      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },

    {
      Header: "Usuario",
      accessor: "usuario.nombres",
      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },
    
  ];

  return (
    <>
      <h1>
        <center>Movimientos de Stocks</center>
      </h1>
      <Styles className="table sticky" style={{ width: "auto", height: 400 }}>
        <div className="App">
          <Table columns={columns} data={data} />
        </div>
      {/* <ModalComanda show={show} handleClose={handleClose} comanda={comanda} /> */}
      </Styles>
    </>
  );
}

export default AppMovStockReactTable;
