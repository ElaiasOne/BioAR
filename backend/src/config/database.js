// Configuración de la instancia de Sequelize ORM para SQL Server y Fallback SQLite
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbHost = process.env.DB_SERVER || 'localhost';
const dbName = process.env.DB_NAME || 'BioARDB';
const dbUser = process.env.DB_USER || 'sa';
const dbPassword = process.env.DB_PASSWORD || 'TuPassword123';
const dbPort = parseInt(process.env.DB_PORT || '1433', 10);

// Configuración Sequelize SQL Server
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: true
    }
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Instancia fallback para SQLite en memoria (para cuando SQL Server no esté corriendo localmente)
const sequelizeFallback = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

let activeSequelize = sequelize;

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('[Sequelize] Conexión establecida exitosamente con SQL Server.');
    activeSequelize = sequelize;
  } catch (error) {
    console.warn('[Sequelize] SQL Server no está disponible en este puerto. Usando base de datos SQLite en memoria para desarrollo.');
    activeSequelize = sequelizeFallback;
  }
  return activeSequelize;
}

function getSequelize() {
  return activeSequelize;
}

module.exports = { initDatabase, getSequelize };
