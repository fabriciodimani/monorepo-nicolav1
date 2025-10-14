const express = require("express");
const Cliente = require("../modelos/cliente");
const MovimientoCuentaCorriente = require("../modelos/movimientoCuentaCorriente");
const { verificaToken } = require("../middlewares/autenticacion");

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

  const fechaMovimiento = fecha ? new Date(fecha) : new Date();

  if (Number.isNaN(fechaMovimiento.getTime())) {
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
        .populate({ path: "comanda", select: "nrodecomanda fecha" })
        .lean();

      const ventasAgrupadas = new Map();
      const movimientosProcesados = [];

      const obtenerTiempo = (valor) => {
        if (!valor) {
          return 0;
        }

        const fecha = new Date(valor);
        const tiempo = fecha.getTime();

        return Number.isNaN(tiempo) ? 0 : tiempo;
      };

      movimientos.forEach((movimiento) => {
        const monto = Number(movimiento.monto) || 0;
        const saldo = Number(movimiento.saldo) || 0;
        const numeroComanda = movimiento.comanda?.nrodecomanda;

        if (
          movimiento.tipo === "Venta" &&
          numeroComanda !== undefined &&
          numeroComanda !== null
        ) {
          const clave = `venta-${numeroComanda}`;
          const existente = ventasAgrupadas.get(clave);

          if (!existente) {
            ventasAgrupadas.set(clave, {
              ...movimiento,
              monto,
              saldo,
              descripcion:
                movimiento.descripcion || `Comanda #${numeroComanda}`,
              numeroComanda,
            });
          } else {
            existente.monto += monto;
            existente.saldo = saldo;

            if (movimiento.descripcion) {
              existente.descripcion = movimiento.descripcion;
            }

            const fechaMovimiento = obtenerTiempo(movimiento.fecha);
            const fechaExistente = obtenerTiempo(existente.fecha);

            if (fechaMovimiento >= fechaExistente) {
              existente.fecha = movimiento.fecha;
            }

            const creadoMovimiento = obtenerTiempo(movimiento.createdAt);
            const creadoExistente = obtenerTiempo(existente.createdAt);

            if (creadoMovimiento >= creadoExistente) {
              existente.createdAt = movimiento.createdAt;
              existente._id = movimiento._id;
              existente.comanda = movimiento.comanda;
            }

            const actualizadoMovimiento = obtenerTiempo(movimiento.updatedAt);
            const actualizadoExistente = obtenerTiempo(existente.updatedAt);

            if (actualizadoMovimiento >= actualizadoExistente) {
              existente.updatedAt = movimiento.updatedAt;
            }
          }
        } else {
          movimientosProcesados.push(movimiento);
        }
      });

      const movimientosAgrupados = [
        ...movimientosProcesados,
        ...Array.from(ventasAgrupadas.values()).map((movimiento) => {
          const { numeroComanda, ...restoMovimiento } = movimiento;
          return restoMovimiento;
        }),
      ].sort((a, b) => {
        const fechaA = obtenerTiempo(a.fecha);
        const fechaB = obtenerTiempo(b.fecha);

        if (fechaA !== fechaB) {
          return fechaA - fechaB;
        }

        const creadoA = obtenerTiempo(a.createdAt);
        const creadoB = obtenerTiempo(b.createdAt);

        return creadoA - creadoB;
      });

      res.json({
        ok: true,
        saldo: cliente.saldo || 0,
        movimientos: movimientosAgrupados,
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
