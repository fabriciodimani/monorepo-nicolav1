const express = require("express");
const Cliente = require("../modelos/cliente");
const MovimientoCuentaCorriente = require("../modelos/movimientoCuentaCorriente");
const { verificaToken } = require("../middlewares/autenticacion");

const app = express();

const FORMATO_FECHA_SIMPLE = /^(\d{4})-(\d{2})-(\d{2})$/;
const HUSO_HORARIO_ARGENTINA = "-03:00";

const esFechaValida = (valor) =>
  valor instanceof Date && !Number.isNaN(valor.getTime());

const normalizarFechaMovimiento = (valor) => {
  if (!valor && valor !== 0) {
    return null;
  }

  if (esFechaValida(valor)) {
    return valor;
  }

  if (typeof valor === "number" && Number.isFinite(valor)) {
    const fechaDesdeNumero = new Date(valor);
    return esFechaValida(fechaDesdeNumero) ? fechaDesdeNumero : null;
  }

  if (typeof valor === "string") {
    const fechaLimpia = valor.trim();

    if (!fechaLimpia) {
      return null;
    }

    const coincidencia = FORMATO_FECHA_SIMPLE.exec(fechaLimpia);

    if (coincidencia) {
      const [, anio, mes, dia] = coincidencia;
      const fechaArgentina = new Date(
        `${anio}-${mes}-${dia}T00:00:00${HUSO_HORARIO_ARGENTINA}`
      );

      if (esFechaValida(fechaArgentina)) {
        return fechaArgentina;
      }
    }

    const fechaDesdeCadena = new Date(fechaLimpia);
    return esFechaValida(fechaDesdeCadena) ? fechaDesdeCadena : null;
  }

  return null;
};

const obtenerValorTemporal = (valor) => {
  if (!valor) {
    return 0;
  }

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? 0 : fecha.getTime();
};

const ordenarPorFechaDesc = (a, b) => {
  const fechaB = obtenerValorTemporal(b.fecha);
  const fechaA = obtenerValorTemporal(a.fecha);

  if (fechaB !== fechaA) {
    return fechaB - fechaA;
  }

  const creadoB = obtenerValorTemporal(b.createdAt);
  const creadoA = obtenerValorTemporal(a.createdAt);

  if (creadoB !== creadoA) {
    return creadoB - creadoA;
  }

  const idA = a && a._id ? a._id.toString() : "";
  const idB = b && b._id ? b._id.toString() : "";

  return idB.localeCompare(idA);
};

// Determina si el usuario posee permisos administrativos.
const esRolAdministrativo = (usuario = {}) =>
  usuario.role === "ADMIN_ROLE" || usuario.role === "ADMIN_SUP";

// Registra un pago realizado por un cliente y descuenta el saldo correspondiente.
app.post("/cuentacorriente/pago", [verificaToken], async (req, res) => {
  if (!esRolAdministrativo(req.usuario)) {
    return res.status(403).json({
      ok: false,
      err: { message: "No tiene permisos para registrar pagos" },
    });
  }

  const { clienteId, monto, descripcion = "", fecha } = req.body;

  if (!clienteId) {
    return res.status(400).json({
      ok: false,
      err: { message: "El cliente es obligatorio" },
    });
  }

  const montoNumerico = Number(monto);

  if (Number.isNaN(montoNumerico) || montoNumerico <= 0) {
    return res.status(400).json({
      ok: false,
      err: { message: "El monto debe ser un número mayor a cero" },
    });
  }

  const fechaMovimiento = fecha
    ? normalizarFechaMovimiento(fecha)
    : new Date();

  if (!esFechaValida(fechaMovimiento)) {
    return res.status(400).json({
      ok: false,
      err: { message: "La fecha del pago no es válida" },
    });
  }

  try {
    const cliente = await Cliente.findById(clienteId);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        err: { message: "Cliente no encontrado" },
      });
    }

    cliente.saldo = (cliente.saldo || 0) - montoNumerico;
    await cliente.save();

    const movimiento = new MovimientoCuentaCorriente({
      cliente: cliente._id,
      tipo: "Pago",
      descripcion,
      fecha: fechaMovimiento,
      monto: montoNumerico,
      saldo: cliente.saldo,
    });

    await movimiento.save();

    res.json({
      ok: true,
      saldo: cliente.saldo,
      movimiento,
    });
  } catch (error) {
    console.error("POST /cuentacorriente/pago", error);
    res.status(500).json({
      ok: false,
      err: {
        message: "Error al registrar el pago",
        detalle: error.message,
      },
    });
  }
});

