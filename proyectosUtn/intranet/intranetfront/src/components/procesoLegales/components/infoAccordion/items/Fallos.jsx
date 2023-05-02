import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DocumentComponent from '../../document/DocumentComponent';

const Fallos = ({ canAddFallos, fallos, procesoLegal, expediente }) => {
  return (
    <Row>
      {fallos.map((fallo, index) => (
        <div key={fallo.id} className={index !== 0 ? 'mt-2' : ''}>
          <DocumentComponent
            canAddDocument={canAddFallos}
            document={fallo}
            procesoLegalId={procesoLegal.id}
            type="fallo"
            expediente={expediente}
            pasoActual={procesoLegal.pasoActual}
          />
        </div>
      ))}
    </Row>
  );
};

Fallos.propTypes = {
  canAddFallos: PropTypes.bool,
  fallos: PropTypes.array,
  procesoLegal: PropTypes.object.isRequired,
  expediente: PropTypes.object.isRequired
};

export default Fallos;
