import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import Archivo from '../../archivos/Archivo';

const Archivos = ({ archivos, pasoActual, expedienteId }) => {
  return (
    <Row className="g-3">
      {archivos.map(archivo => (
        <Archivo
          key={archivo.id}
          archivo={archivo}
          pasoActual={pasoActual}
          expedienteId={expedienteId}
        />
      ))}
    </Row>
  );
};

Archivos.propTypes = {
  archivos: PropTypes.array.isRequired,
  pasoActual: PropTypes.bool.isRequired,
  expedienteId: PropTypes.number.isRequired
};

export default Archivos;
