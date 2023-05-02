import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';

const ButtonDisable = ({ funcion, data }) => {
  return (
    <FontAwesomeIcon
      icon="fa-pause"
      title="Deshabilitar"
      style={{
        marginRight: 4,
        marginLeft: 4,
        color: '#02a8b5',
        cursor: 'pointer'
      }}
      onClick={data ? () => funcion(data) : funcion}
    />
  );
};

ButtonDisable.propTypes = {
  funcion: PropTypes.func.isRequired,
  data: PropTypes.any
};

export default ButtonDisable;
