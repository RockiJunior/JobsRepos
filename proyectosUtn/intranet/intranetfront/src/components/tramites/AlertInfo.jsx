import React from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import ActualStep from 'components/varios/pasos/ActualStep';

export const AlertInfo = ({ tramite }) => {
  return !tramite.empleadoId ? (
    <Alert variant="warning" className="mb-2">
      <Alert.Heading>Trámite sin asignar</Alert.Heading>
      <p>
        El trámite se encuentra sin asignar. Por favor, comuníquese con el jefe
        de área correspondiente para que lo asigne.
      </p>
    </Alert>
  ) : tramite.estado === 'cancelado' ? (
    <Alert variant="danger" className="mb-2">
      <Alert.Heading>Trámite cancelado</Alert.Heading>
    </Alert>
  ) : tramite.estado === 'rechazado' ? (
    <Alert variant="danger" className="mb-2">
      <Alert.Heading>Trámite rechazado</Alert.Heading>
    </Alert>
  ) : tramite.tipo?.pasos[tramite.pasoActual].intraTitle ||
    tramite.tipo?.pasos[tramite.pasoActual].intraDescription ? (
    <Alert
      variant={tramite.tipo?.pasos[tramite.pasoActual]?.variant || 'info'}
      className="mb-2"
    >
      <div className="d-flex align-items-center">
        <FontAwesomeIcon
          icon="info-circle"
          className="ps-2 pe-3"
          size="3x"
          style={{ '--fa-animation-duration': '1.5s' }}
        />

        <div>
          <Alert.Heading>
            {tramite.tipo?.pasos[tramite.pasoActual].intraTitle}
          </Alert.Heading>
          {tramite.tipo?.pasos[tramite.pasoActual].intraDescription
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
      <ActualStep tramiteExpediente={tramite} className="mt-2" />
    </Alert>
  ) : null;
};
AlertInfo.propTypes = {
  tramite: PropTypes.object.isRequired
};
