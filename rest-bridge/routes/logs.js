const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
router.post('/', async (req, res) => {
  try {
    const { type, action, details } = req.body;
    if (!type || !action) {
      return res.status(400).json({ ok: false, message: 'type y action son obligatorios' });
    }
    const nuevoLog = new Log({
      type,
      action,
      details: details || {},
      timestamp: new Date()
    });
    await nuevoLog.save();
    console.log(`[LOG] ${type} > ${action}`);
    res.json({ ok: true, logId: nuevoLog._id });
  } catch (error) {
    console.error('[LOGS] Error al crear log:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const { type, limit = 100 } = req.query;
    const query = type ? { type } : {};
    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();
    res.json({ ok: true, logs, count: logs.length });
  } catch (error) {
    console.error('[LOGS] Error al obtener logs:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});
router.delete('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const result = await Log.deleteMany(query);
    console.log(`[LOGS] Eliminados ${result.deletedCount} logs`);
    res.json({ ok: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('[LOGS] Error al eliminar logs:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});
module.exports = router;
