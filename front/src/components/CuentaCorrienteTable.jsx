import React from "react";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (fecha) => {
  if (!fecha) {
    return "-";
  }
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString("es-AR");
};

const obtenerDescripcion = (movimiento) => {
  if (movimiento.descripcion) {
    return movimiento.descripcion;
  }
  if (movimiento.tipo === "Venta" && movimiento.comanda) {
    return `Comanda ${
      movimiento.comanda.nrodecomanda || movimiento.comanda._id || ""
    }`;
  }
  return "-";
};

const CuentaCorrienteTable = ({ movimientos, loading }) => {
  if (loading) {
    return (
      <div className="alert alert-info" role="alert">
        Cargando movimientos de cuenta corriente...
      </div>
    );
  }

  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="alert alert-secondary" role="alert">
        No se registran movimientos para el cliente seleccionado.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descripción</th>
            <th className="text-right">Monto</th>
            <th>Fecha</th>
            <th className="text-right">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento) => {
            const monto = Number(movimiento.monto || 0);
            const montoConSigno =
              movimiento.tipo === "Pago" ? -Math.abs(monto) : Math.abs(monto);
            return (
              <tr key={movimiento._id}>
                <td>{movimiento.tipo}</td>
                <td>{obtenerDescripcion(movimiento)}</td>
                <td className="text-right">
                  ${" "}
                  {formatCurrency(montoConSigno)}
                </td>
                <td>{formatDate(movimiento.fecha)}</td>
                <td className="text-right">
                  ${" "}
                  {formatCurrency(movimiento.saldo)}
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
