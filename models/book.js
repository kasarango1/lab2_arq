const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING(50),
  },
  year: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Book;
