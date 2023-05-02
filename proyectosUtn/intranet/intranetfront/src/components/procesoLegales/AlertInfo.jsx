import React from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import ActualStep from 'components/varios/pasos/ActualStep';

const infoObj = {
  cancelado: {
    bg: 'danger',
    title: 'Proceso cancelada',
    icon: 'times-circle'
  },
  finalizado: {
    bg: 'success',
    title: 'Proceso finalizado',
    icon: 'check-circle'
  },
  desestimado: {
    bg: 'danger',
    title: 'Proceso desestimado',
    icon: 'times-circle'
  },
  no_ratificado: {
    bg: 'danger',
    title: 'Proceso no ratificado',
    icon: 'times-circle'
  }
};

export const AlertInfo = ({ procesoLegal }) => {
  return Object.keys(infoObj).some(key => key === procesoLegal.estado) ? (
    <Alert variant={infoObj[procesoLegal.estado].bg} className="m-0 mb-2">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon
          icon={infoObj[procesoLegal.estado].icon}
          className="ps-2 pe-3"
          size="3x"
        />
        <div>
          <Alert.Heading className="m-0">
            {infoObj[procesoLegal.estado].title}
          </Alert.Heading>
        </div>
      </div>
      <hr style={{ color: 'var(--falcon-alert-info-border-color)' }} />

      <ActualStep procesoLegal={procesoLegal} className="mt-2" />
    </Alert>
  ) : (
    <Alert
      variant={procesoLegal.pasos[procesoLegal.pasoActual].variant || 'info'}
      className="m-0 mb-2"
    >
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon="info-circle" className="ps-2 pe-3" size="3x" />
        <div>
          <Alert.Heading>
            {procesoLegal.pasos[procesoLegal.pasoActual].intraTitle}
          </Alert.Heading>
          {procesoLegal.pasos[procesoLegal.pasoActual].intraDescription
            ?.split('#')
            .map((text, index) => {
              switch (text) {
                case 'asterisco':
                  return (
                    <FontAwesomeIcon
                      key={index}
                      className="text-danger fs--2"
                      icon="asterisk"
                    />
                  );

                default:
                  return (
                    <span
                      key={index}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  );
              }
            })}
        </div>
      </div>
      <hr style={{ color: 'var(--falcon-alert-info-border-color)' }} />
      <ActualStep procesoLegal={procesoLegal} className="mt-2" />
    </Alert>
  );
};
AlertInfo.propTypes = {
  procesoLegal: PropTypes.object.isRequired
};
