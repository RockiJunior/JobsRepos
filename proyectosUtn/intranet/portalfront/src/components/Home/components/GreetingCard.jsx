import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import Notification from './Notification';
import { CustomCard } from 'components/common/CustomCard';

const getThreeNotifications = original => {
  const notifications = [...original];
  const threeNotifications = [];

  while (threeNotifications.length < 3 && notifications.length) {
    const notification = notifications.shift();
    if (
      !threeNotifications.some(n => {
        switch (n.info?.tipo) {
          case 'tramite':
            return n.info.tramiteId === notification.info.tramiteId;

          case 'expediente':
            return n.info.expedienteId === notification.info.expedienteId;

          case 'cedula':
            return n.info.cedulaId === notification.info.cedulaId;

          case 'evento':
            return n.info.eventoId === notification.info.eventoId;

          case 'transaccion':
            return n.info.transaccionId === notification.info.transaccionId;

          default:
            return false;
        }
      })
    )
      threeNotifications.push(notification);
  }
  return threeNotifications;
};

const GreetingCard = ({ notifications, user }) => {
  return (
    <CustomCard className="overflow-hidden" title="Inicio" icon="home">
      <Card.Header className="position-relative">
        <div className="position-relative z-index-2">
          <div>
            <h3 className="text-primary mb-1">Bienvenido, {user.nombre}!</h3>
          </div>
        </div>
      </Card.Header>
      {!!notifications?.length && (
        <Card.Body className="py-0">
          <p className="text-600 fs--1 mb-0">Últimas notificaciones:</p>
          <ul className="mb-0 list-unstyled">
            {getThreeNotifications(notifications).map((notification, index) => (
              <Notification
                key={notification.id}
                notification={notification}
                isLast={notifications.length - 1 === index}
              />
            ))}
          </ul>
        </Card.Body>
      )}
    </CustomCard>
  );
};

GreetingCard.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object
};

export default GreetingCard;
