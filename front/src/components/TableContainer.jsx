import { React } from "react";
// import "react-table/react-table.css";

import {
  useTable,
  // useGlobalFilter,
  usePagination,
  useFilters,
  useSortBy,
} from "react-table";

import { useExportData } from "react-table-plugins";

import Papa from "papaparse";
import XLSX from "xlsx";
import JsPDF from "jspdf";
import "jspdf-autotable";

import { GlobalFilter, DefaultFilterForColumn } from "./Filter";

function getExportFileBlob({ columns, data, fileType, fileName }) {
  //Import CSV
  if (fileType === "csv") {
    // CSV example
    const headerNames = columns.map((col) => col.exportValue);
    const csvString = Papa.unparse({ fields: headerNames, data });
    return new Blob([csvString], { type: "text/csv" });
  }
  // else if (fileType === "xlsx") {
  //   // XLSX example

  //   const header = columns.map((c) => c.exportValue);
  //   const compatibleData = data.map((row) => {
  //     const obj = {};
  //     header.forEach((col, index) => {
  //       obj[col] = row[index];
  //     });
  //     return obj;
  //   });

  //   let wb = XLSX.utils.book_new();
  //   let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
  //     header,
  //   });
  //   XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
  //   XLSX.writeFile(wb, `${fileName}.xlsx`);

  //   // Returning false as downloading of file is already taken care of
  //   return false;
  // }
  //PDF example
  if (fileType === "pdf") {
    debugger;
    const headerNames = columns.map((column) => column.exportValue);
    const doc = new JsPDF();
    doc.autoTable({
      head: [headerNames],
      body: data,
      margin: { top: 2 },
      styles: {
        minCellHeight: 9,
        halign: "left",
        valign: "center",
        fontSize: 7,
      },
    });
    doc.save(`${fileName}.pdf`);

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
      initialState: { pageIndex: 0 },
      defaultColumn: { Filter: DefaultFilterForColumn },
      getExportFileBlob,
    },

    // useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
    useExportData
  );

  return (
    <>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre> */}
      <button
        onClick={() => {
          exportData("csv", true);
        }}
      >
        Exportar TODO as CSV y Excel
      </button>
      <button
        onClick={() => {
          exportData("csv", false);
        }}
      >
        Exportar la VISTA ACTUAL as CSV y Excel
      </button>
      {/* <button
        onClick={() => {
          exportData("xlsx", true);
        }}
      >
        Export All as xlsx
      </button> */}
      {/* <button
        onClick={() => {
          exportData("xlsx", false);
        }}
      >
        Export Current View as xlsx
      </button> */}
      <button
        onClick={() => {
          exportData("pdf", true);
        }}
      >
        Exportar TODO a PDF
      </button>{" "}
      <button
        onClick={() => {
          exportData("pdf", false);
        }}
      >
        Exportar la VISTA ACTUAL a PDF
      </button>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // <th {...column.getHeaderProps()}>
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}

                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>

                  {/* rendering column filter */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}

              {/* <th
                colSpan={visibleColumns.length}
                style={{
                  textAlign: "center",
                }}
              >
                {/* rendering global filter */}
              {/* <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                /> */}
              {/* </th>  */}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
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
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            Go to page:{" "}
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
            {[10, 20, 30, 40, 50].map((pageSize) => (
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
