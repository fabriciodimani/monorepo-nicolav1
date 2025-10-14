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

      const movimientosDB = await MovimientoCuentaCorriente.find({
        cliente: clienteId,
      })
        .sort({ fecha: 1, createdAt: 1 })
        .populate({
          path: "comanda",
          select: "nrodecomanda fecha lista codprod cantidad monto",
        })
        .lean();

      const agrupados = [];
      const ventasPorComanda = new Map();

      movimientosDB.forEach((movimiento, index) => {
        const {
          tipo,
          comanda,
          descripcion,
          monto,
          fecha,
          saldo: saldoMovimiento,
          createdAt,
          updatedAt,
        } = movimiento;

        const numeroComanda = comanda?.nrodecomanda;
        const esVentaAgrupable =
          tipo === "Venta" && numeroComanda !== undefined && numeroComanda !== null;

        if (!esVentaAgrupable) {
          agrupados.push(movimiento);
          return;
        }

        const claveComanda = `${numeroComanda}`;
        let ventaAgrupada = ventasPorComanda.get(claveComanda);

        if (!ventaAgrupada) {
          ventaAgrupada = {
            _id: `comanda-${claveComanda}`,
            tipo,
            descripcion: descripcion || `Comanda #${numeroComanda}`,
            monto: 0,
            fecha,
            saldo: saldoMovimiento,
            numeroComanda,
            comanda,
            createdAt,
            updatedAt,
            __orden: index,
          };
          ventasPorComanda.set(claveComanda, ventaAgrupada);
          agrupados.push(ventaAgrupada);
        }

        const montoNumerico = Number(monto) || 0;
        ventaAgrupada.monto += montoNumerico;

        if (descripcion) {
          const descripcionPlaceholder = `Comanda #${numeroComanda}`;
          if (
            !ventaAgrupada.descripcion ||
            ventaAgrupada.descripcion === descripcionPlaceholder
          ) {
            ventaAgrupada.descripcion = descripcion;
          }
        }

        const fechaActual = fecha ? new Date(fecha) : null;
        const fechaAgrupada = ventaAgrupada.fecha ? new Date(ventaAgrupada.fecha) : null;

        if (!fechaAgrupada || (fechaActual && fechaActual >= fechaAgrupada)) {
          ventaAgrupada.fecha = fecha;
          ventaAgrupada.createdAt = createdAt;
          ventaAgrupada.updatedAt = updatedAt;
        }

        ventaAgrupada.saldo = saldoMovimiento;
      });

      agrupados.sort((a, b) => {
        const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;

        if (fechaA !== fechaB) {
          return fechaA - fechaB;
        }

        const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        if (createdA !== createdB) {
          return createdA - createdB;
        }

        const ordenA = typeof a.__orden === "number" ? a.__orden : Number.MAX_SAFE_INTEGER;
        const ordenB = typeof b.__orden === "number" ? b.__orden : Number.MAX_SAFE_INTEGER;

        return ordenA - ordenB;
      });

      const movimientos = agrupados.map(({ __orden, ...mov }) => mov);

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
