import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ButtonCreate = ({ text, funcion, variant = 'success' }) => {
  return (
    <Button
      className="d-flex align-items-center align-text-center"
      variant={variant}
      onClick={funcion}
      size="sm"
    >
      <FontAwesomeIcon icon="fa-plus" />

      <span className="ms-1">{text}</span>
    </Button>
  );
};

ButtonCreate.propTypes = {
  text: PropTypes.string.isRequired,
  funcion: PropTypes.func.isRequired,
  variant: PropTypes.string
};

export default ButtonCreate;
