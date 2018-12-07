const db = require('../db');
const Sequelize = require('sequelize');

const AwayGames = db.define('awaygames', {
  year: Sequelize.STRING,
  date: Sequelize.STRING,
  school: Sequelize.STRING,
  opponent: Sequelize.STRING,
  result: Sequelize.STRING,
  points: Sequelize.STRING,
  opponentpoints: Sequelize.STRING,
  marginofvictory: Sequelize.STRING
});

module.exports = AwayGames;