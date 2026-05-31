const mongoose = require('mongoose');
const encuestaSchema = new mongoose.Schema({
  username: { type: String, default: 'anonimo' },
  lobbyCode: { type: String, default: 'N/A' },
  respuestas: { type: mongoose.Schema.Types.Mixed, required: true },
  promedioGeneral: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
}, { collection: 'Encuestas' });
encuestaSchema.index({ timestamp: -1 });
module.exports = mongoose.model('Encuesta', encuestaSchema, 'Encuestas');
