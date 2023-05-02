import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DocumentComponent from '../../document/DocumentComponent';

const Intimaciones = ({ canAddIntimacion, intimaciones, tramite }) => {
  return (
    <Row>
      {intimaciones.map((intimacion, index) => (
        <div key={intimacion.id} className={index !== 0 ? 'mt-2' : ''}>
          <DocumentComponent
            canAddDocument={canAddIntimacion}
            document={intimacion}
            tramite={tramite}
            type="intimacion"
          />
        </div>
      ))}
    </Row>
  );
};

Intimaciones.propTypes = {
  canAddIntimacion: PropTypes.bool,
  intimaciones: PropTypes.array,
  tramite: PropTypes.object
};

export default Intimaciones;
