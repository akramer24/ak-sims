const rp = require('request-promise');
const cheerio = require('cheerio');
const { HomeGames, AwayGames, NeutralGames } = require('../server/db/models');

async function getGamesData(table, uri, year) {
  const gamesInDb = await table.count({where: {year}});
  const homeOptions = {
    uri,
    transform: body => {
      return cheerio.load(body);
    }
  };

  const home$ = await rp(homeOptions);
  const totalWinsLossesArray =
    home$('div[class=p402_premium] div')
      .slice(0, 1)
      .text()
      .split(', ');
  let [wins, losses] = totalWinsLossesArray;
  wins = Number(wins.split(' ')[0]);
  losses = Number(losses.split(' ')[0]);
  const totalGames = wins + losses;
  const gamesMissingFromDb = totalGames - gamesInDb;
  const offset = Math.ceil(gamesMissingFromDb / 100) * 100;

  for (let i = 0; i <= offset; i += 100) {
    const uriWithOffset = `${uri.slice(0, uri.indexOf('offset='))}offset=${i}`;
    const matchupPageOptions = {
      uri: uriWithOffset,
      transform: body => {
        return cheerio.load(body);
      }
    }

    const matchup$ = await rp(matchupPageOptions);

    matchup$('tbody tr').each(async function () {
      const rowYear = matchup$(this).find('th').attr('data-stat', 'year_id').text();
      const isRightSeason = rowYear === year;

      if (isRightSeason) {
        const date = matchup$(this).find('td[data-stat=date_game]').text();
        const school = matchup$(this).find('td[data-stat=school_id]').text();
        const opponent = matchup$(this).find('td[data-stat=opp_id]').text();
        const result = matchup$(this).find('td[data-stat=game_result]').text();
        const points = matchup$(this).find('td[data-stat=pts]').text();
        const opponentpoints = matchup$(this).find('td[data-stat=opp_pts]').text();
        const marginofvictory = matchup$(this).find('td[data-stat=mov]').text();
        const game = {
          year: rowYear, date, school, opponent, result, points, opponentpoints, marginofvictory
        };
        const foundGame = await table.findOne({ where: game })
        if (!foundGame) {
          await table.create(game)
        } else {
          return;
        }
      }
    })
  }
}

async function getThisYearsGames() {
  try {
    const start = Date.now();
    await getGamesData(HomeGames, 'https://www.sports-reference.com/cbb/play-index/matchup_finder.cgi?request=1&year_min=2019&year_max=2019&school_id=&opp_id=&game_type=A&game_month=&game_location=H&game_result=&is_overtime=&comp_school=le&comp_opp=le&rank_school=ANY&rank_opp=ANY&order_by=date_game&order_by_asc=&offset=0', '2018-19')
    console.log('Got latest home games data as of: ', new Date());
    await getGamesData(AwayGames, 'https://www.sports-reference.com/cbb/play-index/matchup_finder.cgi?request=1&year_min=2019&year_max=2019&school_id=&opp_id=&game_type=A&game_month=&game_location=A&game_result=&is_overtime=&comp_school=le&comp_opp=le&rank_school=ANY&rank_opp=ANY&order_by=date_game&order_by_asc=&offset=0', '2018-19')
    console.log('Got latest away games data as of: ', new Date());
    await getGamesData(NeutralGames, 'https://www.sports-reference.com/cbb/play-index/matchup_finder.cgi?request=1&year_min=2019&year_max=2019&comp_school=le&rank_school=ANY&comp_opp=le&rank_opp=ANY&game_location=N&game_type=A&order_by=date_game&offset=0', '2018-19')
    console.log('Got latest neutral games data as of: ', new Date());
    const end = Date.now();
    console.log(`Finished getting this year's games' data in ${end - start}ms`);
  } catch (err) {
    console.log(err);
  }
}

async function getLastYearsGames() {
  try {
    const start = Date.now();
    await getGamesData(HomeGames, 'https://www.sports-reference.com/cbb/play-index/matchup_finder.cgi?request=1&year_min=2017&year_max=2018&school_id=&opp_id=&game_type=A&game_month=&game_location=H&game_result=&is_overtime=&comp_school=le&comp_opp=le&rank_school=ANY&rank_opp=ANY&order_by=date_game&order_by_asc=&offset=0', '2017-18')
    console.log('Got last year\'s home games data at: ', new Date());
    await getGamesData(AwayGames, 'https://www.sports-reference.com/cbb/play-index/matchup_finder.cgi?request=1&year_min=2017&year_max=2018&school_id=&opp_id=&game_type=A&game_month=&game_location=A&game_result=&is_overtime=&comp_school=le&comp_opp=le&rank_school=ANY&rank_opp=ANY&order_by=date_game&order_by_asc=&offset=0', '2017-18')
    console.log('Got last year\'s away games data at: ', new Date());
    await getGamesData(NeutralGames, 'https://www.sports-reference.com/cbb/play-index/matchup_finder.cgi?request=1&year_min=2017&year_max=2018&comp_school=le&rank_school=ANY&comp_opp=le&rank_opp=ANY&game_location=N&game_type=A&order_by=date_game&offset=0', '2017-18')
    console.log('Got last year\'s neutral games data at: ', new Date());
    const end = Date.now();
    console.log(`Finished getting this year's games' data in ${end - start}ms`);
  } catch (err) {
    console.log(err);
  }
}

// getThisYearsGames();
// getLastYearsGames();

module.exports = {
  getGamesData,
  getThisYearsGames,
  getLastYearsGames
}