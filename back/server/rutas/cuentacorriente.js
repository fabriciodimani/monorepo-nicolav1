const express = require("express");
const { Types } = require("mongoose");
const Cliente = require("../modelos/cliente");
const MovimientoCuentaCorriente = require("../modelos/movimientoCuentaCorriente");
const { verificaToken } = require("../middlewares/autenticacion");
const { obtenerFechaArgentina } = require("../utils/fechas");
const { calcularCuentaCorrienteCliente } = require("../utils/cuentaCorriente");

const app = express();

// Determina si el usuario posee permisos administrativos.
const esRolAdministrativo = (usuario = {}) =>
  usuario.role === "ADMIN_ROLE" || usuario.role === "ADMIN_SUP";

const toPlainObject = (documento) =>
  documento && typeof documento.toObject === "function"
    ? documento.toObject()
    : documento;

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

      const { movimientos: movimientosConSaldo, saldo } =
        calcularCuentaCorrienteCliente({ cliente: toPlainObject(cliente), movimientos });

      res.json({
        ok: true,
        saldo,
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

app.post("/cuentacorriente/saldos", [verificaToken], async (req, res) => {
  if (!esRolAdministrativo(req.usuario)) {
    return res.status(403).json({
      ok: false,
      err: { message: "No tiene permisos para consultar la cuenta" },
    });
  }

  const { clienteIds } = req.body || {};
  const idsNormalizados = Array.isArray(clienteIds)
    ? clienteIds
        .map((id) => {
          if (typeof id !== "string" && typeof id !== "number") {
            return null;
          }

          const idString = String(id).trim();

          if (!idString) {
            return null;
          }

          if (!Types.ObjectId.isValid(idString)) {
            return null;
          }

          return new Types.ObjectId(idString);
        })
        .filter(Boolean)
    : [];

  const filtroClientes = idsNormalizados.length
    ? { _id: { $in: idsNormalizados } }
    : { activo: true };

  try {
    const clientes = await Cliente.find(filtroClientes).select(
      "saldo saldoInicial codcli razonsocial activo"
    );

    const saldosCalculados = await Promise.all(
      clientes.map(async (cliente) => {
        const movimientos = await MovimientoCuentaCorriente.find({
          cliente: cliente._id,
        })
          .sort({ fecha: 1, createdAt: 1 })
          .lean();

        const { saldo } = calcularCuentaCorrienteCliente({
          cliente: toPlainObject(cliente),
          movimientos,
        });

        return {
          clienteId: String(cliente._id),
          saldo,
        };
      })
    );

    res.json({
      ok: true,
      clientes: saldosCalculados,
    });
  } catch (error) {
    console.error("POST /cuentacorriente/saldos", error);
    res.status(500).json({
      ok: false,
      err: {
        message: "Error al calcular los saldos",
        detalle: error.message,
      },
    });
  }
});

module.exports = app;
