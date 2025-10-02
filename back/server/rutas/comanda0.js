// routes/comandas.js
const express = require("express");
const mongoose = require("mongoose");
const _ = require("underscore");
const Comanda = require("../modelos/comanda");
const { verificaToken, verificaRoles } = require("../middlewares/autenticacion");

const app = express();

// Lista de relaciones a poblar
const POPULATES = [
  { path: "codemp", select: "empresa" },
  { path: "codtra", select: "transporte" },
  { path: "codcho", select: "nombre" },
  { path: "codclif", select: "razonsocial" },
  { path: "codclic", select: "razonsocial" },
  { path: "codclid", select: "razonsocial" },
  { path: "codori", select: "destino" },
  { path: "coddes", select: "destino" },
  { path: "codpro", select: "producto" },
  { path: "codcam", select: "camion patente" },
  { path: "codest", select: "estado" },
  { path: "usuario", select: "nombres apellidos email" }  // ejemplo de campos de Usuario
];

// Helper para encadenar múltiples populate()
function applyPopulates(query) {
  POPULATES.forEach(p => query.populate(p.path, p.select));
  return query;
}

// 📄 GET /comandas - listar comandas (solo ADMIN)
app.get(
  "/",
  [verificaToken, verificaRoles("ADMIN_ROLE")],
  async (req, res) => {
    try {
      let q = Comanda.find({ activo: true });
      applyPopulates(q);
      const comandas = await q.exec();
      const cantidad = await Comanda.countDocuments({ activo: true });

      res.json({ ok: true, comandas, cantidad });
    } catch (err) {
      res.status(500).json({ ok: false, err });
    }
  }
);

// ✅ GET /comandas/:id - obtener una comanda por ID
app.get(
  "/:id",
  [verificaToken, verificaRoles("ADMIN_ROLE")],
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, err: "ID inválido" });
    }

    try {
      let q = Comanda.findById(id);
      applyPopulates(q);
      const comanda = await q.exec();

      if (!comanda) {
        return res.status(404).json({ ok: false, err: "Comanda no encontrada" });
      }

      res.json({ ok: true, comanda });
    } catch (err) {
      res.status(500).json({ ok: false, err });
    }
  }
);

// ✅ POST /comandas - crear nueva comanda
app.post(
  "/",
  [verificaToken, verificaRoles("ADMIN_ROLE")],
  async (req, res) => {
    try {
      const b = req.body;

      // Validar todos los ObjectId
      for (let key of POPULATES.map(p => p.path)) {
        if (b[key] && !mongoose.Types.ObjectId.isValid(b[key])) {
          return res.status(400).json({ ok: false, err: `${key} inválido` });
        }
      }

      const comanda = new Comanda({
        codemp:     b.codemp,
        nroviaje:   b.nroviaje,
        fecha:      b.fecha,
        codtra:     b.codtra,
        codcho:     b.codcho,
        codclif:    b.codclif,
        factura:    b.factura,
        estado:     b.estado,
        tercero:    b.tercero,
        codclic:    b.codclic,
        codori:     b.codori,
        coddes:     b.coddes,
        codclid:    b.codclid,
        remitos:    b.remitos,
        codpro:     b.codpro,
        codcam:     b.codcam,
        codest:     b.codest,
        kgsal:      b.kgsal,
        dif:        b.dif,
        kglle:      b.kglle,
        pactado:    b.pactado,
        subtotal:   b.subtotal,
        iva:        b.iva,
        total:      b.total,
        pactadoter: b.pactadoter,
        kmsal:      b.kmsal,
        kmdes:      b.kmdes,
        observ:     b.observ,
        usuario:    b.usuario,
        activo:     true,
      });

      const saved = await comanda.save();

      // Poblar antes de devolver
      let pop = saved;
      POPULATES.forEach(p => {
        pop = pop.populate(p.path, p.select);
      });
      const populated = await pop.execPopulate();

      res.status(201).json({ ok: true, comanda: populated });
    } catch (err) {
      res.status(400).json({ ok: false, err });
    }
  }
);

// ✏️ PUT /comandas/:id - editar comanda
app.put(
  "/:id",
  [verificaToken, verificaRoles("ADMIN_ROLE")],
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, err: "ID inválido" });
    }

    const body = _.pick(req.body, POPULATES.map(p => p.path).concat([
      "nroviaje","fecha","factura","estado","tercero","kgsal","dif","kglle",
      "pactado","subtotal","iva","total","pactadoter","kmsal","kmdes","observ"
    ]));

    try {
      // Validar referencias
      for (let key of POPULATES.map(p => p.path)) {
        if (body[key] && !mongoose.Types.ObjectId.isValid(body[key])) {
          return res.status(400).json({ ok: false, err: `${key} inválido` });
        }
      }

      let updated = await Comanda.findByIdAndUpdate(id, body, { new: true });

      // Poblar antes de devolver
      let pop = updated;
      POPULATES.forEach(p => {
        pop = pop.populate(p.path, p.select);
      });
      const populated = await pop.execPopulate();

      res.json({ ok: true, comanda: populated });
    } catch (err) {
      res.status(400).json({ ok: false, err });
    }
  }
);

// ❌ DELETE /comandas/:id - desactivar comanda
app.delete(
  "/:id",
  [verificaToken, verificaRoles("ADMIN_ROLE")],
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, err: "ID inválido" });
    }

    try {
      const deactivated = await Comanda.findByIdAndUpdate(
        id,
        { activo: false },
        { new: true }
      );
      if (!deactivated) {
        return res.status(404).json({ ok: false, err: "Comanda no encontrada" });
      }
      res.json({ ok: true, comanda: deactivated });
    } catch (err) {
      res.status(400).json({ ok: false, err });
    }
  }
);

module.exports = app;
