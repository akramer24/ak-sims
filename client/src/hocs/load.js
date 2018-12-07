import React, { Component } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '../index';

const load = Child => class Load extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    let api;
    switch (this.props.match.path) {
      case '/rankings':
        api = 'school-quality';
        break;
      case '/simulations':
        api = 'lines';
        break;
      default:
        api = '';
        break;
    }
    axios.get(`/api/data/${api}`)
      .then(res => {
        this.setState({ data: res.data });
      })
      .catch(console.log);
  }

  render() {
    const { data } = this.state;
    if (data.length) {
      return <Child {...this.props} data={data} />
    } else {
      return <LoadingSpinner />
    }
  }
}

export default load;