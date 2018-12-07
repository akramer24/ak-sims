const db = require('../db');
const Sequelize = require('sequelize');

const Lines = db.define('lines', {
  date: Sequelize.STRING,
  time: Sequelize.STRING,
  away: Sequelize.STRING,
  home: Sequelize.STRING,
  awayMoneyline: Sequelize.STRING,
  homeMoneyline: Sequelize.STRING,
  spread: Sequelize.STRING,
  vig: Sequelize.STRING,
  spreadDiff: Sequelize.FLOAT,
  ou: Sequelize.STRING,
  aksimsSpread: Sequelize.STRING,
  aksimsOU: Sequelize.STRING,
  aksimsWinAvg: Sequelize.STRING,
  awayMOV: Sequelize.INTEGER,
  homeMOV: Sequelize.INTEGER,
  finalTotalPoints: Sequelize.FLOAT,
  atsPickTeam: Sequelize.STRING,
  atsPickSpread: Sequelize.FLOAT,
  atsPickOU: Sequelize.STRING
})

module.exports = Lines;