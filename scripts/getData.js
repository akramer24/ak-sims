const { getThisYearsGames } = require('./getMatchups');
const getSchools = require('./getSchools');
const { updateLinesWithResults } = require('./getDateRecord');

const getData = async () => {
  const start = Date.now();
  try {
    await getThisYearsGames();
    await getSchools();
    console.log('Got latest school data as of: ', new Date());
    await updateLinesWithResults();
    const end = Date.now();
    console.log(`Finished getting data in ${end - start} ms.`);
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

getData();