// Devuelve el historial de movimientos de la cuenta corriente de un cliente.
app.get(
  "/cuentacorriente/:clienteId",
  [verificaToken],
  async (req, res) => {
    if (!esRolAdministrativo(req.usuario)) {
      return res.status(403).json({
        ok: false,
        err: { message: "No tiene permisos para consultar la cuenta" },
      });
    }

    const { clienteId } = req.params;

    try {
      const cliente = await Cliente.findById(clienteId);

      if (!cliente) {
        return res.status(404).json({
          ok: false,
          err: { message: "Cliente no encontrado" },
        });
      }

      const movimientos = await MovimientoCuentaCorriente.find({
        cliente: clienteId,
      })
        .sort({ fecha: 1, createdAt: 1 })
        .populate({
          path: "comanda",
          select: "nrodecomanda cantidad monto codcli",
          populate: {
            path: "codcli",
            select: "razonsocial nombre apellido",
          },
        })
        .lean();

      const ventasAgrupadas = new Map();

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

      movimientos.forEach((movimiento) => {
        const comanda =
          movimiento && typeof movimiento.comanda === "object"
            ? movimiento.comanda
            : null;

        if (
          movimiento.tipo === "Venta" &&
          comanda &&
          comanda.nrodecomanda !== undefined &&
          comanda.nrodecomanda !== null
        ) {
          const nrodecomanda = comanda.nrodecomanda;
          const clienteMovimientoId =
            movimiento.cliente !== undefined && movimiento.cliente !== null
              ? String(movimiento.cliente)
              : "";
          const cantidadRegistrada = obtenerMontoNumerico(comanda.cantidad, 0);
          const cantidad = cantidadRegistrada > 0 ? cantidadRegistrada : 1;
          const montoUnitarioRegistrado = obtenerMontoNumerico(
            comanda.monto,
            0
          );
          let montoUnitario = montoUnitarioRegistrado;
          const montoMovimiento = obtenerMontoNumerico(movimiento.monto, 0);
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
              clienteId: movimiento.cliente,
              tipo: movimiento.tipo,
              descripcion:
                movimiento.descripcion || `Comanda #${nrodecomanda}`,
              fecha: movimiento.fecha,
              saldo: movimiento.saldo,
              monto: 0,
              nrodecomanda,
              comanda: {
                nrodecomanda,
                detalles: [],
              },
            });
          }

          const ventaAgrupada = ventasAgrupadas.get(nrodecomanda);

          ventaAgrupada.monto = obtenerMontoNumerico(
            ventaAgrupada.monto,
            0
          );
          ventaAgrupada.monto += subtotal;
          ventaAgrupada.saldo = movimiento.saldo;
          if (
            !ventaAgrupada.fecha ||
            new Date(movimiento.fecha) < new Date(ventaAgrupada.fecha)
          ) {
            ventaAgrupada.fecha = movimiento.fecha;
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

      const movimientosAgrupados = [];
      const comandasIncluidas = new Set();

      movimientos.forEach((movimiento) => {
        const comanda =
          movimiento && typeof movimiento.comanda === "object"
            ? movimiento.comanda
            : null;

        if (
          movimiento.tipo === "Venta" &&
          comanda &&
          comanda.nrodecomanda !== undefined &&
          comanda.nrodecomanda !== null
        ) {
          const nrodecomanda = comanda.nrodecomanda;
          if (!comandasIncluidas.has(nrodecomanda)) {
            const ventaAgrupada = ventasAgrupadas.get(nrodecomanda);
            movimientosAgrupados.push(ventaAgrupada || movimiento);
            comandasIncluidas.add(nrodecomanda);
          }
        } else {
          movimientosAgrupados.push(movimiento);
        }
      });

      const impactosMovimiento = movimientosAgrupados.map((movimiento) => {
        const monto = obtenerMontoNumerico(movimiento.monto, 0);
        const impacto = calcularImpactoSaldo({ ...movimiento, monto });

        return {
          movimiento,
          monto,
          impacto,
        };
      });

      let totalImpactos = 0;
      impactosMovimiento.forEach(({ impacto }) => {
        totalImpactos = redondearMoneda(totalImpactos + impacto);
      });

      const saldoClienteActual = obtenerMontoNumerico(cliente.saldo, 0);
      const saldoInicial = redondearMoneda(saldoClienteActual - totalImpactos);

      let saldoAcumulado = saldoInicial;
      const movimientosConSaldo = impactosMovimiento.map(
        ({ movimiento, impacto, monto }) => {
          saldoAcumulado = redondearMoneda(saldoAcumulado + impacto);

          return {
            ...movimiento,
            monto,
            saldo: saldoAcumulado,
          };
        }
      );

      const saldoFinal = movimientosConSaldo.length
        ? movimientosConSaldo[movimientosConSaldo.length - 1].saldo
        : saldoClienteActual;

      const movimientosOrdenados = [...movimientosConSaldo].sort(
        ordenarPorFechaDesc
      );

      res.json({
        ok: true,
        saldo: saldoFinal,
        movimientos: movimientosOrdenados,
      });
    } catch (error) {
      console.error("GET /cuentacorriente/:clienteId", error);
      res.status(500).json({
        ok: false,
        err: {
          message: "Error al obtener los movimientos",
          detalle: error.message,
        },
      });
    }
  }
);

module.exports = app;
