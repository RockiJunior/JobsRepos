import React from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const infoObj = {
  cancelada: {
    bg: 'danger',
    title: 'Fiscalización cancelada',
    icon: 'times-circle'
  },
  finalizada: {
    bg: 'success',
    title: 'Fiscalización finalizada',
    icon: 'check-circle'
  },
  causa_penal: {
    bg: 'warning',
    title: 'Fiscalización en causa penal',
    icon: 'exclamation-triangle'
  },
  archivada: {
    bg: 'info',
    title: 'Fiscalización archivada',
    icon: 'archive'
  }
};

export const AlertInfo = ({ fiscalizacion }) => {
  return (
    <Alert variant={infoObj[fiscalizacion.estado].bg} className="m-0 mb-2">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon
          icon={infoObj[fiscalizacion.estado].icon}
          className="ps-2 pe-3"
          size="3x"
        />
        <div>
          <Alert.Heading className="m-0">
            {infoObj[fiscalizacion.estado].title}
          </Alert.Heading>
        </div>
      </div>
    </Alert>
  );
};
AlertInfo.propTypes = {
  fiscalizacion: PropTypes.object.isRequired
};
