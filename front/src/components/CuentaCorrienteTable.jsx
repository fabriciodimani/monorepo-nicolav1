
import React, { useCallback, useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";


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

const esEntidadValida = (entidad) => {
  if (!entidad || typeof entidad !== "object") {
    return false;
  }

  return ["razonsocial", "nombre", "apellido"].some((propiedad) =>
    Object.prototype.hasOwnProperty.call(entidad, propiedad)
  );
};

const obtenerEntidadDeMovimiento = (movimiento = {}) => {
  if (esEntidadValida(movimiento.cliente)) {
    return movimiento.cliente;
  }

  if (esEntidadValida(movimiento.proveedor)) {
    return movimiento.proveedor;
  }

  if (
    movimiento.comanda &&
    typeof movimiento.comanda === "object" &&
    esEntidadValida(movimiento.comanda.codcli)
  ) {
    return movimiento.comanda.codcli;
  }

  return null;
};

const obtenerNombreEntidad = (entidad) => {
  if (!entidad) {
    return "";
  }

  if (entidad.razonsocial) {
    return entidad.razonsocial;
  }

  const partes = [entidad.nombre, entidad.apellido].filter(Boolean);
  return partes.join(" ").trim();
};

const normalizarDescripcion = (movimiento, numeroComanda) => {
  if (movimiento.descripcion) {
    return movimiento.descripcion;
  }

  if (
    movimiento.facturaCompra &&
    typeof movimiento.facturaCompra === "object" &&
    movimiento.facturaCompra.numero
  ) {
    return `Factura ${movimiento.facturaCompra.numero}`;
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
  const numero = Number(monto);
  if (!Number.isFinite(numero)) {
    return 0;
  }

  const tipoNormalizado = typeof tipo === "string" ? tipo.toLowerCase() : "";
  if (tipoNormalizado === "pago" || tipoNormalizado === "anulación" || tipoNormalizado === "anulacion") {
    return -Math.abs(numero);
  }

  if (numero < 0) {
    return numero;
  }

  return Math.abs(numero);
};

const CuentaCorrienteTable = ({
  movimientos = [],
  saldoActual = 0,
  loading = false,
  entidadLabel = "Cliente",
  descripcionMovimientos = "Las últimas comandas y pagos aparecen primero.",
  titulo = "Resumen de operaciones",
}) => {
  const { movimientosProcesados, saldoFinalCalculado } = useMemo(() => {
    const lista = Array.isArray(movimientos) ? [...movimientos] : [];

    if (!lista.length) {
      return {
        movimientosProcesados: [],
        saldoFinalCalculado: redondearMoneda(saldoActual),
      };
    }

    const movimientosEnriquecidos = lista.map((movimiento, index) => {
      const numeroComanda = obtenerNumeroComanda(movimiento);
      const entidad = obtenerEntidadDeMovimiento(movimiento);
      const nombreEntidad = obtenerNombreEntidad(entidad);
      const fechaMovimiento = obtenerFechaMovimiento(movimiento);
      const montoOriginal = Number(movimiento.monto);
      const montoNumerico = redondearMoneda(
        Number.isFinite(montoOriginal) ? Math.abs(montoOriginal) : 0
      );
      const impacto = redondearMoneda(
        obtenerImpacto(movimiento.tipo, montoOriginal)
      );

      return {
        key: movimiento._id || `${index}-${numeroComanda || "sin-comanda"}`,
        ordenOriginal: index,
        ...movimiento,
        numeroComanda,
        entidad,
        nombreEntidad,
        nombreCliente: nombreEntidad,
        fechaMovimiento,
        montoNumerico,
        impacto,
        descripcionNormalizada: normalizarDescripcion(movimiento, numeroComanda),
      };
    });

    const movimientosAscendentes = [...movimientosEnriquecidos].sort((a, b) => {
      const fechaA = a.fechaMovimiento ? a.fechaMovimiento.getTime() : 0;
      const fechaB = b.fechaMovimiento ? b.fechaMovimiento.getTime() : 0;

      if (fechaA === fechaB) {
        return a.ordenOriginal - b.ordenOriginal;
      }

      return fechaA - fechaB;
    });

    let saldoAcumulado = 0;

    const movimientosConSaldoAsc = movimientosAscendentes.map((movimiento) => {
      const saldoInformado = Number.isFinite(Number(movimiento.saldo))
        ? redondearMoneda(Number(movimiento.saldo))
        : null;

      if (saldoInformado !== null) {
        saldoAcumulado = saldoInformado;
      } else {
        saldoAcumulado = redondearMoneda(saldoAcumulado + movimiento.impacto);
      }

      return {
        ...movimiento,
        saldoMostrado: saldoAcumulado,
      };
    });

    const movimientosDescendentes = [...movimientosConSaldoAsc]
      .reverse()
      .map((movimiento) => ({
        ...movimiento,
        saldoMostrado: redondearMoneda(movimiento.saldoMostrado),
      }));

    const saldoFinalCalculado = movimientosConSaldoAsc.length
      ? movimientosConSaldoAsc[movimientosConSaldoAsc.length - 1].saldoMostrado
      : redondearMoneda(0);

    return {
      movimientosProcesados: movimientosDescendentes,
      saldoFinalCalculado,
    };
  }, [movimientos, saldoActual]);

  const pageSize = 5;
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    setPaginaActual(1);
  }, [movimientosProcesados]);

  const totalPaginas = Math.max(1, Math.ceil(movimientosProcesados.length / pageSize));

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const movimientosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * pageSize;
    const fin = inicio + pageSize;
    return movimientosProcesados.slice(inicio, fin);
  }, [movimientosProcesados, paginaActual]);

  const totalMovimientos = movimientosProcesados.length;
  const rangoInicio = totalMovimientos === 0 ? 0 : (paginaActual - 1) * pageSize + 1;
  const rangoFin = Math.min(paginaActual * pageSize, totalMovimientos);

  const saldoActualMostrado = Number.isFinite(Number(saldoFinalCalculado))
    ? redondearMoneda(saldoFinalCalculado)
    : redondearMoneda(saldoActual);

  const nombreEntidadPrincipal = useMemo(() => {
    const movimientoConEntidad = movimientosProcesados.find(
      (movimiento) => movimiento.nombreEntidad
    );

    return movimientoConEntidad ? movimientoConEntidad.nombreEntidad : "";
  }, [movimientosProcesados]);

  const movimientosParaPdf = useMemo(
    () => movimientosProcesados.slice(0, pageSize),
    [movimientosProcesados]
  );

  const handleExportPdf = useCallback(() => {
    if (!movimientosParaPdf.length) {
      return;
    }

    const doc = new jsPDF();
    const margenInicialX = 14;
    let posicionY = 20;

    doc.setFontSize(16);
    doc.text("Saldo de Cuenta Corriente", margenInicialX, posicionY);

    posicionY += 10;
    doc.setFontSize(12);
    if (nombreEntidadPrincipal) {
      doc.text(
        `${entidadLabel}: ${nombreEntidadPrincipal}`,
        margenInicialX,
        posicionY
      );
      posicionY += 8;
    }

    const fechaActual = new Date();
    const fechaFormateada = formatDate(fechaActual);
    const horaFormateada = formatTime(fechaActual);
    doc.text(
      `Fecha de emisión: ${fechaFormateada}${
        horaFormateada ? ` ${horaFormateada}` : ""
      }`,
      margenInicialX,
      posicionY
    );

    posicionY += 6;

    doc.autoTable({
      startY: posicionY,
      head: [["Fecha", "Tipo", "Descripción", "Monto", "Saldo"]],
      body: movimientosParaPdf.map((movimiento) => [
        formatDate(movimiento.fechaMovimiento) || "",
        movimiento.tipo || "",
        movimiento.descripcionNormalizada || "",
        `${movimiento.impacto < 0 ? "-" : "+"} ${formatCurrency(
          movimiento.montoNumerico
        )}`,
        formatCurrency(movimiento.saldoMostrado),
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [33, 150, 243] },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
      },
    });

    const posicionFinalTabla = doc.lastAutoTable.finalY || posicionY;

    doc.setFontSize(12);
    doc.text(
      `Saldo actual: ${formatCurrency(saldoActualMostrado)}`,
      margenInicialX,
      posicionFinalTabla + 10
    );

    doc.save("saldo_cuenta_corriente.pdf");
  }, [
    movimientosParaPdf,
    nombreEntidadPrincipal,
    saldoActualMostrado,
    entidadLabel,
  ]);

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

  const saldoEsPositivo = Number(saldoActualMostrado) >= 0;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <div>
          <h5 className="mb-1">{titulo}</h5>
          <p className="text-muted mb-0">{descripcionMovimientos}</p>
        </div>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-end mt-3 mt-md-0">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm mb-2 mb-sm-0 me-sm-3"
            onClick={handleExportPdf}
          >
            Descargar PDF
          </button>
          <span
            className={`saldo-actual-chip ${
              saldoEsPositivo ? "saldo-positivo" : "saldo-negativo"
            }`}
          >
            Saldo actual: {formatCurrency(saldoActualMostrado)}
          </span>
        </div>
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
            {movimientosPaginados.map((movimiento) => {
              const montoFormateado = formatCurrency(movimiento.montoNumerico);
              const saldoFormateado = formatCurrency(movimiento.saldoMostrado);
              const esPago = movimiento.impacto < 0;

              const saldoNegativo = Number(movimiento.saldoMostrado) < 0;

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
                    {movimiento.nombreEntidad && (
                      <small className="text-muted d-block">
                        {movimiento.nombreEntidad}
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
                  <td
                    className={`align-middle text-right font-weight-semibold ${
                      saldoNegativo ? "text-danger" : "text-primary"
                    }`}
                  >
                    {saldoFormateado}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalMovimientos > pageSize && (
        <div className="card-footer bg-white border-0">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <small className="text-muted mb-2 mb-md-0">
              Mostrando {rangoInicio}-{rangoFin} de {totalMovimientos} movimientos
            </small>
            <div className="btn-group" role="group" aria-label="Paginación de movimientos">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
              >
                Anteriores
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  setPaginaActual((prev) =>
                    prev < totalPaginas ? prev + 1 : prev
                  )
                }
                disabled={paginaActual === totalPaginas}
              >
                Siguientes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuentaCorrienteTable;
