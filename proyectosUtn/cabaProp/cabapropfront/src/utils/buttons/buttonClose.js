import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ButtonClose = ({ text, funcion, data }) => {
  return (
    <Button
      className="d-flex align-items-center justify-content-center"
      variant="danger"
      size="sm"
      onClick={data ? () => funcion(data) : funcion}
    >
      <FontAwesomeIcon icon="fa-xmark" style={{ marginRight: 5 }} />
      &nbsp;
      <span style={{ marginRight: 10 }}>{text}</span>
    </Button>
  );
};

ButtonClose.propTypes = {
  text: PropTypes.string.isRequired,
  funcion: PropTypes.func.isRequired,
  data: PropTypes.any
};

export default ButtonClose;
