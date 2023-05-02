import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import Archivo from '../../archivos/Archivo';

const Archivos = ({ archivos }) => {
  return (
    <Row className="g-3">
      {archivos.map(archivo => (
        <Archivo key={archivo.id} archivo={archivo} />
      ))}
    </Row>
  );
};

Archivos.propTypes = {
  archivos: PropTypes.array.isRequired
};

export default Archivos;
