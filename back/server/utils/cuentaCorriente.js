const redondearMoneda = (valor) => {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return 0;
  }

  const redondeado = Number(numero.toFixed(2));
  return Object.is(redondeado, -0) ? 0 : redondeado;
};

const obtenerMontoNumerico = (valor, defecto = 0) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : defecto;
};

const calcularImpactoSaldo = (movimiento = {}) => {
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

const normalizarMovimiento = (movimiento) =>
  movimiento && typeof movimiento === "object" ? { ...movimiento } : {};

const obtenerSaldoMovimiento = (movimiento) => {
  const movimientoNormalizado = normalizarMovimiento(movimiento);
  const saldoMovimiento = Object.prototype.hasOwnProperty.call(
    movimientoNormalizado,
    "saldo"
  )
    ? obtenerMontoNumerico(movimientoNormalizado.saldo, null)
    : null;

  return Number.isFinite(saldoMovimiento) ? saldoMovimiento : null;
};

const agruparVentasPorComanda = (movimientos = []) => {
  const ventasAgrupadas = new Map();

  movimientos.forEach((movimiento) => {
    const movimientoNormalizado = normalizarMovimiento(movimiento);
    const comanda =
      movimientoNormalizado && typeof movimientoNormalizado.comanda === "object"
        ? movimientoNormalizado.comanda
        : null;

    if (
      movimientoNormalizado.tipo === "Venta" &&
      comanda &&
      comanda.nrodecomanda !== undefined &&
      comanda.nrodecomanda !== null
    ) {
      const nrodecomanda = comanda.nrodecomanda;
      const clienteMovimientoId =
        movimientoNormalizado.cliente !== undefined &&
        movimientoNormalizado.cliente !== null
          ? String(movimientoNormalizado.cliente)
          : "";
      const cantidadRegistrada = obtenerMontoNumerico(comanda.cantidad, 0);
      const cantidad = cantidadRegistrada > 0 ? cantidadRegistrada : 1;
      const montoUnitarioRegistrado = obtenerMontoNumerico(comanda.monto, 0);
      let montoUnitario = montoUnitarioRegistrado;
      const montoMovimiento = obtenerMontoNumerico(
        movimientoNormalizado.monto,
        0
      );
      let subtotal = cantidad * montoUnitario;

      if (!Number.isFinite(subtotal) || (subtotal === 0 && montoMovimiento)) {
        subtotal = montoMovimiento;
        if (cantidad > 0 && montoMovimiento) {
          montoUnitario = subtotal / cantidad;
        }
      }

      if (!ventasAgrupadas.has(nrodecomanda)) {
        const clienteComanda =
          comanda.codcli && typeof comanda.codcli === "object"
            ? { ...comanda.codcli }
            : null;

        ventasAgrupadas.set(nrodecomanda, {
          _id: `comanda-${clienteMovimientoId}-${nrodecomanda}`,
          cliente: clienteComanda,
          clienteId: movimientoNormalizado.cliente,
          tipo: movimientoNormalizado.tipo,
          descripcion:
            movimientoNormalizado.descripcion || `Comanda #${nrodecomanda}`,
          fecha: movimientoNormalizado.fecha,
          saldo: movimientoNormalizado.saldo,
          monto: 0,
          nrodecomanda,
          comanda: {
            nrodecomanda,
            detalles: [],
          },
        });
      }

      const ventaAgrupada = ventasAgrupadas.get(nrodecomanda);

      ventaAgrupada.monto = obtenerMontoNumerico(ventaAgrupada.monto, 0);
      ventaAgrupada.monto += subtotal;
      ventaAgrupada.saldo = movimientoNormalizado.saldo;
      if (
        !ventaAgrupada.fecha ||
        new Date(movimientoNormalizado.fecha) < new Date(ventaAgrupada.fecha)
      ) {
        ventaAgrupada.fecha = movimientoNormalizado.fecha;
      }

      const detalle = {
        cantidad,
        montoUnitario,
        subtotal,
      };

      if (comanda._id) {
        detalle.comandaId = comanda._id;
      }

      ventaAgrupada.comanda.detalles.push(detalle);
    }
  });

  return ventasAgrupadas;
};

const construirMovimientosAgrupados = (movimientos = [], ventasAgrupadas) => {
  const movimientosAgrupados = [];
  const comandasIncluidas = new Set();

  movimientos.forEach((movimiento) => {
    const movimientoNormalizado = normalizarMovimiento(movimiento);
    const comanda =
      movimientoNormalizado && typeof movimientoNormalizado.comanda === "object"
        ? movimientoNormalizado.comanda
        : null;

    if (
      movimientoNormalizado.tipo === "Venta" &&
      comanda &&
      comanda.nrodecomanda !== undefined &&
      comanda.nrodecomanda !== null
    ) {
      const nrodecomanda = comanda.nrodecomanda;
      if (!comandasIncluidas.has(nrodecomanda)) {
        const ventaAgrupada = ventasAgrupadas.get(nrodecomanda);
        movimientosAgrupados.push(ventaAgrupada || movimientoNormalizado);
        comandasIncluidas.add(nrodecomanda);
      }
    } else {
      movimientosAgrupados.push(movimientoNormalizado);
    }
  });

  return movimientosAgrupados;
};

const calcularCuentaCorrienteCliente = ({ cliente = {}, movimientos = [] }) => {
  const movimientosOrdenados = Array.isArray(movimientos)
    ? [...movimientos]
    : [];

  const ventasAgrupadas = agruparVentasPorComanda(movimientosOrdenados);
  const movimientosAgrupados = construirMovimientosAgrupados(
    movimientosOrdenados,
    ventasAgrupadas
  );

  const impactosMovimiento = movimientosAgrupados.map((movimiento) => {
    const movimientoNormalizado = normalizarMovimiento(movimiento);
    const monto = obtenerMontoNumerico(movimientoNormalizado.monto, 0);
    const impacto = calcularImpactoSaldo({ ...movimientoNormalizado, monto });

    return {
      movimiento: movimientoNormalizado,
      monto,
      impacto,
    };
  });

  let totalImpactos = 0;
  impactosMovimiento.forEach(({ impacto }) => {
    totalImpactos = redondearMoneda(totalImpactos + impacto);
  });

  const saldoClienteActual = obtenerMontoNumerico(cliente.saldo, 0);
  const saldoInicialConfigurado = obtenerMontoNumerico(
    cliente.saldoInicial,
    null
  );

  let saldoInicial = Number.isFinite(saldoInicialConfigurado)
    ? redondearMoneda(saldoInicialConfigurado)
    : null;

  if (saldoInicial === null) {
    if (impactosMovimiento.length) {
      const primerImpacto = impactosMovimiento[0];
      const saldoPrimerMovimiento = obtenerSaldoMovimiento(primerImpacto.movimiento);

      if (saldoPrimerMovimiento !== null) {
        saldoInicial = redondearMoneda(
          saldoPrimerMovimiento - primerImpacto.impacto
        );
      } else {
        saldoInicial = redondearMoneda(saldoClienteActual - totalImpactos);
      }
    } else {
      saldoInicial = redondearMoneda(saldoClienteActual);
    }
  }

  if (!Number.isFinite(saldoInicial)) {
    saldoInicial = 0;
  }

  let saldoAcumulado = saldoInicial;
  const movimientosCalculados = impactosMovimiento.map(
    ({ movimiento, impacto, monto }) => {
      saldoAcumulado = redondearMoneda(saldoAcumulado + impacto);

      return {
        ...movimiento,
        monto,
        saldo: saldoAcumulado,
      };
    }
  );

  const saldoFinalCalculado = movimientosCalculados.length
    ? movimientosCalculados[movimientosCalculados.length - 1].saldo
    : redondearMoneda(saldoInicial);

  const incluirSaldoInicial = saldoInicial !== 0;
  const movimientosConSaldo = incluirSaldoInicial
    ? [
        {
          _id: `saldo-inicial-${cliente._id || "desconocido"}`,
          cliente: cliente._id,
          tipo: "Saldo inicial",
          descripcion: "Saldo inicial",
          fecha: movimientosAgrupados.length
            ? movimientosAgrupados[0].fecha || null
            : null,
          createdAt: movimientosAgrupados.length
            ? movimientosAgrupados[0].createdAt || null
            : null,
          updatedAt: movimientosAgrupados.length
            ? movimientosAgrupados[0].updatedAt || null
            : null,
          monto: 0,
          saldo: saldoInicial,
          esSaldoInicial: true,
        },
        ...movimientosCalculados,
      ]
    : movimientosCalculados;

  return {
    movimientos: movimientosConSaldo,
    saldo: redondearMoneda(saldoFinalCalculado),
    saldoInicial,
  };
};

module.exports = {
  agruparVentasPorComanda,
  calcularCuentaCorrienteCliente,
  calcularImpactoSaldo,
  obtenerMontoNumerico,
  redondearMoneda,
};
