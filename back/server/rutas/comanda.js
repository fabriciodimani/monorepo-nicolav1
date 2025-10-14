const express = require("express");
const mongoose = require("mongoose");
const Comanda = require("../modelos/comanda");
const Cliente = require("../modelos/cliente");
const MovimientoCuentaCorriente = require("../modelos/movimientoCuentaCorriente");

const {
  verificaToken,
  verificaAdmin_role,
  verificaCam_role,
  verificaAdminCam_role,
  verificaAdminPrev_role,
} = require("../middlewares/autenticacion");

const _ = require("underscore");
const app = express();

//TODAS LAS COMANDAS
app.get("/comandas", function (req, res) {
  // res.json("GET usuarios");

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 500;
  limite = Number(limite);

  Comanda.find()
    // .limit(limite)
    // .skip(desde)
    .sort("nrodecomanda") //ordenar alfabeticamente
    .populate("codcli")
    .populate("lista")
    .populate("codestado")
    .populate("camion")
    // .populate("usuario")
    .populate({
      path: "codprod",
      populate: "marca",
      populate: "unidaddemedida",
    })

    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })

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

//SOLO COMANDAS ACTIVAS
app.get("/comandasactivas", function (req, res) {
  // res.json("GET usuarios");
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 700;
  limite = Number(limite);

  Comanda.find({ activo: true })
    .limit(limite)
    // .skip(desde)
    .sort({ nrodecomanda: -1 }) // -1 orden desc
    .populate({ path: "codcli", select: 'codcli razonsocial localidad' , populate: "ruta" })
    .populate("lista")
    .populate("codestado", "codestado estado")
    .populate("camion", "camion")
    .populate("usuario" , "role nombres apellidos")
    .populate("camionero", "role nombres apellidos")

    .populate({
      path: "codprod", 
      populate: "marca",
      populate: "unidaddemedida",
    })

    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })

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

//SOLO COMANDAS PREVENTISTA
app.get("/comandasprev", function (req, res) {
  // res.json("GET usuarios");

  Comanda.find({ activo: true })
    // .limit(limite)
    // .skip(desde)
    .sort({ nrodecomanda: -1 }) // -1 orden desc
    .populate({ path: "codcli", populate: "ruta" })
    .populate("lista")
    .populate("codestado")
    .populate("camion")
    .populate("camionero")

    .populate({
      path: "codprod",
      populate: "marca",
      populate: "unidaddemedida",
    })

    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })

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

app.get("/comandasapreparar", function (req, res) {
  // res.json("GET usuarios");
  // cod estado pertenece al estado A PREPARAR
  Comanda.find({ activo: true, codestado: "62200265c811f41820d8bda9" })
    // .limit(limite)
    // .skip(desde)
    .sort("nrodecomanda") //ordenar alfabeticamente
    .populate({ path: "codcli", populate: "ruta" })
    .populate({ path: "codprod", populate: "rubro" })
    .populate("lista")
    .populate("codestado")
    .populate("camion")
    .populate("usuario")
    

    .exec((err, comandas) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Comanda.countDocuments(
        { activo: true, codestado: "62200265c811f41820d8bda9" },
        (err, conteo) => {
          res.json({
            ok: true,
            comandas,
            cantidad: conteo,
          });
        }
      );
    });
});

app.get("/comandaspreparadas", function (req, res) {
  // res.json("GET usuarios");
  // cod estado pertenece al estado EN DISTRIBUCION y otro ENTREGADA
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 1000;
  limite = Number(limite);

  Comanda.find({
    activo: true,
    codestado: {
      $in: ["622002eac811f41820d8bdab", "6231174f962c72253b6fb6bd"],
    },
  })
    .limit(limite)
    // .skip(desde)
    .sort("nrodecomanda") //ordenar alfabeticamente
    .populate("codcli")
    .populate("lista")
    .populate("codestado")
    .populate("camion")
    .populate("usuario")
    .populate({
      path: "codprod",
      populate: "marca",
      populate: "unidaddemedida",
    })

    // .populate({
    //   path: "localidad",
    //   populate: { path: "provincia" },
    // })

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

      Comanda.countDocuments(
        {
          activo: true,
          codestado: {
            $in: ["622002eac811f41820d8bdab", "6231174f962c72253b6fb6bd"],
          },
        },
        (err, conteo) => {
          res.json({
            ok: true,
            comandas,
            cantidad: conteo,
          });
        }
      );
    });
});

