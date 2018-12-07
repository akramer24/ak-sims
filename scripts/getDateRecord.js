const { Lines, AwayGames, NeutralGames } = require('../server/db/models');
const moment = require('moment-timezone');
const { dateFormat } = require('../utils/appVariables');

async function insertDateRecord(table, date) {
  date = date ? date : moment().subtract(1, 'days').format(dateFormat);
  const games = await table.findAll({
    where: {
      date
    }
  });

  for (let i = 0; i < games.length; i++) {
    const {
      school,
      opponent,
      marginofvictory,
      points,
      opponentpoints
    } = games[i].dataValues;
    const finalTotalPoints = Number(points) + Number(opponentpoints);
    const awayMOV = Number(marginofvictory);
    const homeMOV = -Number(marginofvictory);
    const line = await Lines.findOne({
      where: {
        date,
        away: school,
        home: opponent
      }
    })
    if (line) {
      await line.update({ awayMOV, homeMOV, finalTotalPoints })
    }
  }
}

async function updateLinesWithResults(date) {
  await insertDateRecord(AwayGames, date);
  console.log(`Placed non-neutral results in Lines table at ${new Date()}`)
  await insertDateRecord(NeutralGames, date)
  console.log(`Placed away results in Lines table at ${new Date()}`)
}

// updateLinesWithResults()

async function compileAKSimsRecord(date) {
  let lines;
  if (date) {
    lines = await Lines.findAll({ where: { date } })
  } else {
    lines = await Lines.findAll();
  }

  const record = {
    atsWins: 0,
    atsLosses: 0,
    atsPushes: 0,
    ouWins: 0,
    ouLosses: 0,
    ouPushes: 0,
    spreadDiffRanges: {
      '0-1': {
        wins: 0,
        losses: 0,
        pushes: 0
      },
      '1-3': {
        wins: 0,
        losses: 0,
        pushes: 0
      },
      '3-5': {
        wins: 0,
        losses: 0,
        pushes: 0
      },
      '5-7': {
        wins: 0,
        losses: 0,
        pushes: 0
      },
      '7+': {
        wins: 0,
        losses: 0,
        pushes: 0
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let {
      away,
      home,
      spread,
      ou,
      awayMOV,
      homeMOV,
      finalTotalPoints,
      atsPickTeam,
      atsPickSpread,
      atsPickOU,
      spreadDiff
    } = line.dataValues;
    spread = Number(spread);
    ou = Number(ou);
    spreadDiff = Math.abs(spreadDiff);

    if (awayMOV && homeMOV && finalTotalPoints) {
      if (atsPickTeam === away) {
        if (awayMOV + atsPickSpread === 0) {
          record.atsPushes = record.atsPushes + 1;
          record.spreadDiffRanges = getSpreadDiffRanges(record.spreadDiffRanges, 'pushes', spreadDiff);
        } else if (
          // won as underdog
          (awayMOV > 0 && atsPickSpread > 0) ||
          // won as favorite and won by more than spread
          (awayMOV > 0 && atsPickSpread < 0 && awayMOV + atsPickSpread > 0) ||
          // lost (as underdog implied because cannot lose as favorite and cover) but lost by less than spread
          (awayMOV < 0 && awayMOV + atsPickSpread > 0)
        ) {
          record.atsWins = record.atsWins + 1;
          record.spreadDiffRanges = getSpreadDiffRanges(record.spreadDiffRanges, 'wins', spreadDiff);
        } else {
          record.atsLosses = record.atsLosses + 1;
          record.spreadDiffRanges = getSpreadDiffRanges(record.spreadDiffRanges, 'losses', spreadDiff);
        }
      } else if (atsPickTeam === home) {
        if (homeMOV + atsPickSpread === 0) {
          record.atsPushes = record.atsPushes + 1;
          record.spreadDiffRanges = getSpreadDiffRanges(record.spreadDiffRanges, 'pushes', spreadDiff);
        } else if (
          // won as underdog
          (homeMOV > 0 && atsPickSpread > 0) ||
          // won as favorite and won by more than spread
          (homeMOV > 0 && atsPickSpread < 0 && homeMOV + atsPickSpread > 0) ||
          // lost (as underdog implied because cannot lose as favorite and cover) but lost by less than spread
          (homeMOV < 0 && homeMOV + atsPickSpread > 0)
        ) {
          record.atsWins = record.atsWins + 1;
          record.spreadDiffRanges = getSpreadDiffRanges(record.spreadDiffRanges, 'wins', spreadDiff);
        } else {
          record.atsLosses = record.atsLosses + 1;
          record.spreadDiffRanges = getSpreadDiffRanges(record.spreadDiffRanges, 'losses', spreadDiff);
        }
      }

      if (ou !== '-' && atsPickOU !== '-') {
        if ((atsPickOU === 'O' && finalTotalPoints > ou) || (atsPickOU === 'U' && finalTotalPoints < ou)) {
          record.ouWins = record.ouWins + 1;
        } else if ((atsPickOU === 'O' && finalTotalPoints < ou) || (atsPickOU === 'U' && finalTotalPoints > ou)) {
          record.ouLosses = record.ouLosses + 1;
        } else {
          record.ouPushes = record.ouPushes + 1;
        }
      }
    }
  }
  const { atsWins, atsLosses, atsPushes, ouWins, ouLosses, ouPushes } = record;
  record.atsWinningPercentage = atsWins / (atsWins + atsLosses + atsPushes);
  record.ouWinningPercentage = ouWins / (ouWins + ouLosses + ouPushes);
  console.log(record);
}

// compileAKSimsRecord();

function getSpreadDiffRanges(spreadDiffRanges, result, spreadDiff) {
  if (spreadDiff < 1) {
    spreadDiffRanges['0-1'][result]++;
  } else if (spreadDiff >= 1 && spreadDiff < 3) {
    spreadDiffRanges['1-3'][result]++;
  } else if (spreadDiff >= 3 && spreadDiff < 5) {
    spreadDiffRanges['3-5'][result]++;
  } else if (spreadDiff >= 5 && spreadDiff < 7) {
    spreadDiffRanges['5-7'][result]++;
  } else if (spreadDiff >= 7) {
    spreadDiffRanges['7+'][result]++;
  }
  return spreadDiffRanges;
}

module.exports = {
  updateLinesWithResults, compileAKSimsRecord
};

// async function updateOldLines() {
//   try {
//     const lines = await Lines.findAll();
//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i];
//       const { spreadDiff, away, home, spread, aksimsOU, ou } = line.dataValues;
//       const atsPickTeam = spreadDiff > 0 ? away : home;
//       const atsPickSpread = spreadDiff > 0 ? Number(spread) : -Number(spread);
//       const atsPickOU =
//         ou !== '-'
//           ? ou - aksimsOU > 0
//             ? 'U'
//             : 'O'
//           : '-';
//       await line.update({atsPickTeam, atsPickSpread, atsPickOU});
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

// updateOldLines();