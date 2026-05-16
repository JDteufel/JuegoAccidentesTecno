const express = require('express');
const router = express.Router();
const GameMaster = require('../models/GameMaster');

router.post('/register', async (req, res) => {
  try {
    const { username, password, tema } = req.body;

    if (!username || username.length < 3) {
      return res.status(400).json({ ok: false, message: 'El usuario debe tener al menos 3 caracteres' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ ok: false, message: 'La contrasena debe tener al menos 4 caracteres' });
    }

    const existente = await GameMaster.findOne({ username: username.toLowerCase() });
    if (existente) {
      return res.status(409).json({ ok: false, message: 'El usuario ya existe' });
    }

    const nuevoGameMaster = new GameMaster({
      username,
      password,
      tema: tema || 'clasico',
      createdAt: new Date()
    });

    await nuevoGameMaster.save();

    console.log(`[REGISTRO] GameMaster creado: ${username}`);
    res.json({ ok: true, username, tema: nuevoGameMaster.tema });
  } catch (error) {
    console.error('[REGISTRO] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, message: 'Usuario y contrasena son obligatorios' });
    }

    const gameMaster = await GameMaster.findOne({ username: username.toLowerCase() });
    if (!gameMaster) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    if (password !== gameMaster.password) {
      return res.status(401).json({ ok: false, message: 'Contrasena incorrecta' });
    }

    console.log(`[LOGIN] GameMaster logueado: ${username}`);
    res.json({ ok: true, username: gameMaster.username, tema: gameMaster.tema });
  } catch (error) {
    console.error('[LOGIN] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.patch('/:username/tema', async (req, res) => {
  try {
    const { username } = req.params;
    const { tema } = req.body;

    if (!tema || !['clasico', 'moderno'].includes(tema)) {
      return res.status(400).json({ ok: false, message: 'Tema no valido. Use "clasico" o "moderno"' });
    }

    const gameMaster = await GameMaster.findOneAndUpdate(
      { username: username.toLowerCase() },
      { tema },
      { new: true }
    );

    if (!gameMaster) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    console.log(`[TEMA] Tema de ${username} actualizado a: ${tema}`);
    res.json({ ok: true, tema: gameMaster.tema });
  } catch (error) {
    console.error('[TEMA] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const gameMasters = await GameMaster.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json({ ok: true, usuarios: gameMasters });
  } catch (error) {
    console.error('[GAME MASTERS] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

module.exports = router;
