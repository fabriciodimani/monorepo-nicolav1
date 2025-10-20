const express = require("express");
const FacturaCompra = require("../modelos/facturaCompra");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const app = express();

const parseFechaFactura = (valor) => {
  if (!valor) {
    return null;
  }

  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor;
  }

  if (typeof valor === "string") {
    const trimmed = valor.trim();
    if (!trimmed) {
      return null;
    }

    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const date = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T00:00:00`);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const partes = trimmed.split("/");
    if (partes.length === 3) {
      const [dia, mes, anio] = partes;
      const date = new Date(`${anio}-${mes}-${dia}T00:00:00`);
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  const date = new Date(valor);
  return Number.isNaN(date.getTime()) ? null : date;
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

app.post("/facturascompra", function (req, res) {
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

  factura.save((err, facturaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    FacturaCompra.populate(
      facturaDB,
      { path: "proveedor" },
      (populateErr, facturaPopulada) => {
        if (populateErr) {
          return res.status(400).json({ ok: false, err: populateErr });
        }

        res.json({
          ok: true,
          factura: facturaPopulada,
        });
      }
    );
  });
});

app.put(
  "/facturascompra/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    const { id } = req.params;
    const body = req.body || {};

    const update = {};

    if (body.numero || body.nroFactura) {
      update.numero = body.numero || body.nroFactura;
    }

    if (body.fecha || body.fechaFactura) {
      const fecha = parseFechaFactura(body.fecha || body.fechaFactura);
      if (!fecha) {
        return res.status(400).json({
          ok: false,
          err: { message: "La fecha de la factura no es válida" },
        });
      }
      update.fecha = fecha;
    }

    if (body.proveedor) {
      update.proveedor = body.proveedor;
    }

    if (body.monto !== undefined) {
      update.monto = normalizarMonto(body.monto);
    }

    FacturaCompra.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true },
      (err, facturaDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!facturaDB) {
          return res.status(404).json({
            ok: false,
            err: { message: "Factura no encontrada" },
          });
        }

        FacturaCompra.populate(
          facturaDB,
          { path: "proveedor" },
          (populateErr, facturaPopulada) => {
            if (populateErr) {
              return res.status(400).json({ ok: false, err: populateErr });
            }

            res.json({
              ok: true,
              factura: facturaPopulada,
            });
          }
        );
      }
    );
  }
);

app.delete(
  "/facturascompra/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    const { id } = req.params;

    FacturaCompra.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
      (err, facturaBorrada) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!facturaBorrada) {
          return res.status(404).json({
            ok: false,
            err: { message: "Factura no encontrada" },
          });
        }

        res.json({
          ok: true,
          factura: facturaBorrada,
        });
      }
    );
  }
);

module.exports = app;
