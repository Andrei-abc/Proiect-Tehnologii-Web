const { Sequelize } = require('sequelize');

// Configure Sequelize pentru SQLite
// Folosim fisier local pentru stocare a datelor (database.sqlite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Exportam instanta Sequelize pentru a fi folosita in modele si server
module.exports = sequelize;