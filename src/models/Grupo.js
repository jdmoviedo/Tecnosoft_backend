const { Schema, model } = require("mongoose");

const GrupoSchema = new Schema({
  usuario: { type: String, required: true },
  nombre: { type: String, required: true, unique: true},
  tipo: { type: String, required: true },
});

module.exports = model("Grupo", GrupoSchema);
