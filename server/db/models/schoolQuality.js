const db = require('../db');
const Sequelize = require('sequelize');

const SchoolQuality = db.define('schoolquality', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  school: Sequelize.STRING,
  schoolid: Sequelize.INTEGER,
  schoolquality: Sequelize.FLOAT,
  schoolqualitysd: Sequelize.FLOAT,
}, {
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = SchoolQuality;