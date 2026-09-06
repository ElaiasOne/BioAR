// Script de creación y sincronización automática de Base de Datos en SQL Server
require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbHost = process.env.DB_SERVER || 'localhost';
const dbName = process.env.DB_NAME || 'BioARDB';
const dbUser = process.env.DB_USER || 'sa';
const dbPassword = process.env.DB_PASSWORD || 'LaCrujia_3261';
const dbPort = parseInt(process.env.DB_PORT || '1433', 10);
const dbEncrypt = process.env.DB_ENCRYPT === 'true';

async function ensureDatabaseExists() {
  console.log(`[DB Init] Conectando a SQL Server (${dbHost}:${dbPort}) como usuario '${dbUser}'...`);

  // Conectar a la base de datos de sistema 'master' para verificar/crear la base de datos del proyecto
  const masterSequelize = new Sequelize('master', dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: dbEncrypt,
        trustServerCertificate: true
      }
    },
    logging: false
  });

  try {
    await masterSequelize.authenticate();
    console.log('[DB Init] Conexión con SQL Server establecida.');

    // Verificar si la base de datos existe
    const [results] = await masterSequelize.query(
      `SELECT name FROM sys.databases WHERE name = '${dbName}'`
    );

    if (results.length === 0) {
      console.log(`[DB Init] La base de datos '${dbName}' no existe. Creándola en SQL Server...`);
      await masterSequelize.query(`CREATE DATABASE [${dbName}]`);
      console.log(`[DB Init] ¡Base de datos '${dbName}' creada con éxito!`);
    } else {
      console.log(`[DB Init] La base de datos '${dbName}' ya existe.`);
    }
  } catch (error) {
    console.error('[DB Init] Error al verificar/crear la base de datos en SQL Server:', error.message);
    throw error;
  } finally {
    await masterSequelize.close();
  }
}

async function syncModelsAndSeed() {
  const { setupModels } = require('../models');
  const { getSequelize } = require('../config/database');

  await setupModels();
  const sequelize = getSequelize();

  console.log('[DB Init] Sincronizando estructura de tablas con SQL Server...');
  await sequelize.sync();

  console.log('[DB Init] ¡Estructura de tablas sincronizada correctamente!');
}

async function run() {
  try {
    await ensureDatabaseExists();
    await syncModelsAndSeed();
    console.log('[DB Init] Base de datos de BioAR 100% lista para ser utilizada.');
    process.exit(0);
  } catch (err) {
    console.error('[DB Init] Falló la inicialización de la base de datos:', err);
    process.exit(1);
  }
}

run();
