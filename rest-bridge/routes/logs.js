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
      timestamp: new Date(),
      type,
      action,
      details: details || {}
    });

    await nuevoLog.save();

    console.log(`[LOG] [${type}] ${action}`);
    res.json({ ok: true });
  } catch (error) {
    console.error('[LOGS] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { type: category } : {};
    const logs = await Log.find(filter).sort({ timestamp: -1 }).limit(100);
    res.json({ ok: true, category: category || 'ALL', logs });
  } catch (error) {
    console.error('[LOGS] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { category } = req.query;
    if (category) {
      await Log.deleteMany({ type: category });
    } else {
      await Log.deleteMany({});
    }
    res.json({ ok: true, category: category || 'ALL' });
  } catch (error) {
    console.error('[LOGS] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

module.exports = router;
