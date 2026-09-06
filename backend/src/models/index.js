// Módulo central de inicialización de Modelos y Relaciones con Sequelize
const bcrypt = require('bcryptjs');
const { initDatabase, getSequelize } = require('../config/database');
const defineUserModel = require('./User');
const defineBlockModel = require('./Block');
const defineUserSettingModel = require('./UserSetting');

let User, Block, UserSetting;

async function setupModels() {
  await initDatabase();
  const sequelize = getSequelize();

  User = defineUserModel();
  Block = defineBlockModel();
  UserSetting = defineUserSettingModel();

  // Relaciones ORM
  User.hasMany(Block, { foreignKey: 'user_id', as: 'blocks', onDelete: 'CASCADE' });
  Block.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  User.hasOne(UserSetting, { foreignKey: 'user_id', as: 'settings', onDelete: 'CASCADE' });
  UserSetting.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  await sequelize.sync();
  await seedDemoUser();

  return { User, Block, UserSetting };
}

async function seedDemoUser() {
  try {
    const count = await User.count();
    if (count === 0) {
      const passwordHash = await bcrypt.hash('123456', 10);
      const demoUser = await User.create({
        email: 'demo@bioar.me',
        password_hash: passwordHash,
        plan: 'free',
        custom_slug: 'demo',
        display_name: 'Alex Rivera',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        bio_text: 'Bienvenido a mi BioAR oficial | Encuentra todos mis enlaces y contenidos aquí',
        seo_title: 'Alex Rivera - BioAR Oficial',
        seo_description: 'Página oficial de enlaces, proyectos y redes de Alex Rivera.'
      });

      await UserSetting.create({
        user_id: demoUser.id,
        background_color: '#09090b',
        background_type: 'solid',
        text_color: '#ffffff',
        button_style: 'rounded',
        button_color: '#18181b',
        button_text_color: '#ffffff',
        font_family: 'Inter',
        show_branding: true
      });

      await Block.create({
        user_id: demoUser.id,
        type: 'featured_card',
        position: 1,
        content_json: JSON.stringify({
          title: "Proyecto Destacado",
          subtitle: "Novedades 2026",
          coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
          description: "Haz clic para acceder al contenido principal.",
          actionUrl: "https://bioar.me",
          actionText: "Ver Más Información"
        })
      });

      await Block.create({
        user_id: demoUser.id,
        type: 'social_links',
        position: 2,
        content_json: JSON.stringify([
          { id: "1", platform: "instagram", title: "Instagram", url: "https://instagram.com", icon: "Instagram" },
          { id: "2", platform: "youtube", title: "YouTube", url: "https://youtube.com", icon: "Youtube" },
          { id: "3", platform: "mail", title: "Contacto / Email", url: "mailto:contacto@ejemplo.com", icon: "Mail" }
        ])
      });

      console.log('[Sequelize] Usuario demo genérico registrado correctamente.');
    }
  } catch (err) {
    console.error('Error al inicializar seed data:', err);
  }
}

function getModels() {
  return { User, Block, UserSetting };
}

module.exports = { setupModels, getModels };
