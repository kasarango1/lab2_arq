require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // Desactivar logs SQL para reducir ruido
  define: {
    charset: 'utf8mb4',
  },
  dialectOptions: {
    charset: 'utf8mb4',
  }
});

module.exports = sequelize;
