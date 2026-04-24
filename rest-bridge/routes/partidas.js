const express = require('express');
const router = express.Router();
const Partida = require('../models/Partida');

router.post('/crear', async (req, res) => {
  try {
    const { lobbyCode, jugadores, perfilAsignado } = req.body;

    const nuevaPartida = new Partida({
      lobbyCode,
      jugadores: jugadores || [],
      perfilAsignado,
      accidentes: [],
      cartas: [],
      iniciadaEn: new Date()
    });

    await nuevaPartida.save();
    console.log(`[PARTIDA] Creada: ${nuevaPartida._id}`);
    res.json({ ok: true, partidaId: nuevaPartida._id });
  } catch (error) {
    console.error('[PARTIDA] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.put('/:id/accidentes', async (req, res) => {
  try {
    const { id } = req.params;
    const { accidentes } = req.body;

    const partida = await Partida.findByIdAndUpdate(
      id,
      { accidentes },
      { new: true }
    );

    if (!partida) {
      return res.status(404).json({ ok: false, message: 'Partida no encontrada' });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('[PARTIDA] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.put('/:id/cartas', async (req, res) => {
  try {
    const { id } = req.params;
    const { cartas } = req.body;

    const partida = await Partida.findByIdAndUpdate(
      id,
      { cartas },
      { new: true }
    );

    if (!partida) {
      return res.status(404).json({ ok: false, message: 'Partida no encontrada' });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('[PARTIDA] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.put('/:id/finalizar', async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado } = req.body;

    const partida = await Partida.findByIdAndUpdate(
      id,
      { finalizadaEn: new Date(), resultado },
      { new: true }
    );

    if (!partida) {
      return res.status(404).json({ ok: false, message: 'Partida no encontrada' });
    }

    console.log(`[PARTIDA] Finalizada: ${id}`);
    res.json({ ok: true });
  } catch (error) {
    console.error('[PARTIDA] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

module.exports = router;
