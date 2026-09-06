// Modelo Sequelize de Configuración de Estilos/Diseño de Usuario
const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');

function defineUserSettingModel() {
  const sequelize = getSequelize();
  return sequelize.define('UserSetting', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    background_color: {
      type: DataTypes.STRING(50),
      defaultValue: '#09090b'
    },
    background_type: {
      type: DataTypes.STRING(50),
      defaultValue: 'solid'
    },
    text_color: {
      type: DataTypes.STRING(50),
      defaultValue: '#ffffff'
    },
    button_style: {
      type: DataTypes.STRING(50),
      defaultValue: 'rounded'
    },
    button_color: {
      type: DataTypes.STRING(50),
      defaultValue: '#18181b'
    },
    button_text_color: {
      type: DataTypes.STRING(50),
      defaultValue: '#ffffff'
    },
    font_family: {
      type: DataTypes.STRING(50),
      defaultValue: 'Inter'
    },
    show_branding: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'UserSettings',
    timestamps: false
  });
}

module.exports = defineUserSettingModel;
