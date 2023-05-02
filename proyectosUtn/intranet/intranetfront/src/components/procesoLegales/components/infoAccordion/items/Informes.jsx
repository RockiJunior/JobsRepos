import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DocumentComponent from '../../document/DocumentComponent';

const Informes = ({ canAddInformes, informes, procesoLegal, expediente }) => {
  return (
    <Row>
      {informes.map((informe, index) => (
        <div key={informe.id} className={index !== 0 ? 'mt-2' : ''}>
          <DocumentComponent
            canAddDocument={canAddInformes}
            document={informe}
            procesoLegalId={procesoLegal.id}
            type="informe"
            expediente={expediente}
            pasoActual={procesoLegal.pasoActual}
          />
        </div>
      ))}
    </Row>
  );
};

Informes.propTypes = {
  canAddInformes: PropTypes.bool,
  informes: PropTypes.array,
  procesoLegal: PropTypes.object.isRequired,
  expediente: PropTypes.object.isRequired
};

export default Informes;
