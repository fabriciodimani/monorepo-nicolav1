import React, { useState, useEffect } from "react";
// import ReactTable from "react-table";
import styled from "styled-components";
import axios from "axios";
import _ from "lodash";
import Table from "./TableContainerOrden";
import "../css/tablecamion.css";
import { getCssVariable } from "../helpers/theme";
// import { SelectColumnFilter } from "./Filter";
// import "./App.css";
function AppHojaRutaReactTable() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios("http://localhost:3004/comandasapreparar")
      .then((res) => {
        setData(res.data.comandas);
      })
      .catch((err) => console.log(err));
  }, []);

  const dangerColor = getCssVariable("--color-status-danger", "#ba1b26");
  const accentColor = getCssVariable("--color-accent", "#e63946");
  const contrastText = getCssVariable("--color-text-on-contrast", "#f5f5f5");
  const infoColor = getCssVariable("--color-status-info", "#548fcd");

  
  const Styles = styled.div`
  sticky: true;  
  padding: 0rem;
  
  table {
    sticky: true;
    // background-color: white;
    // background-color: #548fcd;
    color: var(--color-text-primary);
    border-spacing: 0;
    border: 1px solid var(--color-border-strong);
    font-size: 13px;
    z-index: 1;

    th {
      sticky: true;
      background-color: var(--color-status-success);
      font-size: 1.5rem;
      text-align: center;
      height: 4rem;
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
      font-size: 13px;
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
            width: "150px",
            marginRight: "0.5rem",
          }}
          value={filterValue[0] || ""}
        />
        {" a "}
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
            width: "150px",
            marginRight: "0.5rem",
          }}
          value={filterValue[1]?.slice(0, 10) || ""}
        />
      </div>
    );
  }
  // Boton Editar
  function handleEdit(row) {
    console.log(row);
    // display modal
    // say user types in modal new firstName
    // post request
    // set row.firstName = newFirstName
  }
  // Boton Imprimir
  function handlePrint(row) {
    console.log(row);
    // display modal
    // say user types in modal new firstName
    // post request
    // set row.firstName = newFirstName
  }
  console.log(data);
  const columns = [
    {
      Header: "Camion",
      accessor: "camion.camion",
      color: dangerColor,
      with: "200rem",
    },
    {
      Header: "Ruta",
      accessor: "codcli.ruta.ruta",
      color: dangerColor,
      with: "200rem",
    },
    {
      id: "comanda",
      Header: "Nro",
      accessor: "nrodecomanda",
      style: {
        width: "100px",
        marginRight: "0.5rem",
        color: contrastText,
      },
      color: dangerColor,
      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },
    {
      Header: "Clientes",
      accessor: "codcli.razonsocial",
      background: accentColor,
      color: dangerColor,
      width: "20em",
      margin: "2em",
    },
    {
      Header: "Productos",
      accessor: "codprod.descripcion",
      color: dangerColor,
      with: "200rem",
    },
    // {
    //   Header: "Rubro",
    //   accessor: "codprod.rubro.rubro",
    //   color: "red",
    //   with: "200rem",
    // },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      width: 120,
      style: {
        width: "100px",
        marginRight: "0.5rem",
        
      },
      color: infoColor,
      // Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
      aggregate: "sum",
      Aggregated: ({ value }) => `${value} Cantidad(es)`,

      Footer: (info) => {
        // Only calculate total visits if rows change
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.cantidad + sum, 0),
          [info.rows]
        );
        return (
          <>
            <div style={{ textAlign: "center" }}>
              <b>Total Bultos: {total}</b>{" "}
            </div>
            {" "}
          </>
        );
      },
      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },
  ];
  return (
    <>
      <center>
          <h2>HOJA DE RUTA ORIGEN SAN MIGUEL DE TUCUMAN</h2>
          <h2>Del Dia: {new Date().toLocaleDateString()}</h2>  
      </center>
      <Styles className="table sticky" style={{ width: "auto", height: "auto" }}>
        <div className="APP">
          <center>
            <Table columns={columns} data={data} />
          </center>
        </div>
      </Styles>
    </>
  );
}
export default AppHojaRutaReactTable;
