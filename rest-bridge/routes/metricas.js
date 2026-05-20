const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');

router.post('/', async (req, res) => {
  try {
    const { type, action, details } = req.body;
    if (!type || !action) {
      return res.status(400).json({ ok: false, message: 'type y action son obligatorios' });
    }
    const nuevaMetrica = new Metric({
      type,
      action,
      details: details || {},
      timestamp: new Date()
    });
    await nuevaMetrica.save();
    console.log(`[METRICA] ${type} > ${action}`);
    res.json({ ok: true, metricId: nuevaMetrica._id });
  } catch (error) {
    console.error('[METRICAS] Error al crear métrica:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { action, limit = 100 } = req.query;
    const query = action ? { action } : {};
    const metrics = await Metric.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();
    res.json({ ok: true, metrics, count: metrics.length });
  } catch (error) {
    console.error('[METRICAS] Error al obtener métricas:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

module.exports = router;
