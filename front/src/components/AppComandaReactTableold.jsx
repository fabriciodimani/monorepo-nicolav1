import React, { useState, useEffect } from "react";
import GetDataInvoiceAdmin from "../report/GetDataInvoiceAdmin";
// import ReactTable from "react-table";
import styled from "styled-components";
import axios from "axios";
import _ from "lodash";
import Table from "./TableContainer";
import { SelectColumnFilter } from "./Filter";
import ModalComanda from "./ModalComanda";

// import "./App.css";

function AppComandaReactTable() {
  const [print, setPrint] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios("http://localhost:3004/comandas")
      .then((res) => {
        setData(res.data.comandas);
      })
      .catch((err) => console.log(err));
  }, []);

  const Styles = styled.div`
    padding: 0rem;

    table {
      // color: red;
      border-spacing: 0;
      border: 1px solid black;

      tr {
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }

      th,
      td {
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;

        :last-child {
          border-right: 0;
        }

        input {
          font-size: 1rem;
          padding: 0;
          margin: 0;
          border: 2;
        }
      }
    }

    .pagination {
      padding: 0.5rem;
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
            width: "70px",
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
            width: "70px",
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
    return <ModalComanda comanda={5} />;
    // <ModalComanda show={show} handleClose={handleClose} comanda={comanda} />
    // display modal
    // say user types in modal new firstName
    // post request

    // set row.firstName = newFirstName
  }

  // Boton Imprimir
  const handlePrint = (row) => {
    console.log(row);
    console.log(row.nrodecomanda);
    setPrint(true);
    // return (
    //   <>

    //     <GetDataInvoiceAdmin datacomanda={5} />
    //     {console.log("Adentro")}
    //   </>
    //   // display modal
    //   // say user types in modal new firstName
    //   // post request
    //   // set row.firstName = newFirstName
    // );
  };

  console.log(data);
  const columns = [
    {
      id: "comanda",
      Header: "Nro Comanda",
      accessor: "nrodecomanda",
      filter: "equals",

      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },
    {
      id: "fecha",
      Header: "Fecha de Comanda",
      accessor: "fecha",
      Cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.value.slice(0, 10)}</div>
      ),

      Filter: DateRangeColumnFilter,
      // filter: "between",
      filter: dateBetweenFilterFn,
    },

    {
      Header: "Cliente",
      accessor: "codcli.razonsocial",
    },
    {
      Header: "Producto",
      accessor: "codprod.descripcion",
    },

    {
      Header: "Cantidad",
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
            {" "}
            <b>Total Cantidad: {total}</b>{" "}
          </>
        );
      },

      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },

    {
      id: "entrega",
      Header: "Entregado",
      accessor: (entrega) => entrega.entregado.toString(),

      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },

    {
      Header: "Lista",
      accessor: "lista.lista",
    },

    {
      Header: () => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          Monto
        </div>
      ),

      accessor: "monto",

      Cell: (props) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(props.value),

      Footer: (info) => {
        // Only calculate total visits if rows change
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.monto + sum, 0),
          [info.rows]
        );

        return (
          <b>
            Total Monto:{" "}
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(total)}
          </b>
        );
      },

      // Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
    },

    {
      Header: "Acciones",
      accessor: "action",
      Cell: (row) => (
        <div>
          {/* <button onClick={(e) => handleEdit(row.row.original)}>Edit</button> */}
          {/* <button onClick={(e) => handlePrint(row.row.original)}>Print</button> */}
          <GetDataInvoiceAdmin datacomanda={row.row.original.nrodecomanda} />
        </div>
      ),
    },
  ];

  return (
    <Styles>
      <div className="App">
        <h1>
          <center>Informe Comandas</center>
        </h1>
        <Table columns={columns} data={data} />
      </div>
      {/* {print && <GetDataInvoiceAdmin datacomanda={5} />} */}
      {/* <GetDataInvoiceAdmin datacomanda={5} /> */}
    </Styles>
  );
}

export default AppComandaReactTable;

// Cell: (props) => <span>{props.value}</span>,
// Footer: <span>{_.sum(_.map(data, (d) => d.cantidad.cant))}</span>,

// accessor: "cantidad",
// Footer: "cantidad",
// Cell: (props) => <span>{props.value}</span>,
// Footer: <span>"dgsahdgashgdhsa"</span>,
// // Footer: (info) =>
//   _.sum(info.filteredRows.map((row) => row.values.cantidad)),
// Footer: <span>{_.sum(_.map(data, (d) => d.cantidad))}</span>,
// Footer: () => {
//   let ageSum = 0;
//   for (let i = 0; i <= data.length; i++) {
//     ageSum += data[i].cantidad;
//   }
//   return "Total: " + ageSum;
// },
// Footer: (
//   <span>
//     {data.reduce((total, { cantidad }) => (total += cantidad), 0)}
//   </span>

// ),

// Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,

// Cell: (cell) => {
//   const value = sumColumnFormatter(cell.row);
//   return <span> {value}</span>;
// },

// accesor: (entrega) => {
//   return entrega.entregado.toString() === "true" ? "Si" : "No";
// },
// accessor: (entregado) => entregado.toString(),
// Cell: (entrega) => entrega.toString(),
// Cell: (entrega) => (entrega ? "YES" : "NOOO"),
// Cell: (entrega) => entrega.toString(),
// Cell: (entrega) => {
//   return entrega ? "Si" : "No";
// },
