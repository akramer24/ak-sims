const db = require('../db');
const Sequelize = require('sequelize');

const SchoolStandings = db.define('schoolStandings', {
  school: Sequelize.STRING,
  conf: Sequelize.STRING,
  wins: Sequelize.INTEGER,
  losses: Sequelize.INTEGER,
  winningPercentage: Sequelize.STRING
});

module.exports = SchoolStandings;