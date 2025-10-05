const express = require("express");
const Comanda = require("../modelos/comanda");
const Cliente = require("../modelos/cliente");
const MovimientoCuentaCorriente = require("../modelos/movimientocuentacorriente");

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
app.post("/comandas", [verificaToken, verificaAdminPrev_role], async function (req, res) {
  let body = req.body;

  try {
    if (!body.codcli) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El cliente es obligatorio para registrar la comanda",
        },
      });
    }

    // Verificamos la existencia del cliente antes de registrar la comanda
    const cliente = await Cliente.findById(body.codcli);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "Cliente no encontrado",
        },
      });
    }

    const montoNumber = body.monto !== undefined ? Number(body.monto) : 0;

    if (Number.isNaN(montoNumber)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El monto de la comanda no es válido",
        },
      });
    }

    const comandaData = {
      nrodecomanda: body.nrodecomanda,
      codcli: body.codcli,
      lista: body.lista,
      codprod: body.codprod,
      cantidad: body.cantidad,
      monto: montoNumber,
      codestado: body.codestado,
      camion: body.camion,
      entregado: body.entregado,
      cantidadentregada: body.cantidadentregada,
      fechadeentrega: body.fechadeentrega,
      activo: body.activo,
      usuario: body.usuario,
      camionero: body.camionero,
    };

    if (body.fecha) {
      comandaData.fecha = body.fecha;
    }

    const comanda = new Comanda(comandaData);

    const comandaDB = await comanda.save();

    if (montoNumber !== 0) {
      cliente.saldo = (cliente.saldo || 0) + montoNumber;
      await cliente.save();

      const descripcionMovimiento = (body.descripcion || `Venta - Comanda ${
        comandaDB.nrodecomanda || comandaDB._id
      }`).trim();

      // Registramos el movimiento en la cuenta corriente del cliente
      await MovimientoCuentaCorriente.create({
        cliente: cliente._id,
        tipo: "Venta",
        descripcion: descripcionMovimiento,
        fecha: body.fecha ? new Date(body.fecha) : comandaDB.fecha,
        monto: montoNumber,
        saldo: cliente.saldo,
        comanda: comandaDB._id,
      });
    }

    res.json({
      ok: true,
      comanda: comandaDB,
    });
  } catch (error) {
    console.log("POST Comanda error", error);
    res.status(400).json({
      ok: false,
      err: {
        message: "No se pudo registrar la comanda",
        detalle: error.message,
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
