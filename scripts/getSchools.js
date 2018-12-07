const rp = require('request-promise');
const cheerio = require('cheerio');
const { SchoolStandings } = require('../server/db/models');

async function getSchools() {
  const options = {
    uri: 'https://www.sports-reference.com/cbb/seasons/2019-ratings.html',
    transform: body => {
      return cheerio.load(body);
    }
  };

  const $ = await rp(options);
  $('tr').each(async function () {
    let school = $(this).find('td[data-stat=school_name]').text();
    if (school) {
      if (school === 'VMI') school = 'Virginia Military Institute';
      if (school === 'SIU Edwardsville') school = 'Southern Illinois-Edwardsville'
      const conf = $(this).find('td[data-stat=conf_abbr]').text();
      const wins = Number($(this).find('td[data-stat=wins]').text());
      const losses = Number($(this).find('td[data-stat=losses]').text());
      const winningPercentage = wins / (wins + losses);
      const schoolData = { school, conf, winningPercentage, wins, losses };
      try {
        const instance = await SchoolStandings.findOne({
          where: {
            school
          }
        })
        if (instance) {
          await instance.update(schoolData);
        } else {
          SchoolStandings.create(schoolData);
        }
      } catch (err) {
        console.log(err)
      }
    }
  })
}

module.exports = getSchools;

// getSchools()
//   .then(() => console.log('Got latest school data as of: ', new Date()))
//   .catch(console.log)