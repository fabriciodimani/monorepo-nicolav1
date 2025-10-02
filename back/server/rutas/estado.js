const express = require("express");
const Estado = require("../modelos/estado");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/estados", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Estado.find({ activo: true })
    // .limit(limite)
    // .skip(desde)
    .sort("orden") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, estados) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Estado.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          estados,
          cantidad: conteo,
        });
      });
    });
});

app.get("/estados/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Estado.findById(id).exec((err, estados) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      estados,
    });
  });
});

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/listas", [verificaToken, verificaAdmin_role], function (req, res) {
app.post("/estados", function (req, res) {
  // res.json('POST usuarios')

  let body = req.body;
  console.log(body)

  let estado = new Estado({
    codestado: body.codestado,
    estado: body.estado,
    orden: body.orden,
    activo: body.activo,
    // usuario: req.usuario._id,
  });

  estado.save((err, estadoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      estado: estadoDB,
    });
  });
});
app.put(
  "/estados/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Estado.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, estadoDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          estado: estadoDB,
        });
      }
    );
  }
);

app.delete(
  "/estados/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Estado.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, estadoBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!estadoBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Estado no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          estado: estadoBorrado,
        });
      }
    );
  }
);

module.exports = app;
