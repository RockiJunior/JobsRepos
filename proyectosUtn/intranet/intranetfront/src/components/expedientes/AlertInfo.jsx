import React from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const infoObj = {
  cancelado: {
    bg: 'danger',
    title: 'Expediente cancelado',
    icon: 'times-circle'
  },
  finalizado: {
    bg: 'success',
    title: 'Expediente finalizado',
    icon: 'check-circle'
  },
  pendiente: {
    bg: 'warning',
    title: 'Expediente en curso',
    icon: 'exclamation-circle'
  },
  fiscalizacion_abierta: {
    bg: 'info',
    title: 'Expediente en fiscalización',
    icon: 'exclamation-circle'
  },
  proceso_legal_abierto: {
    bg: 'info',
    title: 'Expediente en proceso legal',
    icon: 'exclamation-circle'
  }
};

export const AlertInfo = ({ expediente }) => {
  return (
    <Alert variant={infoObj[expediente.estado].bg} className="m-0 mb-2">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon
          icon={infoObj[expediente.estado].icon}
          className="ps-2 pe-3"
          size="3x"
          style={{ '--fa-animation-duration': '1.5s' }}
        />
        <div>
          <Alert.Heading className="m-0">
            {infoObj[expediente.estado].title}
          </Alert.Heading>
        </div>
      </div>
    </Alert>
  );
};
AlertInfo.propTypes = {
  expediente: PropTypes.object.isRequired
};
