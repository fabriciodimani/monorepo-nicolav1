import React from "react";
import styled from "styled-components";
import {usePagination,useFilters,useSortBy,useBlockLayout,} from "react-table";
import { useSticky } from 'react-table-sticky';
import { useTable, useGroupBy, useExpanded } from "react-table";
import { useExportData } from "react-table-plugins";
// import makeData from "./makeData";

import Papa from "papaparse";
import XLSX from "xlsx";
import JsPDF from "jspdf";
import "jspdf-autotable";

import { GlobalFilter, DefaultFilterForColumn } from "./Filter";
import "../css/tablecamion.css";

const Styles = styled.div`
  padding: 1rem;

  table {
    margin-top: 2px;
    border-spacing: 0;
    border: 1px solid var(--color-border-strong);
    background-color: var(--color-surface);
    color: var(--color-text-primary);

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
      border-bottom: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function getExportFileBlob({ columns, data, fileType, fileName }) {
  //Import CSV
  if (fileType === "csv") {
    // CSV example
    const headerNames = columns.map((col) => col.exportValue);
    const csvString = Papa.unparse({ fields: headerNames, data });
    return new Blob([csvString], { type: "text/csv" });
  }


  if (fileType === "pdf") {
    // debugger;
    const headerNames = columns.map((column) => column.exportValue);
    const doc = new JsPDF();
    const fecha = new Date().toLocaleDateString();
    doc.text("ORDENES DE PREPARACION DE MERCADERIA - Fecha: " + fecha, 10, 10);
    doc.text("Total Registros: " + data.length, 10, 16);

    let acuCantidad = 0;
    let arregloaux = [];
    for (let i = 0; i < data.length; i++) {
      arregloaux = data[i];
      // console.log("data" + i, arregloaux);
      acuCantidad = acuCantidad + arregloaux[3];

      // for (let j = 0; j < arregloaux.length; j++) {

      // }
    }
    doc.text("Bultos Totales: " + acuCantidad, 70, 16);

    doc.autoTable({
      head: [headerNames],
      body: data,
      margin: { top: 25 },
      styles: {
        minCellHeight: 9,
        halign: "left",
        valign: "center",
        fontSize: 9,
      },
    });

    console.log(data);

    doc.save(`Ordenes de preparacion ${fecha}.pdf`);

    return false;
  }

  // Other formats goes here
  return false;
}

export default function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    state: { groupBy, expanded },
    visibleColumns,
    exportData,
  } = useTable(
    {
      columns,
      data,
      getExportFileBlob,
    },
    useGroupBy,
    useExportData,
    useExpanded, // useGroupBy would be pretty useless without useExpanded ;)
    useSticky,
    // useBlockLayout
  );

  // We don't want to render all of the rows for this example, so cap
  // it at 100 for this use case
  const firstPageRows = rows.slice(0, 10000);

  return (
    <>
     <div>
        <button className="botones"
                onClick={() => {
                exportData("csv", true);
          }}
        >
          Exportar TODO as CSV y Excel
        </button>
        <button className="botones"
                onClick={() => {
                exportData("csv", false);
          }}
        >
          Exportar la VISTA ACTUAL as CSV y Excel
        </button>

        <button className="botones"
                onClick={() => {
                exportData("pdf", true);
          }}
        >
          Exportar TODO a PDF
        </button>
        <button className="botones mb-3"
                onClick={() => {
                exportData("pdf", false);
          }}
        >
          Exportar la VISTA ACTUAL a PDF
        </button>
      </div>


      {/* <Legend /> */}
      {/* <div className="">.</div> */}
      <table className="table sticky table-striped table-bordered"{...getTableProps()}>
        <thead className="header">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.canGroupBy ? (
                    // If the column can be grouped, let's add a toggle
                    <span {...column.getGroupByToggleProps()}>
                      {column.isGrouped ? "🛑 " : "👊 "}
                    </span>
                  ) : null}
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      // For educational purposes, let's color the
                      // cell depending on what type it is given
                      // from the useGroupBy hook
                      {...cell.getCellProps()}
                      style={{
                        background: cell.isGrouped
                          ? "var(--color-surface)"
                          : cell.isAggregated
                          ? "var(--color-surface)"
                          : cell.isPlaceholder
                          ? "var(--color-surface)"
                          : "var(--color-surface)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? "👇" : "👉"}
                          </span>{" "}
                          {cell.render("Cell")} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render("Aggregated")
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          {footerGroups.map((group) => (
            <tr {...group.getFooterGroupProps()}>
              {group.headers.map((column) => (
                <td {...column.getFooterProps()}>{column.render("Footer")}</td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <br />
      <div><h3>RESULTADO DE {rows.length} REGISTROS</h3></div>
    </>
  );
}
