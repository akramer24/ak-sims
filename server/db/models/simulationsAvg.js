const db = require('../db');
const Sequelize = require('sequelize');

const SimulationsAvg = db.define('simulations_avg', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  school: Sequelize.STRING,
  home: Sequelize.STRING,
  opponentid: Sequelize.INTEGER,
  opponent: Sequelize.STRING,
  sim_scorediff_avg: Sequelize.FLOAT,
  sim_points_avg: Sequelize.FLOAT,
  sim_schoolpoints_avg: Sequelize.FLOAT,
  sim_opponentpoints_avg: Sequelize.FLOAT,
  sim_win_avg: Sequelize.FLOAT
}, {
    timestamps: false,
    freezeTableName: true,
    underscored: true
  }
);

module.exports = SimulationsAvg;