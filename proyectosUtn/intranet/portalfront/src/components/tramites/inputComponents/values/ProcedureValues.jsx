import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import ProcedureValueComponent from './ProcedureValueComponent';

const ProcedureValues = ({ values }) => {
  return (
    <>
      <Row className="g-3">
        {values.map(value => (
          <ProcedureValueComponent key={value.nombre} value={value} />
        ))}
      </Row>
    </>
  );
};

ProcedureValues.propTypes = {
  values: PropTypes.arrayOf(PropTypes.object)
};

export default ProcedureValues;
