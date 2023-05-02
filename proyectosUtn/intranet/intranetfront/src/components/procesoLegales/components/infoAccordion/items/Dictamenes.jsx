import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DocumentComponent from '../../document/DocumentComponent';

const Dictamenes = ({
  canAddDictamen,
  dictamenes,
  procesoLegal,
  expediente
}) => {
  return (
    <Row>
      {dictamenes.map((dictamen, index) => (
        <div key={dictamen.id} className={index !== 0 ? 'mt-2' : ''}>
          <DocumentComponent
            canAddDocument={canAddDictamen}
            document={dictamen}
            procesoLegalId={procesoLegal.id}
            type="dictamen"
            expediente={expediente}
            pasoActual={procesoLegal.pasoActual}
          />
        </div>
      ))}
    </Row>
  );
};

Dictamenes.propTypes = {
  canAddDictamen: PropTypes.bool,
  dictamenes: PropTypes.array,
  procesoLegal: PropTypes.object.isRequired,
  expediente: PropTypes.object.isRequired
};

export default Dictamenes;
