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
  const date = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (fecha) => {
  if (!fecha) {
    return "";
  }
  const date = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const redondearMoneda = (valor) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    return 0;
  }
  const redondeado = Number(numero.toFixed(2));
  return Object.is(redondeado, -0) ? 0 : redondeado;
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

const normalizarDescripcion = (movimiento, numeroComanda) => {
  if (movimiento.descripcion) {
    return movimiento.descripcion;
  }

  if (numeroComanda) {
    return `Comanda #${numeroComanda}`;
  }

  if (movimiento.tipo === "Pago") {
    return "Pago registrado";
  }

  return "Movimiento";
};

const obtenerFechaMovimiento = (movimiento = {}) => {
  const fechasPosibles = [movimiento.fecha, movimiento.createdAt, movimiento.updatedAt];

  for (let i = 0; i < fechasPosibles.length; i += 1) {
    const fecha = fechasPosibles[i];
    if (!fecha) {
      continue;
    }

    const date = new Date(fecha);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
};

const obtenerImpacto = (tipo, monto) => {
  const tipoNormalizado = typeof tipo === "string" ? tipo.toLowerCase() : "";
  if (tipoNormalizado === "pago") {
    return -monto;
  }
  return monto;
};

const CuentaCorrienteTable = ({
  movimientos = [],
  saldoActual = 0,
  loading = false,
}) => {
  const movimientosProcesados = useMemo(() => {
    if (!Array.isArray(movimientos) || !movimientos.length) {
      return [];
    }

    const lista = [...movimientos];

    const movimientosOrdenados = lista
      .map((movimiento, index) => {
        const numeroComanda = obtenerNumeroComanda(movimiento);
        const cliente = obtenerClienteDeMovimiento(movimiento);
        const nombreCliente = obtenerNombreCliente(cliente);
        const fechaMovimiento = obtenerFechaMovimiento(movimiento);
        const montoNumerico = Math.abs(Number(movimiento.monto) || 0);
        const impacto = obtenerImpacto(movimiento.tipo, montoNumerico);

        return {
          key: movimiento._id || `${index}-${numeroComanda || "sin-comanda"}`,
          ...movimiento,
          numeroComanda,
          cliente,
          nombreCliente,
          fechaMovimiento,
          montoNumerico,
          impacto,
          descripcionNormalizada: normalizarDescripcion(
            movimiento,
            numeroComanda
          ),
        };
      })
      .sort((a, b) => {
        const fechaA = a.fechaMovimiento ? a.fechaMovimiento.getTime() : 0;
        const fechaB = b.fechaMovimiento ? b.fechaMovimiento.getTime() : 0;

        if (fechaA === fechaB) {
          const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return createdB - createdA;
        }

        return fechaB - fechaA;
      });

    let saldoAcumulado = redondearMoneda(saldoActual);

    return movimientosOrdenados.map((movimiento) => {
      const registro = {
        ...movimiento,
        saldoMostrado: saldoAcumulado,
      };

      saldoAcumulado = redondearMoneda(saldoAcumulado - movimiento.impacto);

      return registro;
    });
  }, [movimientos, saldoActual]);

  if (loading) {
    return (
      <div className="alert alert-info" role="alert">
        Cargando movimientos...
      </div>
    );
  }

  if (!movimientosProcesados.length) {
    return (
      <div className="alert alert-light" role="alert">
        No hay movimientos para mostrar.
      </div>
    );
  }

  const saldoEsPositivo = Number(saldoActual) >= 0;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <div>
          <h5 className="mb-1">Resumen de operaciones</h5>
          <p className="text-muted mb-0">
            Las últimas comandas y pagos aparecen primero.
          </p>
        </div>
        <span
          className={`saldo-actual-chip ${
            saldoEsPositivo ? "saldo-positivo" : "saldo-negativo"
          }`}
        >
          Saldo actual: {formatCurrency(saldoActual)}
        </span>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle cuenta-corriente-tabla">
          <thead className="thead-light">
            <tr>
              <th className="text-nowrap">Fecha</th>
              <th className="text-nowrap">Comanda</th>
              <th className="text-nowrap">Tipo</th>
              <th>Descripción</th>
              <th className="text-right text-nowrap">Monto</th>
              <th className="text-right text-nowrap">Saldo acumulado</th>
            </tr>
          </thead>
          <tbody>
            {movimientosProcesados.map((movimiento) => {
              const montoFormateado = formatCurrency(movimiento.montoNumerico);
              const saldoFormateado = formatCurrency(movimiento.saldoMostrado);
              const esPago =
                typeof movimiento.tipo === "string" &&
                movimiento.tipo.toLowerCase() === "pago";

              return (
                <tr key={movimiento.key}>
                  <td className="align-middle">
                    <div className="font-weight-semibold">
                      {formatDate(movimiento.fechaMovimiento) || "-"}
                    </div>
                    <small className="text-muted">
                      {formatTime(movimiento.fechaMovimiento)}
                    </small>
                  </td>
                  <td className="align-middle">
                    {movimiento.numeroComanda ? (
                      <span className="badge badge-light border text-monospace">
                        #{movimiento.numeroComanda}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="align-middle">
                    <span
                      className={`badge ${
                        esPago ? "badge-success" : "badge-info"
                      } px-3 py-2 text-uppercase`}
                    >
                      {movimiento.tipo || ""}
                    </span>
                  </td>
                  <td className="align-middle">
                    <div className="font-weight-semibold">
                      {movimiento.descripcionNormalizada}
                    </div>
                    {movimiento.nombreCliente && (
                      <small className="text-muted d-block">
                        {movimiento.nombreCliente}
                      </small>
                    )}
                  </td>
                  <td className="align-middle text-right">
                    <span
                      className={`font-weight-bold ${
                        esPago ? "text-success" : "text-danger"
                      }`}
                    >
                      {esPago ? "-" : "+"} {montoFormateado}
                    </span>
                  </td>
                  <td className="align-middle text-right font-weight-semibold text-primary">
                    {saldoFormateado}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CuentaCorrienteTable;
