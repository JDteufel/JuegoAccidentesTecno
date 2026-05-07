const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const gameMastersRoutes = require('./routes/gameMasters');
const logsRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', gameMastersRoutes);
app.use('/api/logs', logsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[REST Bridge] Servidor corriendo en puerto ${PORT}`);
  connectDB();
});
