const express = require("express");
const Camion = require("../modelos/camion");

const {
  verificaToken,
  verificaAdmin_role,
  verificaCam_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/camiones", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Camion.find({ activo: true })
    // .limit(limite)
    // .skip(desde)
    .sort("camion") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, camiones) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Camion.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          camiones,
          cantidad: conteo,
        });
      });
    });
});

app.get("/camiones/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Camion.findById(id).exec((err, camiones) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      camiones,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/listas", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/camiones", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;
  console.log(body)

  let camion = new Camion({
    camion: body.camion,
    patente: body.patente,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  camion.save((err, camionDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      camion: camionDB,
    });
  });
});
app.put(
  "/camiones/:id",
  [verificaToken],
  // [verificaToken, verificaAdmin_role, verificaCam_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Camion.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, camionDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          camion: camionDB,
        });
      }
    );
  }
);

app.delete(
  "/camiones/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Camion.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, camionBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!camionBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Camion no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          camion: camionBorrado,
        });
      }
    );
  }
);

module.exports = app;
