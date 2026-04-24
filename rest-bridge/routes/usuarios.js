const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || username.length < 3) {
      return res.status(400).json({ ok: false, message: 'El usuario debe tener al menos 3 caracteres' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ ok: false, message: 'La contrasena debe tener al menos 4 caracteres' });
    }

    const usuarioExistente = await Usuario.findOne({ username: username.toLowerCase() });
    if (usuarioExistente) {
      return res.status(409).json({ ok: false, message: 'El usuario ya existe' });
    }

    const nuevoUsuario = new Usuario({
      username,
      password,
      createdAt: new Date()
    });

    await nuevoUsuario.save();

    console.log(`[REGISTRO] Usuario creado: ${username}`);
    res.json({ ok: true, username });
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

    const usuario = await Usuario.findOne({ username: username.toLowerCase() });
    if (!usuario) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ ok: false, message: 'Contrasena incorrecta' });
    }

    console.log(`[LOGIN] Usuario logueado: ${username}`);
    res.json({ ok: true, username: usuario.username });
  } catch (error) {
    console.error('[LOGIN] Error:', error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

module.exports = router;
