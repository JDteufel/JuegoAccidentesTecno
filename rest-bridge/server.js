const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const usuariosRoutes = require('./routes/usuarios');
const logsRoutes = require('./routes/logs');
const partidasRoutes = require('./routes/partidas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/partidas', partidasRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[REST Bridge] Servidor corriendo en puerto ${PORT}`);
  connectDB();
});
