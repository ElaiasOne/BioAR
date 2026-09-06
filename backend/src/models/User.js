// Modelo Sequelize de Usuario
const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');

function defineUserModel() {
  const sequelize = getSequelize();
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plan: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'free'
    },
    custom_slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    display_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    bio_text: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    seo_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    seo_description: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
}

module.exports = defineUserModel;
