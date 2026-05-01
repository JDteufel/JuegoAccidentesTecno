const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { collection: 'Logs' });
logSchema.index({ timestamp: -1 });
module.exports = mongoose.model('Log', logSchema, 'Logs');
