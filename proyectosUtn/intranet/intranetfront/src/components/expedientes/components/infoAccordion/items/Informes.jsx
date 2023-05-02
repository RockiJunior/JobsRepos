import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DocumentComponent from '../../document/DocumentComponent';

const Informes = ({ informes, expediente }) => {
  return (
    <Row>
      {informes.map((informe, index) => (
        <div key={informe.id} className={index !== 0 ? 'mt-2' : ''}>
          <DocumentComponent
            document={informe}
            expediente={expediente}
            type="informe"
          />
        </div>
      ))}
    </Row>
  );
};

Informes.propTypes = {
  informes: PropTypes.array,
  expediente: PropTypes.object
};

export default Informes;
