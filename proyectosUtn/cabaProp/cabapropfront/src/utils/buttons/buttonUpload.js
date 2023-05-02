import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ButtonUpload = ({ text, funcion, data }) => {
  return (
    <Button
      className="d-flex align-items-center justify-content-center"
      variant="success"
      size="sm"
      onClick={data ? () => funcion(data) : funcion}
      type="submit"
    >
      <FontAwesomeIcon icon="fa-check" style={{ marginRight: 5 }} />
      &nbsp;
      <span style={{ marginRight: 10 }}>{text}</span>
    </Button>
  );
};

ButtonUpload.propTypes = {
  text: PropTypes.string.isRequired,
  funcion: PropTypes.func.isRequired,
  data: PropTypes.any
};

export default ButtonUpload;
