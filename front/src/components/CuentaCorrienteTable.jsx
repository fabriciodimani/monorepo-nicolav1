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
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

  return null;
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

const normalizarMovimiento = (movimiento, index) => {
  const fechaObjeto = movimiento.fecha ? new Date(movimiento.fecha) : null;
  const fechaValida = fechaObjeto && !Number.isNaN(fechaObjeto.getTime())
    ? fechaObjeto
    : null;
  const numeroComanda = obtenerNumeroComanda(movimiento);
  const cliente = obtenerClienteDeMovimiento(movimiento);

  return {
    ...movimiento,
    _key:
      movimiento._id ||
      `${fechaValida ? fechaValida.getTime() : "sin-fecha"}-${index}`,
    fechaObjeto: fechaValida,
    fechaFormateada: formatDate(movimiento.fecha),
    numeroComanda,
    nombreCliente: obtenerNombreCliente(cliente),
  };
};

const ordenarMovimientosPorFechaDesc = (movimientos) => {
  return [...movimientos].sort((a, b) => {
    if (a.fechaObjeto && b.fechaObjeto) {
      return b.fechaObjeto.getTime() - a.fechaObjeto.getTime();
    }

    if (a.fechaObjeto) {
      return -1;
    }

    if (b.fechaObjeto) {
      return 1;
    }

    return b._key.localeCompare(a._key);
  });
};

const CuentaCorrienteTable = ({ movimientos = [], loading = false }) => {
  const movimientosOrdenados = useMemo(() => {
    if (!Array.isArray(movimientos) || !movimientos.length) {
      return [];
    }

    const normalizados = movimientos.map(normalizarMovimiento);
    return ordenarMovimientosPorFechaDesc(normalizados);
  }, [movimientos]);

  if (loading) {
    return (
      <div className="alert alert-info" role="alert">
        Cargando movimientos...
      </div>
    );
  }

  if (!movimientosOrdenados.length) {
    return (
      <div className="alert alert-light" role="alert">
        No hay movimientos para mostrar.
      </div>
    );
  }

  return (
    <div className="movimientos-card shadow-sm">
      <div className="list-group list-group-flush">
        {movimientosOrdenados.map((movimiento) => {
          const esPago =
            movimiento.tipo &&
            typeof movimiento.tipo === "string" &&
            movimiento.tipo.toLowerCase() === "pago";
          const signoMonto = esPago ? "- " : "+ ";
          const descripcionMovimiento =
            movimiento.descripcion ||
            (esPago
              ? "Pago registrado"
              : movimiento.numeroComanda
              ? `Comanda #${movimiento.numeroComanda}`
              : "Comanda registrada");

          return (
            <div
              key={movimiento._key}
              className="list-group-item movimiento-item"
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="movimiento-detalle">
                  <div className="d-flex align-items-center flex-wrap mb-2">
                    <span
                      className={`badge badge-pill ${
                        esPago ? "badge-success" : "badge-warning"
                      } movimiento-tipo`}
                    >
                      {movimiento.tipo || "Movimiento"}
                    </span>
                    {movimiento.numeroComanda && (
                      <span className="badge badge-secondary movimiento-comanda ml-2">
                        #{movimiento.numeroComanda}
                      </span>
                    )}
                    {movimiento.nombreCliente && (
                      <span className="text-muted small ml-3">
                        {movimiento.nombreCliente}
                      </span>
                    )}
                  </div>
                  <h6 className="mb-1 movimiento-descripcion">
                    {descripcionMovimiento}
                  </h6>
                  <div className="text-muted small">
                    {movimiento.fechaFormateada || "Fecha no registrada"}
                  </div>
                </div>
                <div className="text-right movimiento-importes">
                  <div
                    className={`h5 mb-1 font-weight-bold ${
                      esPago ? "text-success" : "text-danger"
                    }`}
                  >
                    {signoMonto}
                    {formatCurrency(movimiento.monto)}
                  </div>
                  <small className="text-muted d-block">Saldo acumulado</small>
                  <div className="font-weight-bold movimiento-saldo">
                    {formatCurrency(movimiento.saldo)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CuentaCorrienteTable;
