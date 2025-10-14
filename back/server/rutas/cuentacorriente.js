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
        .populate({
          path: "comanda",
          select: "nrodecomanda fecha lista",
          options: { lean: true },
        })
        .lean();

      const movimientosAgrupados = [];
      const comandasAgrupadas = new Map();

      movimientos.forEach((movimiento) => {
        const esVentaConComanda =
          movimiento.tipo === "Venta" && movimiento.comanda;

        if (!esVentaConComanda) {
          movimientosAgrupados.push(movimiento);
          return;
        }

        const numeroComanda =
          movimiento.comanda?.nrodecomanda != null
            ? movimiento.comanda.nrodecomanda.toString()
            : movimiento.comanda?._id?.toString() || movimiento._id.toString();

        let movimientoAgrupado = comandasAgrupadas.get(numeroComanda);

        if (!movimientoAgrupado) {
          movimientoAgrupado = {
            ...movimiento,
            monto: Number(movimiento.monto) || 0,
            numeroComanda: movimiento.comanda?.nrodecomanda || null,
          };

          if (movimiento.comanda?.fecha) {
            movimientoAgrupado.fecha = movimiento.comanda.fecha;
          }

          comandasAgrupadas.set(numeroComanda, movimientoAgrupado);
          movimientosAgrupados.push(movimientoAgrupado);
          return;
        }

        movimientoAgrupado.monto =
          (Number(movimientoAgrupado.monto) || 0) +
          (Number(movimiento.monto) || 0);
        movimientoAgrupado.saldo = movimiento.saldo;

        const fechaMovimiento = movimiento.fecha
          ? new Date(movimiento.fecha)
          : null;
        const fechaAgrupada = movimientoAgrupado.fecha
          ? new Date(movimientoAgrupado.fecha)
          : null;

        if (
          fechaMovimiento &&
          (!fechaAgrupada || fechaMovimiento > fechaAgrupada)
        ) {
          movimientoAgrupado.fecha = movimiento.fecha;
        }
      });

      movimientosAgrupados.sort((a, b) => {
        const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;

        if (fechaA !== fechaB) {
          return fechaA - fechaB;
        }

        const creadoA = a.createdAt ? new Date(a.createdAt).getTime() : fechaA;
        const creadoB = b.createdAt ? new Date(b.createdAt).getTime() : fechaB;

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
