import React, { useMemo } from "react";

const formatCurrency = (valor) => {
  const numero = Number(valor) || 0;
  return numero.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
};

const formatDate = (fecha) => {
  if (!fecha) {
    return "";
  }
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("es-AR");
};

const obtenerNumeroComanda = (movimiento = {}) => {
  if (movimiento.nrodecomanda !== undefined && movimiento.nrodecomanda !== null) {
    return movimiento.nrodecomanda;
  }

  if (
    movimiento.comanda &&
    typeof movimiento.comanda === "object" &&
    movimiento.comanda.nrodecomanda !== undefined &&
    movimiento.comanda.nrodecomanda !== null
  ) {
    return movimiento.comanda.nrodecomanda;
  }

  return "";
};

const esClienteValido = (cliente) => {
  if (!cliente || typeof cliente !== "object") {
    return false;
  }

  return ["razonsocial", "nombre", "apellido"].some((propiedad) =>
    Object.prototype.hasOwnProperty.call(cliente, propiedad)
  );
};

const obtenerClienteDeMovimiento = (movimiento = {}) => {
  if (esClienteValido(movimiento.cliente)) {
    return movimiento.cliente;
  }

  if (
    movimiento.comanda &&
    typeof movimiento.comanda === "object" &&
    esClienteValido(movimiento.comanda.codcli)
  ) {
    return movimiento.comanda.codcli;
  }

  return null;
};

const obtenerNombreCliente = (cliente) => {
  if (!cliente) {
    return "";
  }

  if (cliente.razonsocial) {
    return cliente.razonsocial;
  }

  const partes = [cliente.nombre, cliente.apellido].filter(Boolean);
  return partes.join(" ").trim();
};

const obtenerMontoNumerico = (valor, defecto = 0) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : defecto;
};

const redondearMoneda = (valor) => {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return 0;
  }

  const redondeado = Number(numero.toFixed(2));
  return Object.is(redondeado, -0) ? 0 : redondeado;
};

const obtenerTimestamp = (valor) => {
  if (!valor) {
    return null;
  }

  const fecha = new Date(valor);
  const timestamp = fecha.getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
};

const calcularImpactoSaldo = (movimiento) => {
  const tipo =
    movimiento && typeof movimiento.tipo === "string"
      ? movimiento.tipo.toLowerCase()
      : "";
  const monto = obtenerMontoNumerico(movimiento.monto, 0);

  if (tipo === "pago") {
    return -monto;
  }

  if (tipo === "venta") {
    return monto;
  }

  if (tipo === "anulación" || tipo === "anulacion") {
    return monto;
  }

  return monto;
};

const compararMovimientosDesc = (a, b) => {
  const fechaA = obtenerTimestamp(a?.fecha);
  const fechaB = obtenerTimestamp(b?.fecha);

  if (fechaA !== fechaB) {
    if (fechaA === null) {
      return 1;
    }

    if (fechaB === null) {
      return -1;
    }

    return fechaB - fechaA;
  }

  const creadoA = obtenerTimestamp(a?.createdAt);
  const creadoB = obtenerTimestamp(b?.createdAt);

  if (creadoA !== creadoB) {
    if (creadoA === null) {
      return 1;
    }

    if (creadoB === null) {
      return -1;
    }

    return creadoB - creadoA;
  }

  const numeroComandaA = obtenerMontoNumerico(obtenerNumeroComanda(a), null);
  const numeroComandaB = obtenerMontoNumerico(obtenerNumeroComanda(b), null);

  if (
    Number.isFinite(numeroComandaA) &&
    Number.isFinite(numeroComandaB) &&
    numeroComandaA !== numeroComandaB
  ) {
    return numeroComandaB - numeroComandaA;
  }

  return 0;
};

const CuentaCorrienteTable = ({
  movimientos = [],
  saldoActual = 0,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="alert alert-info" role="alert">
        Cargando movimientos...
      </div>
    );
  }

  if (!movimientos.length) {
    return (
      <div className="alert alert-light" role="alert">
        No hay movimientos para mostrar.
      </div>
    );
  }

  const movimientosOrdenados = useMemo(() => {
    const movimientosValidos = Array.isArray(movimientos)
      ? movimientos.map((movimiento, index) => ({ movimiento, index }))
      : [];

    movimientosValidos.sort((a, b) => {
      const comparacion = compararMovimientosDesc(a.movimiento, b.movimiento);
      if (comparacion !== 0) {
        return comparacion;
      }

      return b.index - a.index;
    });

    let saldoPosterior = redondearMoneda(
      obtenerMontoNumerico(saldoActual, 0)
    );

    return movimientosValidos.map(({ movimiento }) => {
      const monto = obtenerMontoNumerico(movimiento.monto, 0);
      const impacto = calcularImpactoSaldo({ ...movimiento, monto });
      const saldoCalculado = saldoPosterior;
      saldoPosterior = redondearMoneda(saldoPosterior - impacto);

      return {
        ...movimiento,
        monto,
        saldoCalculado,
      };
    });
  }, [movimientos, saldoActual]);

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="thead-light">
          <tr>
            <th>Comanda</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th className="text-right">Monto</th>
            <th>Fecha</th>
            <th className="text-right">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {movimientosOrdenados.map((movimiento, index) => {
            const numeroComanda = obtenerNumeroComanda(movimiento);
            const cliente = obtenerClienteDeMovimiento(movimiento);
            const nombreCliente = obtenerNombreCliente(cliente);
            const saldoMovimiento =
              movimiento.saldoCalculado ?? movimiento.saldo;

            return (
              <tr key={movimiento._id || `${movimiento.fecha}-${index}`}>
                <td>{numeroComanda || ""}</td>
                <td>{nombreCliente}</td>
                <td>{movimiento.tipo}</td>
                <td>{movimiento.descripcion || ""}</td>
                <td className="text-right">{formatCurrency(movimiento.monto)}</td>
                <td>{formatDate(movimiento.fecha)}</td>
                <td className="text-right">
                  {formatCurrency(saldoMovimiento)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CuentaCorrienteTable;
