const express = require("express");
const Cliente = require("../modelos/cliente");
const MovimientoCuentaCorriente = require("../modelos/movimientoCuenta");

const { verificaToken } = require("../middlewares/autenticacion");

const app = express();

const esRolAdministrativo = (role) =>
  role === "ADMIN_ROLE" || role === "ADMIN_SUP";

// Registra un pago manual en la cuenta corriente de un cliente.
app.post("/cuentacorriente/pago", verificaToken, async (req, res) => {
  if (!esRolAdministrativo(req.usuario.role)) {
    return res.status(403).json({
      ok: false,
      err: {
        message: "El usuario no posee permisos para registrar pagos",
      },
    });
  }

  const { clienteId, monto, descripcion, fecha } = req.body;

  if (!clienteId) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "El identificador del cliente es obligatorio",
      },
    });
  }

  const montoNumerico = Number(monto);
  if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "El monto del pago debe ser un número mayor a cero",
      },
    });
  }

  const fechaMovimiento = fecha ? new Date(fecha) : new Date();
  if (Number.isNaN(fechaMovimiento.getTime())) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "La fecha indicada no es válida",
      },
    });
  }

  try {
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "Cliente no encontrado",
        },
      });
    }

    cliente.saldo = (cliente.saldo || 0) - montoNumerico;
    await cliente.save();

    const movimiento = await MovimientoCuentaCorriente.create({
      cliente: cliente._id,
      tipo: "Pago",
      descripcion: descripcion || "Pago registrado",
      fecha: fechaMovimiento,
      monto: Math.abs(montoNumerico),
      saldo: cliente.saldo,
    });

    res.json({
      ok: true,
      saldo: cliente.saldo,
      movimiento,
    });
  } catch (error) {
    console.error("Error al registrar pago de cuenta corriente", error);
    res.status(500).json({
      ok: false,
      err: {
        message: "Ocurrió un error al registrar el pago",
      },
    });
  }
});

// Obtiene los movimientos de cuenta corriente de un cliente ordenados por fecha.
app.get("/cuentacorriente/:clienteId", verificaToken, async (req, res) => {
  if (!esRolAdministrativo(req.usuario.role)) {
    return res.status(403).json({
      ok: false,
      err: {
        message: "El usuario no posee permisos para consultar la cuenta corriente",
      },
    });
  }

  const { clienteId } = req.params;
  if (!clienteId) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "El identificador del cliente es obligatorio",
      },
    });
  }

  try {
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "Cliente no encontrado",
        },
      });
    }

    const movimientos = await MovimientoCuentaCorriente.find({
      cliente: clienteId,
    })
      .sort({ fecha: 1, createdAt: 1 })
      .populate({ path: "comanda", select: "nrodecomanda fecha" });

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
    console.error("Error al obtener cuenta corriente", error);
    res.status(500).json({
      ok: false,
      err: {
        message: "Ocurrió un error al obtener la cuenta corriente",
      },
    });
  }
});

module.exports = app;
