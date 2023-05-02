import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';

const ButtonResend = ({ funcion, data }) => {
  return (
    <FontAwesomeIcon
      icon="fa-rotate-right"
      title="Reenviar"
      style={{
        marginRight: 4,
        marginLeft: 4,
        color: '#6b5eae',
        cursor: 'pointer'
      }}
      onClick={data ? () => funcion(data) : funcion}
    />
  );
};

ButtonResend.propTypes = {
  funcion: PropTypes.func.isRequired,
  data: PropTypes.any
};

export default ButtonResend;
