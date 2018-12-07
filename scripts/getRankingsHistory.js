const { SchoolQuality, RankingsHistory } = require('../server/db/models');
const moment = require('moment-timezone');
const { dateFormat } = require('../utils/appVariables');

async function insertRankings() {
  try {
    const schools = await SchoolQuality.findAll({
      order: [
        ['schoolquality', 'DESC']
      ],
      attributes: ['school']
    });
    const rankings = {};
    schools.forEach((school, idx) => {
      rankings[school.dataValues.school] = idx + 1;
    })
    const date = moment().format(dateFormat);
    const instance = await RankingsHistory.findOne({
      where: { date }
    });

    if (!instance) {
      await RankingsHistory.create({
        date,
        rankings
      })
    }
  } catch (err) {
    console.log(err);
  }
}
// insertRankings()

async function getRankingsOfDate(date) {
  date = date ? date : moment().subtract(1, 'days').format(dateFormat);
  const rankings = await RankingsHistory.findOne({
    where: { date }
  });
  console.log(rankings.dataValues.rankings);
}

// insertRankings()
getRankingsOfDate()

module.exports = insertRankings;