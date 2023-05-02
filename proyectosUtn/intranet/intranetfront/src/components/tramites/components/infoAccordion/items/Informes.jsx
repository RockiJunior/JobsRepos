import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DocumentComponent from '../../document/DocumentComponent';

const Informes = ({ canAddInforme, informes, tramite }) => {
  return (
    <Row>
      {informes.map((informe, index) => (
        <div key={informe.id} className={index !== 0 ? 'mt-2' : ''}>
          <DocumentComponent
            canAddDocument={canAddInforme}
            document={informe}
            tramite={tramite}
            type="informe"
          />
        </div>
      ))}
    </Row>
  );
};

Informes.propTypes = {
  canAddInforme: PropTypes.bool,
  informes: PropTypes.array,
  tramite: PropTypes.object
};

export default Informes;
