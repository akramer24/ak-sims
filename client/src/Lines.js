import React, { Component } from 'react';
import { Dropdown, LinesCard } from './index';
import load from './hocs/load';

class Lines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: props.data.sort((a, b) => {
        const aContent = Math.abs(a.spreadDiff);
        const bContent = Math.abs(b.spreadDiff);
        if (aContent > bContent) return -1;
        if (aContent < bContent) return 1;
        return 0;
      }),
      sortedBy: 'Best Value'
    }
    this.sortBy = this.sortBy.bind(this);
  }

  sortBy(col) {
    const { lines } = this.state;
    const dbCol = col === 'Best Value' ? 'spreadDiff' : 'time';
    const sortedLines = lines.sort((a, b) => {
      let aContent = a[dbCol];
      let bContent = b[dbCol];
      if (dbCol === 'spreadDiff') {
        aContent = Math.abs(a[dbCol]);
        bContent = Math.abs(b[dbCol]);
        if (aContent > bContent) return -1;
        if (aContent < bContent) return 1;
      } else {
        if (aContent < bContent) return -1;
        if (aContent > bContent) return 1;
      }
      return 0;
    })
    this.setState({ lines: sortedLines, sortedBy: col });
  }

  render() {
    const { lines, sortedBy } = this.state;
    const dropdownOptions = [
      'Best Value',
      'Time'
    ];

    return (
      <div className="lines-page">
        <div className="sorted-by">
          <Dropdown
            openDropdownTitle="Sort by"
            options={dropdownOptions}
            onOptionClick={this.sortBy}
            title={sortedBy}
            type="select"
            width={100}
          />
        </div>
        <div className="lines">
          {
            lines.map(line => <LinesCard key={line.id} lineInfo={line} />)
          }
        </div>
      </div>
    )
  }
}

export default load(Lines);