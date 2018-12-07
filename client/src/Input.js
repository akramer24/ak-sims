import React from 'react';
import classNames from 'classnames';

const Input = props => {
  const { validationError, onChange, placeholder, className } = props;

  return (
    <div className={classNames(
      "input-container",
      {
        shake: validationError
      }
    )}
    >
      <div className="input-bar">
        <input
          className={classNames(
            'input',
            {
              [className]: className
            }
          )}
          placeholder={placeholder}
          onChange={onChange}
        />
        <img className="search-icon" src="/images/search.png" />
      </div>
      {
        <p className="validation-error">
          {validationError}
        </p>
      }
    </div>
  )
}

export default Input;