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
        .lean();

      res.json({
        ok: true,
        saldo: cliente.saldo || 0,
        movimientos,
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
