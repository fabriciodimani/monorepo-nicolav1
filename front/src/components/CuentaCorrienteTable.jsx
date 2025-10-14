import React from "react";

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

const obtenerMontoConSigno = (movimiento = {}) => {
  const monto = Number(movimiento.monto) || 0;

  if (movimiento.tipo === "Pago") {
    return -Math.abs(monto);
  }

  return monto;
};

const CuentaCorrienteTable = ({ movimientos = [], loading = false }) => {
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
          {movimientos.map((movimiento, index) => {
            const numeroComanda = obtenerNumeroComanda(movimiento);
            const cliente = obtenerClienteDeMovimiento(movimiento);
            const nombreCliente = obtenerNombreCliente(cliente);
            const montoConSigno = obtenerMontoConSigno(movimiento);

            return (
              <tr key={movimiento._id || `${movimiento.fecha}-${index}`}>
                <td>{numeroComanda || ""}</td>
                <td>{nombreCliente}</td>
                <td>{movimiento.tipo}</td>
                <td>{movimiento.descripcion || ""}</td>
                <td className="text-right">{formatCurrency(montoConSigno)}</td>
                <td>{formatDate(movimiento.fecha)}</td>
                <td className="text-right">{formatCurrency(movimiento.saldo)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CuentaCorrienteTable;
