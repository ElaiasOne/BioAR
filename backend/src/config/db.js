// Módulo de conexión e interactividad con la base de datos SQL Server / Memory Store Fallback
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'LaCrujia_3261',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'BioARDB',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true
  }
};

// Almacén en memoria por fallback para desarrollo local sin SQL Server activo
const memoryStore = {
  users: [
    {
      id: 1,
      email: "demo@bioar.me",
      password_hash: "$2a$10$w8T0mK6x.c9Nn3K.gqVlVOjXFzH9g5wF/N3wO4G2.YJ/U8xM1P2vG", // bcrypt "123456"
      plan: "free",
      custom_slug: "demo",
      display_name: "Alex Rivera",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      bio_text: "Bienvenido a mi BioAR oficial | Encuentra todos mis enlaces y contenidos aquí",
      seo_title: "Alex Rivera - BioAR Oficial",
      seo_description: "Página oficial de enlaces, proyectos y redes de Alex Rivera.",
      created_at: new Date()
    }
  ],
  blocks: [
    {
      id: 1,
      user_id: 1,
      type: "featured_card",
      position: 1,
      content_json: JSON.stringify({
        title: "Proyecto Destacado",
        subtitle: "Novedades 2026",
        coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
        description: "Haz clic para acceder al contenido principal.",
        actionUrl: "https://bioar.me",
        actionText: "Ver Más Información"
      })
    },
    {
      id: 2,
      user_id: 1,
      type: "social_links",
      position: 2,
      content_json: JSON.stringify([
        { id: "1", platform: "instagram", title: "Instagram", url: "https://instagram.com", icon: "Instagram" },
        { id: "2", platform: "youtube", title: "YouTube", url: "https://youtube.com", icon: "Youtube" },
        { id: "3", platform: "mail", title: "Contacto / Email", url: "mailto:contacto@ejemplo.com", icon: "Mail" }
      ])
    }
  ],
  settings: {
    1: {
      background_color: "#0f172a",
      background_type: "solid",
      text_color: "#ffffff",
      button_style: "rounded",
      button_color: "#3b82f6",
      button_text_color: "#ffffff",
      font_family: "Inter",
      show_branding: true
    }
  }
};

let pool = null;
let isConnectedToSql = false;

async function getPool() {
  if (pool && isConnectedToSql) return pool;
  try {
    pool = await sql.connect(config);
    isConnectedToSql = true;
    console.log('[DB] Conectado a SQL Server exitosamente.');
    return pool;
  } catch (err) {
    console.warn('[DB] SQL Server no disponible en este ambiente. Usando modo de persistencia en memoria.');
    isConnectedToSql = false;
    return null;
  }
}

module.exports = {
  sql,
  getPool,
  memoryStore,
  isSqlActive: () => isConnectedToSql
};
