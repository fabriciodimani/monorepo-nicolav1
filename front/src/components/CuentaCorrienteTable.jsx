import React from "react";
import { calcularSaldoMovimiento } from "../utils/cuentaCorriente";

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

  const movimientosCalculados = movimientos.map((movimiento) => ({
    ...movimiento,
    saldoCalculado: calcularSaldoMovimiento(movimiento),
  }));

  const saldoTotal = movimientosCalculados.reduce(
    (total, movimiento) => total + movimiento.saldoCalculado,
    0
  );

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="thead-light">
          <tr>
            <th>Tipo</th>
            <th>Descripción</th>
            <th className="text-right">Monto</th>
            <th>Fecha</th>
            <th className="text-right">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {movimientosCalculados.map((movimiento, index) => (
            <tr key={movimiento._id || `${movimiento.fecha}-${index}`}>
              <td>{movimiento.tipo}</td>
              <td>{movimiento.descripcion || ""}</td>
              <td className="text-right">{formatCurrency(movimiento.monto)}</td>
              <td>{formatDate(movimiento.fecha)}</td>
              <td className="text-right">
                {formatCurrency(movimiento.saldoCalculado)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="text-right font-weight-bold">
              Total
            </td>
            <td className="text-right font-weight-bold">
              {formatCurrency(saldoTotal)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CuentaCorrienteTable;
