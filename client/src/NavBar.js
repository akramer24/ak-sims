import React, { Component } from 'react';
import navTo from './utils/navTo';
import PropTypes from 'prop-types';

class NavBar extends Component {
  render () {
    return (
      <div id="navbar">
        <p id="navbar-home" className="navbar-link navbar-header" onClick={() => navTo('/')}>AK-Sims</p>
        <p id="navbar-rankings" className="navbar-link navbar-header" onClick={() => navTo('/rankings')}>Rankings</p>
        <p id="navbar-simulations" className="navbar-link navbar-header" onClick={() => navTo('/simulations')}>Simulations</p>
      </div>
    )
  }
}

export default NavBar;