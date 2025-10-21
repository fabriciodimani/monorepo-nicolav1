const express = require("express");
const Proveedor = require("../modelos/proveedor");
const MovimientoCuentaCorrienteProveedor = require("../modelos/movimientoCuentaCorrienteProveedor");
const { verificaToken } = require("../middlewares/autenticacion");
const { obtenerFechaArgentina } = require("../utils/fechas");

const app = express();

const esRolAdministrativo = (usuario = {}) =>
  usuario.role === "ADMIN_ROLE" || usuario.role === "ADMIN_SUP";

const normalizarFechaMovimiento = (fecha) => {
  if (!fecha) {
    return obtenerFechaArgentina();
  }

  const fechaNormalizada = obtenerFechaArgentina(fecha);

  const esFechaSoloDia =
    typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fecha.trim());

  if (
    fechaNormalizada instanceof Date &&
    !Number.isNaN(fechaNormalizada.getTime()) &&
    esFechaSoloDia
  ) {
    const ahoraArgentina = obtenerFechaArgentina();

    if (ahoraArgentina instanceof Date && !Number.isNaN(ahoraArgentina.getTime())) {
      fechaNormalizada.setUTCHours(
        ahoraArgentina.getUTCHours(),
        ahoraArgentina.getUTCMinutes(),
        ahoraArgentina.getUTCSeconds(),
        ahoraArgentina.getUTCMilliseconds()
      );
    }
  }

  if (
    fechaNormalizada instanceof Date &&
    !Number.isNaN(fechaNormalizada.getTime())
  ) {
    return fechaNormalizada;
  }

  return obtenerFechaArgentina();
};

app.post(
  "/cuentacorrienteproveedores/pago",
  [verificaToken],
  async (req, res) => {
    if (!esRolAdministrativo(req.usuario)) {
      return res.status(403).json({
        ok: false,
        err: { message: "No tiene permisos para registrar pagos" },
      });
    }

    const { proveedorId, monto, descripcion = "", fecha } = req.body;

    if (!proveedorId) {
      return res.status(400).json({
        ok: false,
        err: { message: "El proveedor es obligatorio" },
      });
    }

    const montoNumerico = Number(monto);

    if (Number.isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({
        ok: false,
        err: { message: "El monto debe ser un número mayor a cero" },
      });
    }

    const fechaMovimiento = normalizarFechaMovimiento(fecha);

    try {
      const proveedor = await Proveedor.findById(proveedorId);

      if (!proveedor) {
        return res.status(404).json({
          ok: false,
          err: { message: "Proveedor no encontrado" },
        });
      }

      proveedor.saldo = (proveedor.saldo || 0) - montoNumerico;
      await proveedor.save();

      const movimiento = new MovimientoCuentaCorrienteProveedor({
        proveedor: proveedor._id,
        tipo: "Pago",
        descripcion,
        fecha: fechaMovimiento,
        monto: montoNumerico,
        saldo: proveedor.saldo,
      });

      await movimiento.save();

      res.json({
        ok: true,
        saldo: proveedor.saldo,
        movimiento,
      });
    } catch (error) {
      console.error("POST /cuentacorrienteproveedores/pago", error);
      res.status(500).json({
        ok: false,
        err: {
          message: "Error al registrar el pago",
          detalle: error.message,
        },
      });
    }
  }
);

app.get(
  "/cuentacorrienteproveedores/:proveedorId",
  [verificaToken],
  async (req, res) => {
    if (!esRolAdministrativo(req.usuario)) {
      return res.status(403).json({
        ok: false,
        err: { message: "No tiene permisos para consultar la cuenta" },
      });
    }

    const { proveedorId } = req.params;

    try {
      const proveedor = await Proveedor.findById(proveedorId).lean();

      if (!proveedor) {
        return res.status(404).json({
          ok: false,
          err: { message: "Proveedor no encontrado" },
        });
      }

      const movimientos = await MovimientoCuentaCorrienteProveedor.find({
        proveedor: proveedorId,
      })
        .sort({ fecha: 1, createdAt: 1 })
        .populate({
          path: "facturaCompra",
          select: "numero fecha monto",
        })
        .populate({
          path: "proveedor",
          select: "razonsocial nombre apellido",
        })
        .lean();

      res.json({
        ok: true,
        proveedor,
        movimientos,
        saldo: proveedor.saldo || 0,
      });
    } catch (error) {
      console.error("GET /cuentacorrienteproveedores/:proveedorId", error);
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
