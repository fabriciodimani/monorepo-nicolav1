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

      const calcularImpactoSaldo = (movimiento = {}) => {
        const tipo =
          movimiento && typeof movimiento.tipo === "string"
            ? movimiento.tipo.toLowerCase()
            : "";
        const monto = obtenerMontoNumerico(movimiento.monto, 0);

        if (tipo === "pago") {
          return -monto;
        }

        if (tipo === "anulación" || tipo === "anulacion") {
          return monto;
        }

        return monto;
      };

      const impactosMovimiento = movimientos.map((movimiento) => {
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

      const saldoProveedorActual = obtenerMontoNumerico(proveedor.saldo, 0);

      let saldoInicial = saldoProveedorActual;

      if (impactosMovimiento.length) {
        const primerImpacto = impactosMovimiento[0];
        const saldoPrimerMovimiento = obtenerSaldoMovimiento(primerImpacto.movimiento);

        if (saldoPrimerMovimiento !== null) {
          saldoInicial = redondearMoneda(
            saldoPrimerMovimiento - primerImpacto.impacto
          );
        } else {
          let totalImpactos = 0;
          impactosMovimiento.forEach(({ impacto }) => {
            totalImpactos = redondearMoneda(totalImpactos + impacto);
          });

          saldoInicial = redondearMoneda(saldoProveedorActual - totalImpactos);
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

      let saldoFinal = saldoProveedorActual;

      if (movimientosConSaldo.length) {
        saldoFinal = movimientosConSaldo[movimientosConSaldo.length - 1].saldo;
      } else {
        saldoFinal = redondearMoneda(saldoInicial);
      }

      res.json({
        ok: true,
        proveedor,
        movimientos: movimientosConSaldo,
        saldo: saldoFinal,
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
