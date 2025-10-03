import React, { useState, useEffect } from "react";
// import GetDataInvoiceAdmin from "../report/GetDataInvoiceAdmin";
import { getComandas, delComanda, getComandaId } from "../helpers/rutaComandas";
import { delRemito } from "../helpers/rutaRemitos";
import { modifProducserv, getProducservId } from "../helpers/rutaProducservs";

// import ReactTable from "react-table";
import styled from "styled-components";
import { useTable, useBlockLayout } from 'react-table';
import { useSticky } from 'react-table-sticky';
import axios from "axios";
import _ from "lodash";
import Table from "./TableContainer";
import { SelectColumnFilter } from "./Filter";
import ModalComanda from "../components/ModalComanda";
// import "../css/tablecomandas.css";
import { getCssVariable } from "../helpers/theme";

// import "./App.css";

function AppRemitoReactTable() {
  const [show, setShow] = useState(false);
  const [comandas, setComandas] = useState({
    data: {},
    loading: true,
  });
  const contrastText = getCssVariable("--color-text-on-contrast", "#f5f5f5");
  const [comanda, setComanda] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    axios("http://localhost:3004/remitos")
      .then((res) => {
        setData(res.data.remitos);
      })
      .catch((err) => console.log(err));
  }, []);

  const Styles = styled.div`
  sticky: true;  
  padding: 0rem;
  
  table {
    sticky: true;
    // background-color: #548fcd;
    color: var(--color-text-primary);
    border-spacing: 0;
    border: 1px solid var(--color-border-strong);
    font-size: 13px;
    z-index: 1;

    th {
      sticky: true;
      background-color: var(--color-status-info);
      font-size: 12px;
      text-align: center;
      height: 10rem;
      // position: sticky;
      color: var(--color-text-on-contrast);
      top: 100;
      z-index: 1;
    }
    ,
    td {
      sticky: true;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      // background-color: #548f0a;
      background-color: var(--color-surface-muted);
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
    background-color: var(--color-status-info);
    color: var(--color-text-on-contrast);
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
      box-shadow: var(--shadow-soft);
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
      alert("El Remito fue borrado con Exito")
      window.location.reload();
    }
  };

  console.log(data);
  const columns = [
    {
      sticky: "left",
      id: "remito",
      Header: "Nro Remito",
      width: 100,
      accessor: "nroderemito",
      filter: "equals",

      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },
    {
      id: "fecha",
      Header: "Fecha de Remito",
      style: { marginBottom: "2rem" },
      accessor: "fecha",
      Cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.value.slice(0, 10)}</div>
      ),

      Filter: DateRangeColumnFilter,
      // filter: "between",
      filter: dateBetweenFilterFn,
    },

    {
      Header: "Razon Social",
      accessor: "codprov.razonsocial",
    },
    // {
    //   Header: "Domicilio",
    //   accessor: "codprov.domicilio",
    // },

    // {
    //   Header: "Localidad",
    //   accessor: "codprov.localidad.localidad",
    // },

    {
      Header: "Producto",
      accessor: "codprod.descripcion",
      width: 200,
    },

    {
      Header: "Cantidad",
      accessor: "cantidad",
      width: 100,
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

    // {
    //   Header: "Telefono",
    //   accessor: "codprov.telefono",

    //   Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    // },

    // {
    //   Header: "Email",
    //   accessor: "codprov.email",
    // },

    // {
    //   Header: () => (
    //     <div
    //       style={{
    //         textAlign: "center",
    //       }}
    //     >
    //       Monto
    //     </div>
    //   ),

    //   accessor: "monto",

    //   Cell: (props) =>
    //     new Intl.NumberFormat("es-AR", {
    //       style: "currency",
    //       currency: "ARS",
    //     }).format(props.value),

    //   Footer: (info) => {
    //     // Only calculate total visits if rows change
    //     const total = React.useMemo(
    //       () => info.rows.reduce((sum, row) => row.values.monto + sum, 0),
    //       [info.rows]
    //     );

    //     return (
    //       <b className="pie">
    //         {new Intl.NumberFormat("es-AR", {
    //           style: "currency",
    //           currency: "ARS",
    //         }).format(total)}
    //       </b>
    //     );
    //   },

    //   // Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
    // },

    // {
    //   Header: "Modificar",
    //   // accessor: "modifica",
    //   Cell: (row) => (
    //     <div style={{ textAlign: "center" }}>
    //       <button
    //         id="acepto"
    //         className="btn btn-primary"
    //         onClick={(e) => modificaComanda(row.row.original._id)}
    //       >
    //         <i
    //           className="fa fa-pencil-square-o"
    //           aria-hidden="true"
    //           color="white"
    //         ></i>
    //       </button>
    //       {/* <GetDataInvoiceAdmin datacomanda={row.row.original.nrodecomanda} /> */}
    //     </div>
    //   ),
    // },

    {
      Header: "Eliminar",
      width: 80,
      // accessor: "elimina",
      Cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <button
            id="acepto"
            className="btn btn-danger"
            onClick={(e) => deleteRemito(row.row.original.nroderemito)}
          >
            <i
              className="fa fa-trash-o"
              aria-hidden="true"
              style={{ color: contrastText }}
            ></i>
          </button>
          {/* <GetDataInvoiceAdmin datacomanda={row.row.original.nrodecomanda} /> */}
        </div>
      ),
    },

    // {
    //   Header: "Impresion",
    //   // accessor: "impresion",
    //   Cell: (row) => (
    //     <div style={{ textAlign: "center" }}>
    //       {/* <button id="acepto" className="btn btn-primary" onClick={(e) => modificaComanda(row.row.original._id)}>
    //       <i className="fa fa-pencil-square-o" aria-hidden="true" ></i>
    //     </button> */}
    //       <GetDataInvoiceAdmin datacomanda={row.row.original.nrodecomanda} />
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      <h1>
        <center>Administracion de Remitos</center>
      </h1>
      <Styles className="table sticky" style={{ width: "auto", height: 400 }}>
        <div className="App">
          
          <Table columns={columns} data={data} />
        </div>
        <ModalComanda show={show} handleClose={handleClose} comanda={comanda} />
      </Styles>
    </>
  );
}

export default AppRemitoReactTable;
