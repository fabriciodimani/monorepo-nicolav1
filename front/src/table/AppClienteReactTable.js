import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Table from "./TableContainer";
import { getSaldosClientesCuentaCorriente } from "../helpers/rutaCuentaCorriente";

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
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      background-color: #f0f2eb;
      font-size: 13px;

      :last-child {
        border-right: 0;
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

const numberFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

function toNumber(value) {
  if (typeof value === "number") {
    return value;
  }
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function AppClienteReactTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const res = await axios("http://localhost:3004/clientes");
        const clientes = res.data?.clientes || [];
        const activos = clientes.filter((cliente) => cliente.activo !== false);
        setData(activos);

        const tokenGuardado = localStorage.getItem("token");
        const clienteIds = activos
          .map((cliente) => cliente?._id || cliente?.id || null)
          .filter(Boolean)
          .map((id) => String(id));

        if (!tokenGuardado || clienteIds.length === 0) {
          return;
        }

        const respuesta = await getSaldosClientesCuentaCorriente(clienteIds);

        if (respuesta.ok && Array.isArray(respuesta.clientes)) {
          const saldosPorCliente = new Map(
            respuesta.clientes
              .filter((registro) => registro && registro.clienteId !== undefined)
              .map((registro) => [
                String(registro.clienteId),
                typeof registro.saldo === "number" ? registro.saldo : toNumber(registro.saldo),
              ])
          );

          if (saldosPorCliente.size > 0) {
            setData(
              activos.map((cliente) => {
                const id = String(cliente._id || cliente.id || "");

                if (id && saldosPorCliente.has(id)) {
                  return { ...cliente, saldo: saldosPorCliente.get(id) };
                }

                return cliente;
              })
            );
          }
        }
      } catch (err) {
        console.log(err);
        setData([]);
      }
    };

    cargarClientes();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Nro",
        accessor: "codcli",
        width: 90,
        Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
      },
      {
        Header: "Razón Social",
        accessor: "razonsocial",
        width: 220,
      },
      {
        Header: "Domicilio",
        accessor: "domicilio",
        width: 220,
      },
      {
        Header: "Teléfono",
        accessor: "telefono",
        width: 140,
        Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
      },
      {
        Header: "CUIT",
        accessor: "cuit",
        width: 140,
        Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
      },
      {
        Header: "Ruta",
        id: "ruta",
        accessor: (row) => row?.ruta?.ruta || "",
        width: 120,
        Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
      },
      {
        Header: "Saldo",
        accessor: "saldo",
        width: 140,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{numberFormatter.format(toNumber(value))}</div>
        ),
        Footer: (info) => {
          const total = info.rows.reduce((sum, row) => {
            const val = row.values.saldo;
            return sum + toNumber(val);
          }, 0);

          return (
            <div style={{ textAlign: "right" }}>
              <b className="pie">{numberFormatter.format(total)}</b>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <h1>
        <center>Listar Clientes</center>
      </h1>
      <Styles className="table sticky" style={{ width: "auto", height: 400 }}>
        <div className="App">
          <Table columns={columns} data={data} />
        </div>
      </Styles>
    </>
  );
}

export default AppClienteReactTable;
