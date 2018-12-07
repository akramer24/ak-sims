const router = require('express').Router();
const {SchoolQuality, SchoolStandings, RankingsHistory} = require('../db/models');
const formatNumberDecimals = require('../utils/formatNumberDecimals');
const { dateFormat } = require('../../utils/appVariables');

const moment = require('moment-timezone');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const schoolQualities = await SchoolQuality.findAll({
      order: [
        ['schoolquality', 'DESC']
      ],
      attributes: [['school', 'School'], ['schoolquality', 'Quality'], ['schoolqualitysd', 'Std. Deviation']]
    });

    const schoolStandings = await SchoolStandings.findAll();
    const yesterday = moment().subtract(1, 'days').format(dateFormat);
    const rankingsHistory = await RankingsHistory.findOne({
      where: { date: yesterday }
    });

    const schools = schoolQualities.map((school, idx) => {
      const match = schoolStandings.find(s => s.dataValues.school === school.dataValues.School);
      const orderedSchool = {};
      const rank = idx + 1;
      const prev = rankingsHistory.dataValues.rankings[school.dataValues.School];
      const chg = prev - rank;
      if (match) {
        orderedSchool.RK = {content: rank, width: '5%'}
        orderedSchool.PREV = {content: prev, width: '5%'}
        orderedSchool.CHG = {content: chg, width: '5%'}
        orderedSchool.SCHOOL = {content: school.dataValues.School, width: '25%'}
        orderedSchool.CONF = {content: match.dataValues.conf, 'width': '13%'}
        orderedSchool.QUALITY = {content: Number(formatNumberDecimals(school.dataValues.Quality)), width: '12%'}
        orderedSchool['STD. DEV.'] = {content: Number(formatNumberDecimals(school.dataValues['Std. Deviation'])), width: '11%'}
        orderedSchool.W = {content: match.dataValues.wins, width: '7%'}
        orderedSchool.L = {content: match.dataValues.losses, width: '7%'}
        orderedSchool['W%'] = {content: formatNumberDecimals(match.dataValues.winningPercentage), width: '10%'}
      }
      return orderedSchool;
    })
    res.json(schools)
  } catch (err) {
    next(err)
  }
})