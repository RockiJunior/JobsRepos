import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import logo from 'assets/img/cucicba/logo.png';
import { Link } from 'react-router-dom';

const Logo = ({ at, className, textClass, isNavbar, collapsed, ...rest }) => {
  return (
    <Link
      to="/"
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
              at === 'navbar-top' && at === 'navbar-vertical',
            'flex-center fw-bolder fs-5 mt-2': at === 'auth'
          },
          className
        )}
      >
        <div className="d-flex justify-content-center align-items-center">
          <img
            className="m-0 p-0 me-1"
            src={logo}
            alt="Logo"
            style={{ width: isNavbar ? '40px' : '100px' }}
          />

          <span
            className={classNames('font-sans-serif no-selectable', textClass)}
            style={{ fontWeight: 400, lineHeight: 1 }}
          >
            {isNavbar ? (
              <>
                <div className="d-none d-md-inline">
                  {!collapsed ? (
                    <div>
                      Colegio <strong>Profesional</strong> Inmobiliario
                    </div>
                  ) : (
                    <div className="fs-1 text-start">
                      <p className="m-0">
                        Colegio
                        <br />
                        <strong>Profesional</strong>
                        <br />
                        Inmobiliario
                      </p>
                    </div>
                  )}
                </div>

                <div className="d-inline d-md-none fs--1">
                  <p className="m-0">
                    Colegio
                    <br />
                    <strong>Profesional</strong>
                    <br />
                    Inmobiliario
                  </p>
                </div>
              </>
            ) : (
              <>
                Colegio
                <br />
                <strong>Profesional</strong>
                <br />
                Inmobiliario
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};

Logo.propTypes = {
  at: PropTypes.oneOf(['navbar-vertical', 'navbar-top', 'auth']),
  width: PropTypes.number,
  className: PropTypes.string,
  textClass: PropTypes.string,
  isNavbar: PropTypes.bool,
  collapsed: PropTypes.bool
};

Logo.defaultProps = { at: 'auth', width: 58 };

Image.propTypes = {
  width: PropTypes.number,
  isNavbar: PropTypes.bool
};

export default Logo;
