import React, { Component } from 'react';
import { LoadingSpinner, Input } from './index';
import axios from 'axios';
import classNames from 'classnames';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredData: [],
      sortedBy: {},
      searchValidationError: ''
    };
    this.renderHeaderRows = this.renderHeaderRows.bind(this);
    this.renderContentRows = this.renderContentRows.bind(this);
    this.sortData = this.sortData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.data = [];
  }

  componentDidMount() {
    axios.get('/api/data/school-quality')
      .then(res => {
        this.setState({ filteredData: res.data });
        this.data = res.data;
      })
      .catch(console.log)
  }

  sortData(col) {
    const { filteredData, sortedBy } = this.state;
    const isAscending = sortedBy.col === col ? !sortedBy.order : true;
    const sortAscending = (col1, col2) => {
      if (col1.content < col2.content) { return -1; }
      if (col1.content > col2.content) { return 1; }
      return 0;
    };
    const sortDescending = (col1, col2) => {
      if (col1.content > col2.content) { return -1; }
      if (col1.content < col2.content) { return 1; }
      return 0;
    };

    // We want strings to be sorted A-z first and numbers
    // sorted from highest to lowest first
    const newData =
      isAscending
        ?
        filteredData.sort((a, b) => {
          if (typeof a[col].content === 'number') {
            return sortDescending(a[col], b[col])
          } else {
            return sortAscending(a[col], b[col])
          }
        })
        :
        filteredData.sort((a, b) => {
          if (typeof a[col].content === 'number') {
            return sortAscending(a[col], b[col])
          } else {
            return sortDescending(a[col], b[col])
          }
        })
    this.setState({ filteredData: newData, sortedBy: { col, order: isAscending } })
  }

  renderHeaderRows() {
    const headers = [];
    const row = this.state.filteredData[0];
    for (let colName in row) {
      if (colName !== 'id') {
        headers.push(
          <td
            key={colName}
            style={{ width: row[colName].width }}
            className="table-row-item"
            onClick={() => this.sortData(colName)}
          >
            {colName}
          </td>)
      }
    }
    return (
      <thead className="table-head">
        <tr className='table-header-row'>{headers}</tr>
      </thead>
    );
  }

  renderContentRows() {
    const { filteredData, sortedBy } = this.state;
    const rows = filteredData.map((item, idx) => {
      const keys = Object.keys(item);
      if (keys.length) {
        const className = idx % 2 === 0 ? 'lightblue' : 'lightgrey';
        const elKey = keys[0];
        return (
          <tr
            key={item[elKey].content}
            className={`${className} table-row`}>
            {
              keys.map((key, index) => {
                const isSortedCol = key === sortedBy.col;
                return (
                  <td
                    key={`${key}-${index}`}
                    style={{ width: item[key].width }}
                    className={classNames(
                      'table-row-item',
                      {
                        'sorted-column': isSortedCol,
                      }
                    )}
                  >
                    {item[key].content}
                  </td>
                )
              })
            }
          </tr>
        )
      }
    })
    return rows;
  }

  handleSearch(evt) {
    const searchTerm = evt.target.value.toLowerCase();
    const filteredData =
      this.data.filter(school => {
        const { SCHOOL, CONF } = school;
        const lowerSchool = SCHOOL.content.toLowerCase();
        const lowerConf = CONF.content.toLowerCase();
        return lowerSchool.includes(searchTerm) || lowerConf.includes(searchTerm);
      })
    if (filteredData.length) {
      this.setState({ filteredData, searchValidationError: '' });
    } else {
      this.setState({ searchValidationError: 'Please enter school or conference' });
    }
  }

  render() {
    const { filteredData, searchValidationError } = this.state;

    if (filteredData.length) {
      return (
        <div className="page-wrapper">
          {
            filteredData.length
              ? <p className="page-header">2018-19 CBB Rankings</p>
              : null
          }
          {
            filteredData.length
              ?
              <div className="table-container-wrapper">
                <Input
                  placeholder="Search school or conference..."
                  onChange={this.handleSearch}
                  validationError={searchValidationError}
                />
                <div className="table-container">
                  <table className="table">
                    {
                      filteredData && this.renderHeaderRows()
                    }
                    <tbody className="table-body">
                      {
                        filteredData && this.renderContentRows()
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              :
              null
          }
        </div>
      )
    } else {
      return (
        <LoadingSpinner />
      )
    }
  }
}

export default Table;