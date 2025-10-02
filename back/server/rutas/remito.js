const express = require("express");
const Remitos = require("../modelos/remito");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
//const unidaddemedida = require("../modelos/unidaddemedida");
const app = express();

app.get("/remitos", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Remitos.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("nroderemito") //ordenar alfabeticamente
    .populate({path:"codprov",populate:{path:"localidad"},})
    .populate("codprod")
    .exec((err, remitos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Remitos.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          remitos,
          cantidad: conteo,
        });
      });
    });
});

app.get("/remitos/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Remitos.findById(id).exec((err, remitos) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      remitos,
    });
  });
});

app.post("/remitos", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;
  console.log(body);

  let remitos = new Remitos({
    nroderemito: body.nroderemito,
    fecha: body.fecha,
    codprov: body.codprov,
    codprod: body.codprod,
    cantidad: body.cantidad,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  remitos.save((err, remitoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      remitos: remitoDB,
    });
  });
});
app.put(
  "/remitos/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    //verficar aqui
    Remitos.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, remitoDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          remitos: remitoDB,
        });
      }
    );
  }
);

app.delete(
  "/remitos/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Remitos.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, remitoBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!remitoBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Remito no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          remitos: remitoBorrado,
        });
      }
    );
  }
);

module.exports = app;
