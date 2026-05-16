const mongoose = require('mongoose');

const gameMasterSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  tema: { type: String, default: 'clasico' },
  createdAt: { type: Date, default: Date.now }
});

gameMasterSchema.set('collection', 'Usuarios');

module.exports = mongoose.model('GameMaster', gameMasterSchema);
