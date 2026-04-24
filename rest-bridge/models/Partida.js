const mongoose = require('mongoose');

const partidaSchema = new mongoose.Schema({
  lobbyCode: { type: String },
  jugadores: [{ type: String }],
  perfilAsignado: { type: String },
  accidentes: [{ type: mongoose.Schema.Types.Mixed }],
  cartas: [{ type: mongoose.Schema.Types.Mixed }],
  iniciadaEn: { type: Date, default: Date.now },
  finalizadaEn: { type: Date },
  resultado: { type: String }
});

partidaSchema.index({ lobbyCode: 1 });
partidaSchema.index({ iniciadaEn: -1 });

module.exports = mongoose.model('Partida', partidaSchema, 'partidas');
