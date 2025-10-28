const mongoose = require("mongoose");

const { Schema } = mongoose;

const movimientoCuentaCorrienteSchema = new Schema(
  {
    cliente: {
      type: Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    tipo: {
      type: String,
      enum: ["Venta", "Pago", "Anulación", "Anulacion"],
      required: true,
    },
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    monto: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => Number.isFinite(value),
        message: "El monto debe ser un número válido",
      },
    },
    saldo: {
      type: Number,
      required: true,
    },
    comanda: {
      type: Schema.Types.ObjectId,
      ref: "Comanda",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MovimientoCuentaCorriente",
  movimientoCuentaCorrienteSchema
);
