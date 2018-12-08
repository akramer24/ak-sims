const rp = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment-timezone');
const {topBetMap} = require('../utils/teamNamesMaps');
const { Lines, SimulationsAvg } = require('../server/db/models');
const { dateFormat } = require('../utils/appVariables');

async function getLines() {
  const options = {
    uri: 'https://topbet.eu/sportsbook/basketball/ncaa-mens',
    transform: body => {
      return cheerio.load(body);
    }
  };

  const $ = await rp(options);
  $('.gamelines-details').each(function () {
    const countdown = $(this).find('.countdown').text().trim();
    const date =
      countdown.length > 5
        ? countdown.slice(0, 10)
        : moment(new Date())
          .tz('America/New_York')
          .format(dateFormat);
    const time = countdown.length === 5 ? countdown : countdown.slice(10);
    let away;
    let home;
    let awayMoneyline;
    let homeMoneyline;
    let spread;
    let vig;
    let ou;
    $(this).find('.gamelines-team').each(async function (idx) {
      try {
        if (idx === 0) {
          away = $(this).find('.team-title').text().trim();
        } else {
          home = $(this).find('.team-title').text().trim();
        }
        $(this).find('.market.bet-text').each(function (textIdx) {
          if (idx === 0 && textIdx === 0) {
            awayMoneyline = $(this).text().trim();
          } else if (idx === 0 && textIdx === 1) {
            $(this).find('span').each(function (spanIdx) {
              if (spanIdx === 0) {
                spread = $(this).text().trim();
              } else {
                vig = $(this).text().trim();
              }
            })
          } else if (idx === 0 && textIdx === 2) {
            $(this).find('span').each(function (spanIdx) {
              if (spanIdx === 0) {
                const ouText = $(this).text().trim();
                const ouIdx = ouText.indexOf('1');
                ou = ouText.slice(ouIdx, ouIdx + 5)
                ou = ou ? ou : '-';
              }
            })
          } else if (idx === 1 && textIdx === 0) {
            homeMoneyline = $(this).text().trim();
          }
        })
        if (idx === 1) {
          const school = topBetMap[away] ? topBetMap[away] : away;
          const opponent = topBetMap[home] ? topBetMap[home] : home;
          const aksims = await SimulationsAvg.findOne({
            where: {
              school,
              opponent,
              home: '0'
            }
          });

          const aksimsSpread =
            aksims.sim_scorediff_avg < 0
              ? '+' + ((aksims.sim_scorediff_avg) * -1)
              : '-' + aksims.sim_scorediff_avg
          const aksimsOU = aksims.sim_points_avg.toString();
          const aksimsWinAvg = aksims.sim_win_avg.toString();
          const spreadDiff = Number(spread) - Number(aksimsSpread);
          const atsPickTeam = spreadDiff > 0 ? school : opponent;
          const atsPickSpread = spreadDiff > 0 ? Number(spread) : -Number(spread);
          // make sure ou is never undefined
          ou = ou ? ou : '-'
          const atsPickOU =
            ou !== '-'
              ? ou - aksimsOU > 0
                ? 'U'
                : 'O'
              : '-';

          const instance = await Lines.findOne({
            where: {
              date, away: school, home: opponent
            }
          });

          if (instance) {
            await instance.update({
              awayMoneyline,
              homeMoneyline,
              spread,
              vig,
              ou,
              spreadDiff,
              aksimsSpread,
              aksimsOU,
              aksimsWinAvg,
              atsPickOU,
              atsPickSpread,
              atsPickTeam
            })
          } else {
            await Lines.create({
              date,
              time,
              away: school,
              home: opponent,
              awayMoneyline,
              homeMoneyline,
              spread,
              vig,
              ou,
              spreadDiff,
              aksimsSpread,
              aksimsOU,
              aksimsWinAvg,
              atsPickOU,
              atsPickSpread,
              atsPickTeam
            })
          }
        }
      } catch (err) {
        console.log(err)
      }
    })
  })
}

module.exports = getLines;
getLines()
  .then(() => {
    console.log('Got latest lines as of: ', new Date());
    process.exit();
  })
  .catch(console.log)