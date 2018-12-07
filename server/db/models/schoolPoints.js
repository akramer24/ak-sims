const db = require('../db');
const Sequelize = require('sequelize');

const SchoolPoints = db.define('schoolpoints', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  school: Sequelize.STRING,
  schoolid: Sequelize.INTEGER,
  schoolpoints: Sequelize.FLOAT,
  schoolpointssd: Sequelize.FLOAT,
}, {
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = SchoolPoints;