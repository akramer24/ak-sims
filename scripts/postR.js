const insertRankings = require('./getRankingsHistory');
const getLines = require('./getLines');
const moment = require('moment-timezone');
const { dateFormat } = require('../utils/appVariables');
const { compileAKSimsRecord } = require('./getDateRecord');

async function postR() {
  try {
    await insertRankings();
    console.log('Inserted yesterday\'s rankings at', new Date());
    console.log('Yesterday\'s record:');
    const yesterday = moment().subtract(1, 'days').format(dateFormat);
    await compileAKSimsRecord(yesterday);
    console.log('Overall record:');
    await compileAKSimsRecord();
    await getLines();
    console.log('Got latest lines at', new Date());
    console.log('Done with post-R update');
  } catch (err) {
    console.log(err)
  }
  process.exit();
}

postR();
module.exports = postR;