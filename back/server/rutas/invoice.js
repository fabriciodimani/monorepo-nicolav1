const express = require("express");
const Comanda = require("../modelos/comanda");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

app.get("/invoices", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Comanda.find({ activo: true })
    .limit(limite)
    .skip(desde)
    .sort("nrodecomanda") //ordenar alfabeticamente
    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })
    // .populate("condicioniva")

    // .populate({ path: "condicioniva")
    // .populate({"localidad", "localidad codigopostal", populate:{"provincia", "provincia"}})
    // .populate("razonsocial")
    .exec((err, comandas) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Comanda.countDocuments({ activo: true }, (err, conteo) => {
        res.json({
          ok: true,
          comandas,
          cantidad: conteo,
        });
      });
    });
});

app.get("/invoices/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;
  console.log(id);

  Comanda.find({ nrodecomanda: id }).exec((err, comanda) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      comanda,
    });
  });
});

// app.post("/invoices/:comanda", function (req, res) {
//   // res.json("GET usuarios");
//   // console.log(res);
//   // let comanda = req.body.nrodecomanda;
//   // console.log(comanda)
//   console.log(req.body.comanda);

//   Comanda.find({ nrodecomada: "2" }, function (err, docs) {
//     // console.log(err);
//     res.send(req.body.nrodecomanda);
//     // console.log(req.body.monto);
//   });
// });

//LO COMENTADO ES CON VERIFICACION DE TOKEN
// app.post("/comandas", [verificaToken, verificaAdmin_role], function (req, res) {
// app.post("/comandas", function (req, res) {
//   // res.json('POST usuarios')

//   let body = req.body;
//   console.log(body);

//   let comanda = new Comanda({
//     nrodecomanda: body.nrodecomanda,
//     codcli: body.codcli,
//     lista: body.lista,
//     codprod: body.codprod,
//     cantidad: body.cantidad,
//     monto: body.monto,
//     entregado: body.entregado,
//     activo: body.activo,
//     // usuario: req.usuario._id,
//   });

//   comanda.save((err, comandaDB) => {
//     if (err) {
//       return res.status(400).json({
//         ok: false,
//         err,
//       });
//     }

//     res.json({
//       ok: true,
//       comanda: comandaDB,
//     });
//   });
// });
// app.put(
//   "/comandas/:id",
//   [verificaToken, verificaAdmin_role],
//   function (req, res) {
//     // res.json("PUT usuarios");
//     let id = req.params.id;
//     let body = req.body;

//     Comanda.findByIdAndUpdate(
//       id,
//       body,
//       { new: true, runValidators: true },
//       (err, comandaDB) => {
//         if (err) {
//           return res.status(400).json({
//             ok: false,
//             err,
//           });
//         }
//         res.json({
//           ok: true,
//           comanda: comandaDB,
//         });
//       }
//     );
//   }
// );

// app.delete(
//   "/comandas/:id",
//   [verificaToken, verificaAdmin_role],
//   function (req, res) {
//     let id = req.params.id;

//     let estadoActualizado = {
//       activo: false,
//     };

//     Comanda.findByIdAndUpdate(
//       id,
//       estadoActualizado,
//       { new: true },
//       (err, comandaBorrado) => {
//         if (err) {
//           return res.status(400).json({
//             ok: false,
//             err,
//           });
//         }

//         if (!comandaBorrado) {
//           return res.status(400).json({
//             ok: false,
//             err: {
//               message: "Comanda no encontrada",
//             },
//           });
//         }

//         res.json({
//           ok: true,
//           comanda: comandaBorrado,
//         });
//       }
//     );
//   }
// );

module.exports = app;
