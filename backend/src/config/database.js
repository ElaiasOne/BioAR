// Configuración de la instancia de Sequelize ORM (MSSQL / MySQL / SQLite / PostgreSQL)
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbDialect = process.env.DB_DIALECT || 'mssql';
const dbHost = process.env.DB_SERVER || process.env.DB_HOST || 'localhost';
const dbName = process.env.DB_NAME || 'BioARDB';
const dbUser = process.env.DB_USER || 'sa';
const dbPassword = process.env.DB_PASSWORD || 'TuPassword123';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : (dbDialect === 'mysql' ? 3306 : 1433);
const dbStorage = process.env.DB_STORAGE || './database.sqlite';

let sequelize;

if (dbDialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbStorage,
    logging: false
  });
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect,
    dialectOptions: dbDialect === 'mssql' ? {
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true
      }
    } : {},
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

// Fallback SQLite persistente en disco
const sequelizeFallback = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

let activeSequelize = sequelize;

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log(`[Sequelize] Conexión establecida exitosamente con ${dbDialect.toUpperCase()}.`);
    activeSequelize = sequelize;
  } catch (error) {
    console.warn(`[Sequelize] No se pudo conectar a ${dbDialect}. Usando SQLite persistente (database.sqlite)...`);
    try {
      await sequelizeFallback.authenticate();
      activeSequelize = sequelizeFallback;
    } catch (e) {
      console.error('[Sequelize] Error crítico inicializando base de datos:', e);
    }
  }
  return activeSequelize;
}

function getSequelize() {
  return activeSequelize;
}

module.exports = { initDatabase, getSequelize };
