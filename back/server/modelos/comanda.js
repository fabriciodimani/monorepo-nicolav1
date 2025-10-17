const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let comandaSchema = new Schema({
  nrodecomanda: {
    type: Number,
    // required: [true, "Ingrese el codigo valido"],
  },

  codcli: {
    type: Schema.Types.ObjectId,
    ref: "Cliente",
  },

  lista: {
    type: Schema.Types.ObjectId,
    ref: "Lista",
  },

  codprod: {
    type: Schema.Types.ObjectId,
    ref: "Producserv",
  },
  
  cantidad: {
    type: Number,
    min: 1,
    required: [true, "Ingrese la cantidad"],
  },

  monto: {
    type: Number,
  },

  fecha: {
    type: Date,
    default: Date.now,
  },

  codestado: {
    type: Schema.Types.ObjectId,
    ref: "Estado",
  },

  camion: {
    type: Schema.Types.ObjectId,
    ref: "Camion",
  },


  entregado: {
    type: Boolean,
    default: false,
  },

  cantidadentregada: {
    type: Number,
    min: 0,
    default:0,
    required: [true, "Ingrese la cantidad"],
  },

  fechadeentrega: {
    type: Date,
    // default: () => Date.now() - 3 * 60 * 60 * 1000,
  },

  activo: {
    type: Boolean,
    default: true,
  },

    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },

    camionero: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },

});

comandaSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("Comanda", comandaSchema);
