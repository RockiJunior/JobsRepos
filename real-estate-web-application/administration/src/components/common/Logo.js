import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image as BootstrapImage } from 'react-bootstrap'
import logo from 'assets/img/playmatch/Logo.png';

const Image = () => {
  return (
    <BootstrapImage
      fluid
      className="m-0"
      src={logo}
      alt="Logo"
      /* style={{
        WebkitFilter: 'drop-shadow(4px 3px 4px rgba(0, 0, 0, .5))',
        filter: 'drop-shadow(4px 3px 4px rgba(0, 0, 0, .5))',
        transition: 'all 0.3s ease-out'
      }} */
    />
  );
};

const Logo = ({ at, width, className, textClass, ...rest }) => {
  const img = useMemo(() => {
    return <Image width={width} />;
  }, [width]);

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
            'align-items-center py-3': at === 'navbar-vertical',
            'align-items-center': at === 'navbar-top',
            'flex-center fw-bolder fs-5 mt-2': at === 'auth'
          },
          className
        )}
      >
        <div className="d-flex justify-content-center align-items-start">
          {img}
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
