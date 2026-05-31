const express = require('express');
const router = express.Router();
const Encuesta = require('../models/Encuesta');

router.post('/', async (req, res) => {
  try {
    const { username, lobbyCode, respuestas, promedioGeneral, timestamp } = req.body;

    if (!respuestas || typeof respuestas !== 'object') {
      return res.status(400).json({ ok: false, message: 'respuestas es obligatorio y debe ser un objeto' });
    }

    const nuevaEncuesta = new Encuesta({
      username: username || 'anonimo',
      lobbyCode: lobbyCode || 'N/A',
      respuestas,
      promedioGeneral: promedioGeneral || 0,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    await nuevaEncuesta.save();
    console.log(`[ENCUESTA] Recibida de ${username} - Promedio: ${promedioGeneral}`);
    res.json({ ok: true, encuestaId: nuevaEncuesta._id });
  } catch (error) {
    console.error('[ENCUESTAS] Error al crear encuesta:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { username, limit = 100 } = req.query;
    const query = username ? { username } : {};
    const encuestas = await Encuesta.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();
    res.json({ ok: true, encuestas, count: encuestas.length });
  } catch (error) {
    console.error('[ENCUESTAS] Error al obtener encuestas:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

module.exports = router;
