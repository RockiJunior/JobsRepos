import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DocumentComponent from '../../document/DocumentComponent';

const Dictamenes = ({ canAddDictamen, dictamenes, tramite }) => {
  return (
    <Row>
      {dictamenes.map((dictamen, index) => (
        <div key={dictamen.id} className={index !== 0 ? 'mt-2' : ''}>
          <DocumentComponent
            canAddDocument={canAddDictamen}
            document={dictamen}
            tramite={tramite}
            type="dictamen"
          />
        </div>
      ))}
    </Row>
  );
};

Dictamenes.propTypes = {
  canAddDictamen: PropTypes.bool,
  dictamenes: PropTypes.array,
  tramite: PropTypes.object
};

export default Dictamenes;
