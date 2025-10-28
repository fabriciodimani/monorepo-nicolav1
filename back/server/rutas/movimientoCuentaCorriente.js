const express = require("express");
const MovimientoCuentaCorriente = require("../modelos/movimientoCuentaCorriente");

const app = express();

app.get("/movimientocuentacorriente/saldos", async (req, res) => {
  try {
    const movimientos = await MovimientoCuentaCorriente.aggregate([
      { $sort: { cliente: 1, fecha: 1, createdAt: 1, _id: 1 } },
      {
        $group: {
          _id: "$cliente",
          ultimoSaldo: { $last: "$saldo" },
        },
      },
    ]);

    const saldos = movimientos.reduce((acumulador, movimiento) => {
      const clienteId = movimiento._id ? String(movimiento._id) : null;
      const saldoNumerico = Number(movimiento.ultimoSaldo);
      const saldoNormalizado = Number.isFinite(saldoNumerico)
        ? Number(saldoNumerico.toFixed(2))
        : 0;

      if (clienteId) {
        acumulador[clienteId] = saldoNormalizado;
      }

      return acumulador;
    }, {});

    res.json({
      ok: true,
      saldos,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      err: {
        message: "Error al obtener los saldos acumulados",
        detalle: error.message,
      },
    });
  }
});

module.exports = app;