app.get("/comandas/:id", function (req, res) {
  // res.json("GET usuarios");

  let id = req.params.id;

  Comanda.findById(id).exec((err, comandas) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      comandas,
    });
  });
});

// by Other fileds
//
app.get("/comandasnro", function (req, res) {
  // res.json("GET usuarios");
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 50;
  limite = Number(limite);

  // let nrodecomanda = req.query.nrodecomanda;
  console.log(req.query);
  // console.log(nrodecomanda);
   // Comanda.find({fecha: { $gte: '2022-08-03T21:14:24.896Z' , $lte: '2022-08-07T21:14:24.896Z' }})
  let fechaDesde=req.query.fechaDesde;
  let fechaHasta=req.query.fechaHasta;
  console.log(fechaDesde);
  console.log(fechaHasta);
  Comanda.find({fecha: { $gte: fechaDesde , $lte: fechaHasta }})
  // Comanda.find(req.query)
  .find ({activo:true})
  .sort({ nrodecomanda: -1 }) // -1 orden desc
    .populate({ path: "codcli", populate: "ruta" })
    .populate("lista")
    .populate("codestado")
    .populate("camion")
    .populate("usuario")
    .populate("camionero")

    .populate({
      path: "codprod",
      populate: "marca",
      populate: "unidaddemedida",
    })
  // .limit(limite)
  .exec((err, comandas) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      comandas,
    });
    // console.log("hola",res);
  });
});


app.get("/comandasinformes", function (req, res) {
  // res.json("GET usuarios");
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 1000;
  limite = Number(limite);

  // let nrodecomanda = req.query.nrodecomanda;
  console.log(req.query);
  // console.log(nrodecomanda);
   // Comanda.find({fecha: { $gte: '2022-08-03T21:14:24.896Z' , $lte: '2022-08-07T21:14:24.896Z' }})
  let fechaDesde=req.query.fechaDesde;
  let fechaHasta=req.query.fechaHasta;
  console.log(fechaDesde);
  console.log(fechaHasta);
  Comanda.find({fecha: { $gte: fechaDesde , $lte: fechaHasta }})
  // Comanda.find(req.query)
  .find ({activo:true})
  .sort({ nrodecomanda: -1 }) // -1 orden desc
    .populate({ path: "codcli", select: 'codcli razonsocial localidad' , populate: "ruta" })
    .populate("lista")
    .populate("codestado", "codestado estado")
    .populate("camion", "camion")
    .populate("usuario" , "role nombres apellidos")
    .populate("camionero", "role nombres apellidos")

    .populate({
      path: "codprod", 
      populate: "marca",
      populate: "unidaddemedida",
    })
  .limit(limite)
  .exec((err, comandas) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      comandas,
    });
    // console.log("hola",res);
  });
});


