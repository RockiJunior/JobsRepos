import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ButtonPrimarySubmit = ({ text, funcion, data, disabled }) => {
  return (
    <Button
      className="d-flex align-items-center justify-content-center"
      variant={!disabled ? 'primary' : 'secondary'}
      size="sm"
      disabled={disabled}
      onClick={data ? () => funcion(data) : funcion}
      type="submit"
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <FontAwesomeIcon icon="fa-check" style={{ marginRight: 5 }} />
      &nbsp;
      <span style={{ marginRight: 10 }}>{text}</span>
    </Button>
  );
};

ButtonPrimarySubmit.propTypes = {
  text: PropTypes.string.isRequired,
  funcion: PropTypes.func.isRequired,
  data: PropTypes.any,
  disabled: PropTypes.bool
};

export default ButtonPrimarySubmit;
