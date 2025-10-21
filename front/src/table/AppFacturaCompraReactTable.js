import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Table from "./TableContainer";
import { getFacturasCompra } from "../helpers/rutaFacturasCompra";
import { formatearMontoARS } from "../helpers/moneda";
import "../css/tablecomandas.css";

const Styles = styled.div`
  sticky: true;
  padding: 0rem;

  table {
    sticky: true;
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
      top: 100;
      z-index: 1;
    }

    td {
      sticky: true;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      background-color: #f0f2eb;
      font-size: 13px;

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
    }
  }

  .header {
    top: 0;
    box-shadow: 0px 3px 3px #ccc;
    position: sticky;
    z-index: 10;
  }

  [data-sticky-td] {
    position: absolute;
    z-index: 0;
  }
`;

const dateBetweenFilterFn = (rows, id, filterValues) => {
  const start = filterValues[0] ? new Date(filterValues[0]) : undefined;
  const end = filterValues[1] ? new Date(filterValues[1]) : undefined;

  if (!start && !end) {
    return rows;
  }

  return rows.filter((row) => {
    const value = row.values[id];

    if (!value) {
      return false;
    }

    const rowDate = new Date(value);

    if (Number.isNaN(rowDate.getTime())) {
      return false;
    }

    if (start && rowDate < start) {
      return false;
    }

    if (end && rowDate > end) {
      return false;
    }

    return true;
  });
};

const DateRangeColumnFilter = ({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) => {
  const [min, max] = useMemo(() => {
    if (!preFilteredRows.length) {
      const hoy = new Date();
      return [hoy, hoy];
    }

    let minDate;
    let maxDate;

    preFilteredRows.forEach((row) => {
      const raw = row.values[id];

      if (!raw) {
        return;
      }

      const rowDate = new Date(raw);

      if (Number.isNaN(rowDate.getTime())) {
        return;
      }

      if (!minDate || rowDate < minDate) {
        minDate = rowDate;
      }

      if (!maxDate || rowDate > maxDate) {
        maxDate = rowDate;
      }
    });

    const fallback = new Date();

    return [minDate || fallback, maxDate || fallback];
  }, [id, preFilteredRows]);

  const formatInputDate = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().slice(0, 10);
  };

  return (
    <div>
      <input
        min={formatInputDate(min)}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [val ? `${val}T00:00:00.000Z` : undefined, old[1]]);
        }}
        type="date"
        style={{ width: "110px", marginRight: "0.5rem", marginBottom: "2rem" }}
        value={filterValue[0]?.slice(0, 10) || ""}
      />
      <input
        max={formatInputDate(max)}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? `${val}T23:59:59.999Z` : undefined,
          ]);
        }}
        type="date"
        style={{ width: "110px", marginRight: "0.5rem", marginBottom: "2rem" }}
        value={filterValue[1]?.slice(0, 10) || ""}
      />
    </div>
  );
};

const ProveedorColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter, id },
}) => {
  const options = useMemo(() => {
    const valores = new Set();

    preFilteredRows.forEach((row) => {
      const valor = row.values[id];

      if (valor) {
        valores.add(valor);
      }
    });

    return Array.from(valores).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" })
    );
  }, [id, preFilteredRows]);

  return (
    <select
      onChange={(event) => {
        const valor = event.target.value;
        setFilter(valor || undefined);
      }}
      style={{ width: "100%", minWidth: "160px" }}
      value={filterValue || ""}
    >
      <option value="">Todos</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const AppFacturaCompraReactTable = () => {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    let activo = true;

    const cargarFacturas = () => {
      getFacturasCompra({ limite: 2000 }).then((resp) => {
        if (!activo) {
          return;
        }

        const lista = resp?.facturas || [];
        setFacturas(lista);
      });
    };

    cargarFacturas();

    const handler = () => cargarFacturas();
    window.addEventListener("facturascompra:actualizada", handler);

    return () => {
      activo = false;
      window.removeEventListener("facturascompra:actualizada", handler);
    };
  }, []);

  const data = useMemo(() => {
    const activas = facturas.filter(
      (factura) => factura && factura.activo !== false
    );

    return activas
      .slice()
      .sort((a, b) => {
        const fechaA = a?.fecha ? new Date(a.fecha) : null;
        const fechaB = b?.fecha ? new Date(b.fecha) : null;

        if (!fechaA && !fechaB) {
          return 0;
        }

        if (!fechaA) {
          return 1;
        }

        if (!fechaB) {
          return -1;
        }

        return fechaB - fechaA;
      });
  }, [facturas]);

  const columns = useMemo(
    () => [
      {
        Header: "Nro Factura",
        accessor: "numero",
        width: "120",
        sticky: "left",
      },
      {
        Header: "Proveedor",
        id: "proveedor",
        accessor: (row) => row?.proveedor?.razonsocial || "",
        Filter: ProveedorColumnFilter,
        filter: "equals",
        width: "260",
      },
      {
        Header: "Fecha",
        id: "fecha",
        accessor: (row) => row?.fecha,
        Filter: DateRangeColumnFilter,
        filter: dateBetweenFilterFn,
        width: "140",
        Cell: ({ value }) => {
          if (!value) {
            return "";
          }

          const fecha = new Date(value);
          if (Number.isNaN(fecha.getTime())) {
            return "";
          }

          return fecha.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>Monto</div>,
        id: "monto",
        accessor: (row) => Number(row?.monto) || 0,
        width: "140",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatearMontoARS(value)}</div>
        ),
        Footer: (info) => {
          const total = info.rows.reduce(
            (sum, row) => row.values.monto + sum,
            0
          );

          return (
            <div className="pie" style={{ textAlign: "right" }}>
              {formatearMontoARS(total)}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-8 text-center">
          <h1 className="mt-2">Informe Factura Compras</h1>
        </div>
      </div>
      <Styles className="table sticky" style={{ width: "auto", height: 900 }}>
        <div className="App">
          <Table columns={columns} data={data} />
        </div>
      </Styles>
    </>
  );
};

export default AppFacturaCompraReactTable;
