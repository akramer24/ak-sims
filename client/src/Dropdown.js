import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dropdown extends Component {
  constructor() {
    super();
    this.state = {
      isDropdownOpen: false
    }

    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.toggleDropdown)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.toggleDropdown);
  }

  toggleDropdown(evt) {
    const classList = Array.from(evt.target.classList);
    if (!classList.includes('dropdown-title-header') && !classList.includes('dropdown-title') && !classList.includes('dropdown-caret')) {
      this.setState({ isDropdownOpen: false })
    } else {
      this.setState({ isDropdownOpen: true });
    }
  }

  handleOptionClick(evt) {
    const { onOptionClick } = this.props;
    onOptionClick(evt.target.innerText);
    this.setState({ isDropdownOpen: false })
  }

  render() {
    const { openDropdownTitle, options, title, type, width } = this.props;
    const { isDropdownOpen } = this.state;
    const displayTitle =
      type === 'select' && !isDropdownOpen
        ? title
        : openDropdownTitle
          ? openDropdownTitle
          : title;

    return (
      <div className="dropdown" style={{ width }}>
        <div className="dropdown-title">
          <p className="dropdown-title-header">{displayTitle}</p>
          {
            type === 'select'
              ? <p className="dropdown-down-caret">&or;</p>
              : null
          }
        </div>
        {
          isDropdownOpen
            ?
            <div className="dropdown-menu">
              {
                options.map(option => {
                  return (
                    <p
                      key={option}
                      className="dropdown-option"
                      onClick={evt => this.handleOptionClick(evt)}
                      value={option}
                    >
                      {option}
                    </p>
                  )
                })
              }
            </div>
            :
            null
        }
      </div>
    )
  }
}

Dropdown.propTypes = {
  /**
   * Title to display when `type === "select"` and dropdown is open.
   */
  openDropdownTitle: PropTypes.string,
  /**
   * Options that populate dropdown menu.
   */
  options: PropTypes.arrayOf(PropTypes.string),
  /**
   * Title to display when `type !== "select"` or when `type === "select"`
   * and dropdown is not open.
   */
  title: PropTypes.string,
  /**
   * Determines whether dropdown mimics traditional select input or general menu.
   */
  type: PropTypes.oneOf(['select', 'menu']),
  /** 
   * Applied to title field.
   */
  width: PropTypes.number
}

export default Dropdown;