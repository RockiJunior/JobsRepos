import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DocumentComponent from '../../document/DocumentComponent';

const Resoluciones = ({
  canAddResolucion,
  resoluciones,
  procesoLegal,
  expediente
}) => {
  return (
    <Row>
      {resoluciones.map((resolucion, index) => (
        <div key={resolucion.id} className={index !== 0 ? 'mt-2' : ''}>
          <DocumentComponent
            canAddDocument={canAddResolucion}
            document={resolucion}
            procesoLegalId={procesoLegal.id}
            type="resolucion"
            expediente={expediente}
            pasoActual={procesoLegal.pasoActual}
          />
        </div>
      ))}
    </Row>
  );
};

Resoluciones.propTypes = {
  canAddResolucion: PropTypes.bool,
  resoluciones: PropTypes.array,
  procesoLegal: PropTypes.object.isRequired,
  expediente: PropTypes.object.isRequired
};

export default Resoluciones;
