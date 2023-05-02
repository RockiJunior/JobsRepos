import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DocumentComponent from '../../document/DocumentComponent';

const Resoluciones = ({ canAddResolucion, resoluciones, tramite }) => {
  return (
    <Row>
      {resoluciones.map((resolucion, index) => (
        <div key={resolucion.id} className={index !== 0 ? 'mt-2' : ''}>
          <DocumentComponent
            canAddDocument={canAddResolucion}
            document={resolucion}
            tramite={tramite}
            type="resolucion"
          />
        </div>
      ))}
    </Row>
  );
};

Resoluciones.propTypes = {
  canAddResolucion: PropTypes.bool,
  resoluciones: PropTypes.array,
  tramite: PropTypes.object
};

export default Resoluciones;
