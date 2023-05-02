import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image as BootstrapImage } from 'react-bootstrap';
import logo from 'assets/img/playmatch/Logo.png';

const Logo = ({ at, width, className, textClass, ...rest }) => {
  return (
    <span
      className={classNames(
        'text-decoration-none',
        { 'navbar-brand text-left': at === 'navbar-vertical' },
        { 'navbar-brand text-left': at === 'navbar-top' }
      )}
      {...rest}
    >
      <div
        className={classNames(
          'd-flex',
          {
            'align-items-center':
              at === 'navbar-top' || at === 'navbar-vertical',
            'flex-center fw-bolder fs-5 mt-2': at === 'auth'
          },
          className
        )}
        style={{
          marginBottom: at === 'navbar-vertical' ? 4 : '',
          height: at === 'navbar-top' ? 50 : at === 'navbar-vertical' ? 70 : '',
          paddingLeft: at === 'navbar-vertical' ? 24 : ''
        }}
      >
        <div className="d-flex justify-content-center align-items-start">
          <BootstrapImage
            fluid
            className="m-0"
            src={logo}
            alt="Logo"
            style={{
              maxHeight: at === 'navbar-top' ? 40 : ''
            }}
          />
        </div>
      </div>
    </span>
  );
};

Logo.propTypes = {
  at: PropTypes.oneOf(['navbar-vertical', 'navbar-top', 'auth']),
  width: PropTypes.number,
  className: PropTypes.string,
  textClass: PropTypes.string
};

Logo.defaultProps = { at: 'auth', width: 58 };

Image.propTypes = {
  width: PropTypes.number
};

export default Logo;
