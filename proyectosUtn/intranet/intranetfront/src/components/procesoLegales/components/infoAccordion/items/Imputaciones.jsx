import PropTypes from 'prop-types';
import React from 'react';
import { Row } from 'react-bootstrap';
import DespachoImputacion from '../../despachoImputacion/DespachoImputacion';

const Imputaciones = ({ despachoImputacion, procesoLegal, expediente }) => {
  return (
    <Row>
      <DespachoImputacion
        despachoImputacion={despachoImputacion}
        expedienteId={expediente.id}
        procesoLegalId={procesoLegal.id}
        pasoActual={procesoLegal.pasoActual}
      />
    </Row>
  );
};

Imputaciones.propTypes = {
  despachoImputacion: PropTypes.object.isRequired,
  procesoLegal: PropTypes.object.isRequired,
  expediente: PropTypes.object.isRequired
};

export default Imputaciones;
