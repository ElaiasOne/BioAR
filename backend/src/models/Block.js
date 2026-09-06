// Modelo Sequelize de Bloque de Contenido
const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');

function defineBlockModel() {
  const sequelize = getSequelize();
  return sequelize.define('Block', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    content_json: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'Blocks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
}

module.exports = defineBlockModel;
