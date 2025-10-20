const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const parseMonto = (valor) => {
  if (valor === null || valor === undefined) {
    return 0;
  }

  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    return 0;
  }

  return numero;
};

const facturaCompraSchema = new Schema(
  {
    numero: {
      type: String,
      required: [true, "El número de factura es obligatorio"],
      trim: true,
      unique: true,
    },
    fecha: {
      type: Date,
      required: [true, "La fecha de la factura es obligatoria"],
    },
    proveedor: {
      type: Schema.Types.ObjectId,
      ref: "Proveedor",
      required: [true, "Debe seleccionar un proveedor"],
    },
    monto: {
      type: Number,
      required: [true, "El monto de la factura es obligatorio"],
      set: parseMonto,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

facturaCompraSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("FacturaCompra", facturaCompraSchema);
