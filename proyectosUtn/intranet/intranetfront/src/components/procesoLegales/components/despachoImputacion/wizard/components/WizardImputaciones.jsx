import PropTypes from 'prop-types';
import React from 'react';
import SeleccionarImputaciones from './seleccionar/SeleccionarImputaciones';
import './wizard.css';

export const WizardImputaciones = ({
  selectedImputaciones,
  setSelectedImputaciones,
  imputaciones
}) => {
  return (
    <SeleccionarImputaciones
      imputaciones={imputaciones}
      selectedImputaciones={selectedImputaciones}
      setSelectedImputaciones={setSelectedImputaciones}
    />
  );
};

WizardImputaciones.propTypes = {
  selectedImputaciones: PropTypes.array.isRequired,
  setSelectedImputaciones: PropTypes.func.isRequired,
  imputaciones: PropTypes.array.isRequired
};
