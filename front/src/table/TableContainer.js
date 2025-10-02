import { React } from "react";
import {useTable,usePagination,useFilters,useSortBy,useBlockLayout,} from "react-table";
import { useSticky } from 'react-table-sticky';
import { useExportData } from "react-table-plugins";
import Papa from "papaparse";
import XLSX from "xlsx";
import JsPDF from "jspdf";
import "jspdf-autotable";
import "../css/tablecomandas.css";

import { GlobalFilter, DefaultFilterForColumn } from "./Filter";

function getExportFileBlob({ columns, data, fileType, fileName }) {
  if (fileType === "csv") {
    const headerNames = columns.map((col) => col.exportValue);
    const csvString = Papa.unparse({ fields: headerNames, data });
    return new Blob([csvString], { type: "text/csv" });
  }
  if (fileType === "pdf") {
    
    const headerNames = columns.map((column) => column.exportValue);
    const doc = new JsPDF();
    const fecha = new Date().toLocaleDateString();
    doc.text("INFORME ADMINISTRACION DE COMANDAS - Fecha: " + fecha, 10, 10);
    doc.text("Total Registros: " + data.length, 10, 16);


    let acuCantidad = 0;
    let acuCantEntregada=0;
    let acuTotalEntregada=0;
    let Total=0;

    let arregloaux = [];
    for (let i = 0; i < data.length; i++) {
      arregloaux = data[i];
      acuCantidad = acuCantidad + arregloaux[4];
      acuCantEntregada = acuCantEntregada + arregloaux[5];
      acuTotalEntregada=acuTotalEntregada+arregloaux[10];
      Total=Total+arregloaux[11];

    }
    doc.text("Cantidades: " + acuCantidad, 70, 16);
      acuCantEntregada = acuCantEntregada + arregloaux[5];
    doc.text("Cantidades Entregadas: " + acuCantEntregada, 120, 16);
    // doc.text("Total Entregado: " + "$" + acuTotalEntregada, 10, 22);
    // doc.text("Total: " + "$" + Total, 120, 22);
  

    doc.autoTable({
      head: [headerNames],
      body: data,
      margin: { top: 25 },
      styles: {
        theme: 'grid',
        minCellHeight: 22,
        halign: "center",
        valign: "center",
        // lineColor: 8,
        fontSize: 7,
      },
    });
    // doc.save(`${fileName}.pdf`);
    doc.save(`Infome administracion de comandas ${fecha}.pdf`);

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
    state,
    visibleColumns,

    prepareRow,

    setGlobalFilter,
    preGlobalFilteredRows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    exportData,
  } = useTable(
    {
      columns,
      data,
      initialState: {pageSize:50 , pageIndex: 0 },
      defaultColumn: { Filter: DefaultFilterForColumn },
      getExportFileBlob,
    },
    useFilters,
    useSortBy,
    usePagination,
    useExportData,
    useSticky,
    useBlockLayout,
  );

  return (
    <>

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
      
      <button className="botones"
        onClick={() => {
          exportData("pdf", false);
        }}
      >
        Exportar la VISTA ACTUAL a PDF
      </button>

      
      
      <table className="table sticky table-striped table-bordered" {...getTableProps()} >
        <thead className="header"> 
        
          {headerGroups.map((headerGroup) => (
            <tr className="header" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}

                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>

                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
           </tr>
          ))}


        </thead>

        <tbody  {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
      <>
        {/* <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous Page
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next Page
        </button>
        <div>
          Page{" "}
          <em>
            {pageIndex + 1} of {pageOptions.length}
          </em>
        </div>
        <div>Go to page:</div>
        <input
          type="number"
          defaultValue={pageIndex + 1 || 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
        />
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}

        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span>
            Página{" "}
            {pageIndex + 1} a {pageOptions.length}
            {" - - "}
            Ir a página:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[50, 100, 150, 200, 250].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </>
    </>
  );
}
