const db = require('../db');
const Sequelize = require('sequelize');

const RankingsHistory = db.define('rankingsHistory', {
  date: Sequelize.STRING,
  rankings: Sequelize.JSON
})

module.exports = RankingsHistory;