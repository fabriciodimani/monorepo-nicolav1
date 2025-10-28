const express = require("express");
const FacturaCompra = require("../modelos/facturaCompra");
const Proveedor = require("../modelos/proveedor");
const MovimientoCuentaCorrienteProveedor = require("../modelos/movimientoCuentaCorrienteProveedor");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const { obtenerFechaArgentina } = require("../utils/fechas");

const app = express();

const sincronizarHorarioActualArgentina = (fecha) => {
  if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) {
    return null;
  }

  const ahoraArgentina = obtenerFechaArgentina();

  if (!(ahoraArgentina instanceof Date) || Number.isNaN(ahoraArgentina.getTime())) {
    return fecha;
  }

  fecha.setUTCHours(
    ahoraArgentina.getUTCHours(),
    ahoraArgentina.getUTCMinutes(),
    ahoraArgentina.getUTCSeconds(),
    ahoraArgentina.getUTCMilliseconds()
  );

  return fecha;
};

const parseFechaFactura = (valor) => {
  if (!valor) {
    return null;
  }

  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor;
  }

  const esCadena = typeof valor === "string";
  const contenido = esCadena ? valor.trim() : "";

  let fechaNormalizada = obtenerFechaArgentina(valor);

  if (!(fechaNormalizada instanceof Date) || Number.isNaN(fechaNormalizada.getTime())) {
    if (esCadena && contenido) {
      const isoMatch = contenido.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoMatch) {
        fechaNormalizada = obtenerFechaArgentina(
          `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`
        );
      } else {
        const partes = contenido.split("/");
        if (partes.length === 3) {
          const [dia, mes, anio] = partes;
          fechaNormalizada = obtenerFechaArgentina(`${anio}-${mes}-${dia}`);
        }
      }
    }
  }

  if (!(fechaNormalizada instanceof Date) || Number.isNaN(fechaNormalizada.getTime())) {
    const date = new Date(valor);
    fechaNormalizada = Number.isNaN(date.getTime()) ? null : date;
  }

  if (!(fechaNormalizada instanceof Date) || Number.isNaN(fechaNormalizada.getTime())) {
    return null;
  }

  if (
    esCadena &&
    contenido &&
    (/^(\d{4})-(\d{2})-(\d{2})$/.test(contenido) || /^(\d{2})\/(\d{2})\/(\d{4})$/.test(contenido))
  ) {
    sincronizarHorarioActualArgentina(fechaNormalizada);
  }

  return fechaNormalizada;
};

const normalizarMonto = (valor) => {
  if (valor === null || valor === undefined) {
    return 0;
  }

  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    return 0;
  }

  return numero;
};

const obtenerIdProveedor = (proveedor) => {
  if (!proveedor) {
    return null;
  }

  if (typeof proveedor === "string") {
    return proveedor;
  }

  if (typeof proveedor === "object") {
    if (proveedor._id) {
      return proveedor._id;
    }

    if (proveedor.id) {
      return proveedor.id;
    }
  }

  return null;
};

const descripcionFactura = (factura, prefijo = "Factura") => {
  if (factura && factura.numero) {
    return `${prefijo} ${factura.numero}`;
  }

  return `${prefijo} de compra`;
};

const registrarMovimientoProveedor = async ({
  factura,
  tipo,
  monto,
  proveedor,
  descripcion,
  fecha,
}) => {
  if (!proveedor) {
    return null;
  }

  const movimiento = new MovimientoCuentaCorrienteProveedor({
    proveedor: proveedor._id,
    tipo,
    descripcion,
    fecha,
    monto,
    saldo: proveedor.saldo,
    facturaCompra: factura._id,
  });

  await movimiento.save();
  return movimiento;
};

const actualizarMovimientoFactura = async ({
  factura,
  proveedor,
}) => {
  if (!factura) {
    return null;
  }

  const descripcion = descripcionFactura(factura);
  const monto = Number(factura.monto) || 0;
  const fecha = factura.fecha instanceof Date ? factura.fecha : obtenerFechaArgentina();

  const proveedorId = obtenerIdProveedor(proveedor) || obtenerIdProveedor(factura.proveedor);

  if (!proveedorId) {
    return null;
  }

  const proveedorActual = await Proveedor.findById(proveedorId);

  if (!proveedorActual) {
    return null;
  }

  proveedorActual.saldo = (proveedorActual.saldo || 0) + monto;
  await proveedorActual.save();

  const movimiento = await MovimientoCuentaCorrienteProveedor.findOneAndUpdate(
    { facturaCompra: factura._id },
    {
      proveedor: proveedorActual._id,
      tipo: "Factura",
      descripcion,
      fecha,
      monto,
      saldo: proveedorActual.saldo,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return movimiento;
};

const revertirImpactoFacturaAnterior = async ({ proveedorId, monto }) => {
  if (!proveedorId || !Number.isFinite(monto)) {
    return null;
  }

  const proveedor = await Proveedor.findById(proveedorId);
  if (!proveedor) {
    return null;
  }

  proveedor.saldo = (proveedor.saldo || 0) - monto;
  await proveedor.save();

  return proveedor;
};

app.get("/facturascompra", function (req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  FacturaCompra.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort({ fecha: -1, createdAt: -1 })
    .populate("proveedor")
    .exec((err, facturas) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      FacturaCompra.countDocuments({ activo: true }, (countErr, conteo) => {
        if (countErr) {
          return res.status(400).json({ ok: false, err: countErr });
        }

        res.json({
          ok: true,
          facturas,
          cantidad: conteo,
        });
      });
    });
});

app.get("/facturascompra/:id", function (req, res) {
  const { id } = req.params;

  FacturaCompra.findById(id)
    .populate("proveedor")
    .exec((err, factura) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!factura) {
        return res.status(404).json({
          ok: false,
          err: { message: "Factura no encontrada" },
        });
      }

      res.json({
        ok: true,
        factura,
      });
    });
});

