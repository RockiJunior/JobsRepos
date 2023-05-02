import React from 'react';
import PropTypes from 'prop-types';

export const TituloSeccion = ({ title, className }) => (
  <h5 className={'mb-0 text-primary position-relative ' + (className || '')}>
    <span className="border position-absolute top-50 translate-middle-y w-100 start-0"></span>
    <span className="bg-white position-absolute dark__bg--1100 pe-3">
      <strong>{title}</strong>
    </span>
    <span className="bg-white dark__bg--1100 pe-3">
      <strong>{title}</strong>
    </span>
  </h5>
);
TituloSeccion.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string
};
