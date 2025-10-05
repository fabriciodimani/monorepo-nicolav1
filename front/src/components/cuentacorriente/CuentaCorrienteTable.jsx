import React from "react";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const fecha = new Date(value);
  if (Number.isNaN(fecha.getTime())) {
    return "";
  }
  return fecha.toLocaleDateString();
};

const CuentaCorrienteTable = ({ movimientos = [] }) => {
  if (!movimientos.length) {
    return (
      <div className="alert alert-info" role="alert">
        No hay movimientos registrados para el período seleccionado.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Tipo</th>
            <th scope="col">Descripción</th>
            <th scope="col">Monto</th>
            <th scope="col">Fecha</th>
            <th scope="col">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento, index) => (
            <tr key={movimiento._id || `${movimiento.tipo}-${index}`}>
              <td>{movimiento.tipo}</td>
              <td>{movimiento.descripcion || "-"}</td>
              <td>{currencyFormatter.format(movimiento.monto)}</td>
              <td>{formatDate(movimiento.fecha)}</td>
              <td>{currencyFormatter.format(movimiento.saldo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CuentaCorrienteTable;
