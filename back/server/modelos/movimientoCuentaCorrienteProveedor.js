const mongoose = require("mongoose");

const { Schema } = mongoose;

const movimientoCuentaCorrienteProveedorSchema = new Schema(
  {
    proveedor: {
      type: Schema.Types.ObjectId,
      ref: "Proveedor",
      required: true,
    },
    tipo: {
      type: String,
      enum: ["Factura", "Pago", "Anulación", "Anulacion", "Ajuste"],
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
    facturaCompra: {
      type: Schema.Types.ObjectId,
      ref: "FacturaCompra",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MovimientoCuentaCorrienteProveedor",
  movimientoCuentaCorrienteProveedorSchema
);
