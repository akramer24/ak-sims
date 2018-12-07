import React, { Component } from 'react';
import moment from 'moment-timezone';

import convertDecimalToPercentage from './utils/convertDecimalToPercentage';
import { aksimsDisplayNames } from '../../utils/teamNamesMaps';

class LinesCard extends Component {
  constructor() {
    super();
    this.state = {
      showDetails: false,
      preFirstToggle: true
    }
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails() {
    const { showDetails } = this.state;
    this.setState({ showDetails: !showDetails, preFirstToggle: false });
  }

  render() {
    const { lineInfo } = this.props;
    const { showDetails, preFirstToggle } = this.state;
    const date = moment(lineInfo.date).format('LL');
    let time;
    if (lineInfo.time.length > 5) {
      time = lineInfo.time;
    } else {
      const [minutes] = lineInfo.time.split(':');
      time = `Starts in ${minutes[0] === '0' ? minutes[1] : minutes} minutes.`
    }
    const awayWinPercentage = convertDecimalToPercentage(lineInfo.aksimsWinAvg);
    // In weird random cases, JS adds many decimals so we cut it off.
    const homeWinPercentage = (100 - Number(awayWinPercentage.slice(0, -1))).toString().slice(0, 4) + '%';
    const aksimsSpread = lineInfo.aksimsSpread;
    const ou = lineInfo.ou !== '-' ? Number(lineInfo.ou) : 'n/a';
    const akSimsOU = Math.round(10 * Number(lineInfo.aksimsOU)) / 10;
    const awayTeam = aksimsDisplayNames[lineInfo.away] ? aksimsDisplayNames[lineInfo.away] : lineInfo.away;
    const homeTeam = aksimsDisplayNames[lineInfo.home] ? aksimsDisplayNames[lineInfo.home] : lineInfo.home;
    const mlPick =
      Number(awayWinPercentage.slice(0, -1)) - Number(homeWinPercentage.slice(0, -1)) > 0
        ? awayTeam
        : homeTeam;
    const atsPick = lineInfo.spreadDiff < 0 ? homeTeam : awayTeam;
    const ouPick =
      ou !== 'n/a'
        ? ou - akSimsOU > 0
          ? `U ${ou}`
          : `O ${ou}`
        : 'n/a';
    const lineInfoVisibilityClassName =
      showDetails
        ? 'lines-card-line-info-visible'
        : preFirstToggle
          ? ''
          : 'lines-card-line-info-hidden';
    return (
      <div className="lines-card">
        <div className="lines-card-time-info">
          <p className="lines-card-date">{date}</p>
          <p className="lines-card-time">{time}</p>
        </div>
        <div className="lines-card-info-wrapper">
          <div className="lines-card-team-info-wrapper">
            <div className="lines-card-team-info">
              <div>
                <p>{awayTeam} <span className="lines-card-spread">({lineInfo.spread})</span></p>
              </div>
              <div>
                <p>@</p>
              </div>
              <div>
                <p>{homeTeam}</p>
              </div>
            </div>
            <div className="lines-card-value-pick-wrapper">
              <p className="lines-card-value-pick">AK-Sims Winner: <span>{mlPick}</span></p>
              <p className="lines-card-value-pick">AK-Sims ATS: <span>{atsPick}</span></p>
              <div className="lines-card-value-pick-last-row">
                <p className="lines-card-value-pick-space-filler">&nbsp;</p>
                <p className="lines-card-value-pick">AK-Sims o/u: <span>{ouPick}</span></p>
                <p
                  className="lines-card-value-pick-toggle"
                  onClick={this.toggleDetails}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </p>
              </div>
            </div>
          </div>
          <div className={`lines-card-line-info ${lineInfoVisibilityClassName}`}>
            <div className="lines-card-team-box">
              <p className="lines-card-moneyline">ML: <span className="lines-card-value">{lineInfo.awayMoneyline}</span></p>
              <p className="lines-card-win-percentage">AK-Sims: <span className="lines-card-value">{awayWinPercentage}</span></p>
            </div>
            <div className="lines-card-spread-info">
              <p>&nbsp;</p>
              <p className="lines-card-aksims-spread">
                AK-Sims: <span className="lines-card-value">{aksimsSpread[0] + Math.round(10 * Number(aksimsSpread.slice(1))) / 10}</span>
              </p>
              <p className="lines-card-ou">o/u: <span className="lines-card-value">{ou}</span></p>
              <p className="lines-card-aksims-ou">AK-Sims o/u: <span className="lines-card-value">{akSimsOU}</span></p>
            </div>
            <div className="lines-card-team-box">
              <p className="lines-card-moneyline">ML: <span className="lines-card-value">{lineInfo.homeMoneyline}</span></p>
              <p className="lines-card-win-percentage">AK-Sims: <span className="lines-card-value">{homeWinPercentage}</span></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LinesCard;