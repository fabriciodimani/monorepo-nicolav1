const express = require("express");
const Cliente = require("../modelos/cliente");
const MovimientoCuentaCorriente = require("../modelos/movimientocuentacorriente");
const { verificaToken } = require("../middlewares/autenticacion");

const app = express();

// Permite el acceso únicamente a perfiles administrativos
const allowCuentaCorriente = (role = "") =>
  ["ADMIN_ROLE", "ADMIN_SUP"].includes(role);

// Endpoint para registrar pagos y actualizar el saldo del cliente
app.post("/cuentacorriente/pago", verificaToken, async (req, res) => {
  try {
    if (!allowCuentaCorriente(req.usuario.role)) {
      return res.status(403).json({
        ok: false,
        err: { message: "No tiene permisos para registrar pagos" },
      });
    }

    const { clienteId, monto, descripcion, fecha } = req.body;

    if (!clienteId) {
      return res.status(400).json({
        ok: false,
        err: { message: "El cliente es obligatorio" },
      });
    }

    const montoNumber = monto !== undefined ? Number(monto) : NaN;

    if (Number.isNaN(montoNumber) || montoNumber <= 0) {
      return res.status(400).json({
        ok: false,
        err: { message: "El monto debe ser un número mayor a cero" },
      });
    }

    const cliente = await Cliente.findById(clienteId);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        err: { message: "Cliente no encontrado" },
      });
    }

    const fechaMovimiento = fecha ? new Date(fecha) : new Date();

    if (Number.isNaN(fechaMovimiento.getTime())) {
      return res.status(400).json({
        ok: false,
        err: { message: "La fecha indicada no es válida" },
      });
    }

    cliente.saldo = (cliente.saldo || 0) - montoNumber;
    await cliente.save();

    const movimiento = await MovimientoCuentaCorriente.create({
      cliente: cliente._id,
      tipo: "Pago",
      descripcion: descripcion || "Pago registrado",
      fecha: fechaMovimiento,
      monto: montoNumber,
      saldo: cliente.saldo,
    });

    res.json({
      ok: true,
      saldo: cliente.saldo,
      movimiento,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      err: {
        message: "Error al registrar el pago",
        detalle: error.message,
      },
    });
  }
});

// Endpoint para obtener el historial completo de movimientos de un cliente
app.get("/cuentacorriente/:clienteId", verificaToken, async (req, res) => {
  try {
    if (!allowCuentaCorriente(req.usuario.role)) {
      return res.status(403).json({
        ok: false,
        err: { message: "No tiene permisos para consultar la cuenta corriente" },
      });
    }

    const { clienteId } = req.params;

    const cliente = await Cliente.findById(clienteId);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        err: { message: "Cliente no encontrado" },
      });
    }

    const movimientos = await MovimientoCuentaCorriente.find({ cliente: clienteId })
      .sort({ fecha: 1, createdAt: 1 })
      .lean();

    res.json({
      ok: true,
      cliente: {
        _id: cliente._id,
        razonsocial: cliente.razonsocial,
        saldo: cliente.saldo,
      },
      movimientos,
      saldo: cliente.saldo,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      err: {
        message: "Error al obtener la cuenta corriente",
        detalle: error.message,
      },
    });
  }
});

module.exports = app;
