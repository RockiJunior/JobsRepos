import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import Archivo from '../../archivos/Archivo';

const Archivos = ({ archivos, pasoActual }) => {
  return (
    <Row className="g-3">
      {archivos.map(archivo => (
        <Archivo key={archivo.id} archivo={archivo} pasoActual={pasoActual} />
      ))}
    </Row>
  );
};

Archivos.propTypes = {
  archivos: PropTypes.array.isRequired,
  pasoActual: PropTypes.number
};

export default Archivos;