//LO COMENTADO ES CON VERIFICACION DE TOKEN
// Registra una nueva comanda y actualiza la cuenta corriente del cliente.
app.post("/comandas", [verificaToken, verificaAdminPrev_role], async function (
  req,
  res
) {
  const body = req.body;
  const monto = Number(body.monto) || 0;
  const fechaComanda = body.fecha ? new Date(body.fecha) : null;

  if (!body.codcli) {
    return res.status(400).json({
      ok: false,
      err: { message: "El cliente es obligatorio" },
    });
  }

  if (Number.isNaN(monto) || monto < 0) {
    return res.status(400).json({
      ok: false,
      err: { message: "El monto de la comanda es inválido" },
    });
  }

  if (body.fecha && Number.isNaN(fechaComanda.getTime())) {
    return res.status(400).json({
      ok: false,
      err: { message: "La fecha de la comanda es inválida" },
    });
  }

  try {
    const comandaData = {
      nrodecomanda: body.nrodecomanda,
      codcli: body.codcli,
      lista: body.lista,
      codprod: body.codprod,
      cantidad: body.cantidad,
      monto: monto,
      codestado: body.codestado,
      camion: body.camion,
      entregado: body.entregado,
      cantidadentregada: body.cantidadentregada,
      fechadeentrega: body.fechadeentrega,
      activo: body.activo,
      usuario: body.usuario,
      camionero: body.camionero,
    };

    if (fechaComanda) {
      comandaData.fecha = fechaComanda;
    }

    const comanda = new Comanda(comandaData);

    const comandaDB = await comanda.save();

    const cliente = await Cliente.findById(body.codcli);
    if (!cliente) {
      await Comanda.findByIdAndDelete(comandaDB._id);
      return res.status(404).json({
        ok: false,
        err: { message: "Cliente no encontrado" },
      });
    }

    cliente.saldo = (cliente.saldo || 0) + monto;
    await cliente.save();

    const descripcionMovimiento = (body.descripcion || "")
      .toString()
      .trim()
      .replace(/\s+/g, " ") ||
      (comandaDB.nrodecomanda
        ? `Comanda #${comandaDB.nrodecomanda}`
        : "Comanda");

    const numeroComanda =
      typeof comandaDB.nrodecomanda === "number" &&
      !Number.isNaN(comandaDB.nrodecomanda)
        ? comandaDB.nrodecomanda
        : null;

    let movimiento;

    if (numeroComanda !== null) {
      const filtrosActivos = {
        $or: [{ activo: { $exists: false } }, { activo: true }],
      };

      const totales = await Comanda.aggregate([
        {
          $match: {
            codcli: new mongoose.Types.ObjectId(cliente._id.toString()),
            nrodecomanda: numeroComanda,
            ...filtrosActivos,
          },
        },
        {
          $group: {
            _id: "$nrodecomanda",
            total: { $sum: { $ifNull: ["$monto", 0] } },
            ultimaFecha: { $max: "$fecha" },
          },
        },
      ]);

      const totalComanda = Number(totales[0]?.total) || monto;
      const fechaAgrupada =
        (totales[0]?.ultimaFecha && new Date(totales[0].ultimaFecha)) ||
        fechaComanda ||
        comandaDB.fecha;

      movimiento = await MovimientoCuentaCorriente.findOne({
        cliente: cliente._id,
        tipo: "Venta",
        comandaNumero: numeroComanda,
      });

      if (!movimiento) {
        movimiento = new MovimientoCuentaCorriente({
          cliente: cliente._id,
          tipo: "Venta",
          descripcion: descripcionMovimiento,
          fecha: fechaAgrupada,
          monto: totalComanda,
          saldo: cliente.saldo,
          comanda: comandaDB._id,
          comandaNumero: numeroComanda,
        });

        movimiento = await movimiento.save();
      } else {
        const montoAnterior = Number(movimiento.monto) || 0;
        const saldoAnterior = Number(movimiento.saldo) || 0;
        const diferencia = totalComanda - montoAnterior;

        movimiento.monto = totalComanda;
        movimiento.descripcion = descripcionMovimiento;
        movimiento.fecha = fechaAgrupada;
        movimiento.comandaNumero = numeroComanda;

        if (!movimiento.comanda) {
          movimiento.comanda = comandaDB._id;
        }

        if (diferencia !== 0) {
          movimiento.saldo = saldoAnterior + diferencia;
        }

        movimiento = await movimiento.save();

        if (diferencia !== 0) {
          await MovimientoCuentaCorriente.updateMany(
            {
              cliente: cliente._id,
              _id: { $ne: movimiento._id },
              createdAt: { $gt: movimiento.createdAt },
            },
            { $inc: { saldo: diferencia } }
          );
        }
      }
    } else {
      movimiento = new MovimientoCuentaCorriente({
        cliente: cliente._id,
        tipo: "Venta",
        descripcion: descripcionMovimiento,
        fecha: fechaComanda || comandaDB.fecha,
        monto: monto,
        saldo: cliente.saldo,
        comanda: comandaDB._id,
      });

      movimiento = await movimiento.save();
    }

    res.json({
      ok: true,
      comanda: comandaDB,
      saldo: cliente.saldo,
      movimiento,
    });
  } catch (err) {
    console.log("POST Comanda", err);
    res.status(500).json({
      ok: false,
      err: {
        message: "Error al crear la comanda",
        detalle: err.message,
      },
    });
  }
});
app.put(
  "/comandas/:id",
  [verificaToken, verificaAdminCam_role],
  // [verificaToken, verificaAdmin_role, verificaCam_role],
  // [verificaToken, verificaAdmin_role],
  function (req, res) {
    // res.json("PUT usuarios");
    let id = req.params.id;
    let body = req.body;

    Comanda.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, comandaDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          comanda: comandaDB,
        });
      }
    );
  }
);

app.delete(
  "/comandas/:id",
  [verificaToken, verificaAdmin_role],
  function (req, res) {
    let id = req.params.id;

    let estadoActualizado = {
      activo: false,
    };

    Comanda.findByIdAndUpdate(
      id,
      estadoActualizado,
      { new: true },
      (err, comandaBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!comandaBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Comanda no encontrada",
            },
          });
        }

        res.json({
          ok: true,
          comanda: comandaBorrado,
        });
      }
    );
  }
);

module.exports = app;
