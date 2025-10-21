const express = require("express");
const Proveedor = require("../modelos/proveedor");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

const escaparRegex = (termino = "") =>
  termino.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");

app.get("/proveedores/buscar", async (req, res) => {
  const termino = (req.query.nombre || req.query.razonsocial || "").trim();

  if (termino.length < 3) {
    return res.json({
      ok: true,
      proveedores: [],
    });
  }

  const terminoEscapado = escaparRegex(termino);
  const regexBusqueda = new RegExp(terminoEscapado, "i");

  const filtros = [{ razonsocial: regexBusqueda }];

  if (/^\d+$/.test(termino)) {
    filtros.push({ codprov: Number(termino) });
  }

  if (/^[0-9\-]+$/.test(termino)) {
    filtros.push({ cuit: regexBusqueda });
  }

  try {
    const proveedores = await Proveedor.find({
      activo: true,
      $or: filtros,
    })
      .limit(50)
      .sort("razonsocial")
      .lean();

    res.json({
      ok: true,
      proveedores,
    });
  } catch (err) {
    console.error("GET /proveedores/buscar", err);
    res.status(500).json({
      ok: false,
      err: { message: "No fue posible buscar proveedores" },
    });
  }
});

app.get("/proveedores", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Proveedor.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("razonsocial") //ordenar alfabeticamente
    .populate({
      path: "localidad",
      populate: { path: "provincia" },
    })
    .populate("condicioniva")
    
    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, proveedores) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Proveedor.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          proveedores,
          cantidad: conteo,
        });
      });
    });
});

app.get("/proveedores/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Proveedor.findById(id).exec((err, proveedores) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      proveedores,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/clientes", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/proveedores", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;
  const saldoNormalizado = Number(body.saldo);

  const saldo = Number.isNaN(saldoNormalizado) ? 0 : saldoNormalizado;

  let proveedor = new Proveedor({
    codprov: body.codprov,
    razonsocial: body.razonsocial,
    domicilio: body.domicilio,
    telefono: body.telefono,
    cuit: body.cuit,
    email: body.email,
    localidad: body.localidad,
    condicioniva: body.condicioniva,
    activo: body.activo,
    saldo,
    // usuario: req.Usuario._id, //probar si graba
  });

  proveedor.save((err, proveedorDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      proveedor: proveedorDB,
    });
  });
});
app.put(
  "/proveedores/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    if (body.hasOwnProperty("saldo")) {
      const saldoNormalizado = Number(body.saldo);
      body.saldo = Number.isNaN(saldoNormalizado) ? 0 : saldoNormalizado;
    }

    Proveedor.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, proveedorDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          proveedor: proveedorDB,
        });
      }
    );
  }
);

app.delete(
  "/proveedores/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Proveedor.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, proveedorBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!proveedorBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Proveedor no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          proveedor: proveedorBorrado,
        });
      }
    );
  }
);

module.exports = app;
