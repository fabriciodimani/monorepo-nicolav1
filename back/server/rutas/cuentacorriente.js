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

      const movimientosAgrupados = [];
      const indiceComandas = new Map();

      movimientos.forEach((movimiento) => {
        const esVenta = movimiento.tipo === "Venta";
        const comanda = movimiento.comanda;
        const numeroComanda =
          comanda && comanda.nrodecomanda !== undefined && comanda.nrodecomanda !== null
            ? comanda.nrodecomanda
            : null;

        if (esVenta && numeroComanda !== null) {
          const clave = numeroComanda.toString();
          if (indiceComandas.has(clave)) {
            const indice = indiceComandas.get(clave);
            const movimientoExistente = movimientosAgrupados[indice];
            const montoExistente = Number(movimientoExistente.monto) || 0;
            const montoActual = Number(movimiento.monto) || 0;

            movimientoExistente.monto = montoExistente + montoActual;
            movimientoExistente.saldo = movimiento.saldo;

            const fechaActual = movimiento.fecha
              ? new Date(movimiento.fecha).getTime()
              : null;
            const fechaExistente = movimientoExistente.fecha
              ? new Date(movimientoExistente.fecha).getTime()
              : null;

            if (fechaActual && (!fechaExistente || fechaActual > fechaExistente)) {
              movimientoExistente.fecha = movimiento.fecha;
            }

            return;
          }

          const montoActual = Number(movimiento.monto) || 0;
          const descripcionBase = movimiento.descripcion || "";
          const descripcionComanda =
            descripcionBase.trim().length > 0
              ? descripcionBase
              : `Comanda #${numeroComanda}`;

          movimientosAgrupados.push({
            ...movimiento,
            monto: montoActual,
            descripcion: descripcionComanda,
          });
          indiceComandas.set(clave, movimientosAgrupados.length - 1);
          return;
        }

        movimientosAgrupados.push(movimiento);
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