app.post("/facturascompra", async function (req, res) {
  const body = req.body || {};

  const fecha = parseFechaFactura(body.fecha || body.fechaFactura);
  if (!fecha) {
    return res.status(400).json({
      ok: false,
      err: { message: "La fecha de la factura no es válida" },
    });
  }

  const factura = new FacturaCompra({
    numero: body.numero || body.nroFactura,
    fecha,
    proveedor: body.proveedor,
    monto: normalizarMonto(body.monto),
  });

  try {
    const facturaDB = await factura.save();
    const facturaPopulada = await FacturaCompra.findById(facturaDB._id).populate(
      "proveedor"
    );

    const proveedor = await Proveedor.findById(
      obtenerIdProveedor(facturaPopulada.proveedor)
    );

    if (proveedor) {
      proveedor.saldo = (proveedor.saldo || 0) + (Number(facturaPopulada.monto) || 0);
      await proveedor.save();

      await registrarMovimientoProveedor({
        factura: facturaPopulada,
        tipo: "Factura",
        monto: Number(facturaPopulada.monto) || 0,
        proveedor,
        descripcion: descripcionFactura(facturaPopulada),
        fecha: facturaPopulada.fecha,
      });
    }

    res.json({
      ok: true,
      factura: facturaPopulada,
    });
  } catch (err) {
    console.error("POST /facturascompra", err);
    res.status(400).json({
      ok: false,
      err,
    });
  }
});

app.put(
  "/facturascompra/:id",
  [verificaToken, verificaAdmin_role],
  async function (req, res) {
    const { id } = req.params;
    const body = req.body || {};

    try {
      const facturaDB = await FacturaCompra.findById(id);

      if (!facturaDB) {
        return res.status(404).json({
          ok: false,
          err: { message: "Factura no encontrada" },
        });
      }

      const proveedorAnteriorId = obtenerIdProveedor(facturaDB.proveedor);
      const montoAnterior = Number(facturaDB.monto) || 0;

      if (body.numero || body.nroFactura) {
        facturaDB.numero = body.numero || body.nroFactura;
      }

      if (body.fecha || body.fechaFactura) {
        const fecha = parseFechaFactura(body.fecha || body.fechaFactura);
        if (!fecha) {
          return res.status(400).json({
            ok: false,
            err: { message: "La fecha de la factura no es válida" },
          });
        }
        facturaDB.fecha = fecha;
      }

      if (body.proveedor) {
        facturaDB.proveedor = body.proveedor;
      }

      if (body.monto !== undefined) {
        facturaDB.monto = normalizarMonto(body.monto);
      }

      await facturaDB.save();

      const facturaActualizada = await FacturaCompra.findById(id).populate(
        "proveedor"
      );

      await revertirImpactoFacturaAnterior({
        proveedorId: proveedorAnteriorId,
        monto: montoAnterior,
      });

      const movimiento = await actualizarMovimientoFactura({
        factura: facturaActualizada,
        proveedor: facturaActualizada.proveedor,
      });

      res.json({
        ok: true,
        factura: facturaActualizada,
        movimiento,
      });
    } catch (err) {
      console.error("PUT /facturascompra/:id", err);
      res.status(400).json({
        ok: false,
        err,
      });
    }
  }
);

app.delete(
  "/facturascompra/:id",
  [verificaToken, verificaAdmin_role],
  async function (req, res) {
    const { id } = req.params;

    try {
      const factura = await FacturaCompra.findById(id);

      if (!factura) {
        return res.status(404).json({
          ok: false,
          err: { message: "Factura no encontrada" },
        });
      }

      if (!factura.activo) {
        return res.json({
          ok: true,
          factura,
        });
      }

      factura.activo = false;
      await factura.save();

      const proveedorId = obtenerIdProveedor(factura.proveedor);
      const montoFactura = Number(factura.monto) || 0;

      let movimiento = null;

      if (proveedorId && Number.isFinite(montoFactura)) {
        const proveedor = await Proveedor.findById(proveedorId);

        if (proveedor) {
          proveedor.saldo = (proveedor.saldo || 0) - montoFactura;
          await proveedor.save();

          movimiento = await registrarMovimientoProveedor({
            factura,
            tipo: "Anulación",
            monto: Math.abs(montoFactura),
            proveedor,
            descripcion: descripcionFactura(factura, "Anulación factura"),
            fecha: obtenerFechaArgentina(),
          });
        }
      }

      res.json({
        ok: true,
        factura,
        movimiento,
      });
    } catch (err) {
      console.error("DELETE /facturascompra/:id", err);
      res.status(400).json({
        ok: false,
        err,
      });
    }
  }
);

module.exports = app;
