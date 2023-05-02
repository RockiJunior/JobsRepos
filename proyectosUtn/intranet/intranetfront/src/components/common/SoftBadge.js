import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SoftBadge = ({ bg = 'primary', pill, children, className, style }) => {
  return (
    <div
      className={classNames(className, `badge badge-soft-${bg}`, {
        'rounded-pill': pill
      })}
      style={style}
    >
      {children}
    </div>
  );
};

SoftBadge.propTypes = {
  bg: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark'
  ]),
  pill: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object
};

export default SoftBadge;
