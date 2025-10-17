const express = require("express");
const Cliente = require("../modelos/cliente");
const MovimientoCuentaCorriente = require("../modelos/movimientoCuentaCorriente");
const { verificaToken } = require("../middlewares/autenticacion");
const { obtenerFechaArgentina } = require("../utils/fechas");

const app = express();

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

  let fechaMovimiento;

  if (fecha) {
    const fechaNormalizada = obtenerFechaArgentina(fecha);

    const esFechaSoloDia =
      typeof fecha === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(fecha.trim());

    if (
      fechaNormalizada instanceof Date &&
      !Number.isNaN(fechaNormalizada.getTime()) &&
      esFechaSoloDia
    ) {
      const ahoraArgentina = obtenerFechaArgentina();

      if (
        ahoraArgentina instanceof Date &&
        !Number.isNaN(ahoraArgentina.getTime())
      ) {
        fechaNormalizada.setUTCHours(
          ahoraArgentina.getUTCHours(),
          ahoraArgentina.getUTCMinutes(),
          ahoraArgentina.getUTCSeconds(),
          ahoraArgentina.getUTCMilliseconds()
        );
      }
    }

    fechaMovimiento = fechaNormalizada;
  } else {
    fechaMovimiento = obtenerFechaArgentina();
  }

  if (!(fechaMovimiento instanceof Date) || Number.isNaN(fechaMovimiento.getTime())) {
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

      const obtenerSaldoMovimiento = (movimiento) => {
        const saldoMovimiento =
          movimiento && Object.prototype.hasOwnProperty.call(movimiento, "saldo")
            ? obtenerMontoNumerico(movimiento.saldo, null)
            : null;

        return Number.isFinite(saldoMovimiento) ? saldoMovimiento : null;
      };

      const saldoClienteActual = obtenerMontoNumerico(cliente.saldo, 0);

      let saldoInicial = saldoClienteActual;

      if (impactosMovimiento.length) {
        const primerImpacto = impactosMovimiento[0];
        const saldoPrimerMovimiento = obtenerSaldoMovimiento(
          primerImpacto.movimiento
        );

        if (saldoPrimerMovimiento !== null) {
          saldoInicial = redondearMoneda(
            saldoPrimerMovimiento - primerImpacto.impacto
          );
        } else {
          let totalImpactos = 0;
          impactosMovimiento.forEach(({ impacto }) => {
            totalImpactos = redondearMoneda(totalImpactos + impacto);
          });

          saldoInicial = redondearMoneda(saldoClienteActual - totalImpactos);
        }
      }

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

      let saldoFinal = saldoClienteActual;

      if (movimientosConSaldo.length) {
        saldoFinal = movimientosConSaldo[movimientosConSaldo.length - 1].saldo;
      } else {
        saldoFinal = redondearMoneda(saldoInicial);
      }

      res.json({
        ok: true,
        saldo: saldoFinal,
        movimientos: movimientosConSaldo,
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
