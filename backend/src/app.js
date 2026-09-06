// Servidor de Aplicación Express con inicialización de Sequelize y Archivos Estáticos
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { setupModels } = require('./models');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Servir archivos estáticos subidos (Multer / Hostinger)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Rutas API
app.use('/api', apiRoutes);

// Endpoint de verificación de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'BioAR API (Sequelize + Uploads)', time: new Date() });
});

// Inicialización de Modelos y Servidor
async function startServer() {
  await setupModels();
  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`[BioAR Backend] Servidor ejecutándose en http://localhost:${PORT}`);
    });
  }
}

startServer();

module.exports = app;
