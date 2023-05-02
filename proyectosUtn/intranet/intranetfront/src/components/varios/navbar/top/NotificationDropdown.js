import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Dropdown, ListGroup } from 'react-bootstrap';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ImHeartBroken } from 'react-icons/im';
import 'react-toastify/dist/ReactToastify.css';

import { isIterableArray } from 'helpers/utils';
import FalconCardHeader from 'components/common/FalconCardHeader';
import {
  getAllNotificationsByUserid,
  markAllNotificationAsRead,
  markAllNotificationsAsSeen,
  markNotificationAsRead
} from 'redux/actions/notificaciones';
import Notification from 'components/varios/notification/Notification';

export const getLink = info => {
  switch (info.tipo) {
    case 'tramite':
      return `/tramites/${info.tramiteId}`;

    case 'expediente':
      return `/expedientes/${info.expedienteId}`;

    case 'cedula':
      return `/cedulas/${info.cedulaId}`;

    case 'evento':
      return `/eventos/${info.eventoId}`;

    case 'transaccion':
      return `/transacciones`;

    default:
      return '/';
  }
};

export const getNotificationEmoji = type => {
  switch (type) {
    case 'tramite':
      return '📄';

    case 'expediente':
      return '📁';

    case 'cedula':
      return '📇';

    case 'evento':
      return '🗓️';

    case 'transaccion':
      return '💵';

    default:
      return '🔔';
  }
};

const getTime = time => {
  const now = dayjs();

  if (now.diff(time, 'seconds') < 60) {
    return 'Justo ahora';
  } else if (now.diff(time, 'minutes') < 60) {
    return (
      `Hace ${now.diff(time, 'minutes')}` +
      (now.diff(time, 'minutes') === 1 ? ' minuto' : ' minutos')
    );
  } else if (now.diff(time, 'hours') < 24) {
    return (
      `Hace ${now.diff(time, 'hours')}` +
      (now.diff(time, 'hours') === 1 ? ' hora' : ' horas')
    );
  } else {
    return dayjs(time).format('DD/MM/YYYY HH:mm');
  }
};

const NotificationDropdown = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isAllSeen, setIsAllSeen] = useState(true);
  const [newNotifications, setNewNotifications] = useState([]);
  const [earlierNotifications, setEarlierNotifications] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.authReducer);
  const { notificaciones: notifications } = useSelector(
    state => state.notificationReducer
  );

  // Handler
  const handleToggle = () => (
    user && !isAllSeen && dispatch(markAllNotificationsAsSeen(user.id)),
    setIsOpen(!isOpen)
  );

  const handleClick = notification => {
    setNewNotifications(
      newNotifications.map(n =>
        n.id === notification.id ? { ...n, unread: false } : n
      )
    );
    setEarlierNotifications(
      earlierNotifications.map(n =>
        n.id === notification.id ? { ...n, unread: false } : n
      )
    );

    dispatch(markNotificationAsRead(notification.id));

    navigate(getLink(notification.info));

    handleToggle();
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.innerWidth < 1200 && setIsOpen(false);
    });
  }, []);

  useEffect(() => {
    user && dispatch(getAllNotificationsByUserid(user.id));
  }, []);

  useEffect(() => {
    if (notifications) {
      const unseenNotifications = notifications.filter(n => !n.vista);
      const seenNotifications = notifications.filter(n => n.vista);

      notifications &&
        setNewNotifications(
          unseenNotifications.map(n => ({
            id: n.id,
            children: `<strong>${n.titulo}</strong>: ${n.descripcion}`,
            time: getTime(n.createdAt),
            emoji: getNotificationEmoji(n.info.tipo),
            className: 'rounded-0 border-x-0 border-300 border-bottom-0',
            unread: !n.leido,
            info: n.info,
            type: n.info.tipo
          }))
        );

      notifications &&
        setEarlierNotifications(
          seenNotifications.map(n => ({
            id: n.id,
            children: `<strong>${n.titulo}</strong>: ${n.descripcion}`,
            time: getTime(n.createdAt),
            emoji: getNotificationEmoji(n.info.tipo),
            className: 'rounded-0 border-x-0 border-300 border-bottom-0',
            unread: !n.leido,
            info: n.info,
            type: n.info.tipo
          }))
        );

      unseenNotifications.length && setIsAllSeen(false);
    }
  }, [notifications]);

  useEffect(() => {
    isOpen && setIsAllSeen(true);
  }, [isOpen]);

  const markAsRead = e => {
    e.preventDefault();

    const updatedNewNotifications = newNotifications.map(notification =>
      Object.prototype.hasOwnProperty.call(notification, 'unread')
        ? { ...notification, unread: false }
        : notification
    );
    const updatedEarlierNotifications = earlierNotifications.map(notification =>
      Object.prototype.hasOwnProperty.call(notification, 'unread')
        ? { ...notification, unread: false }
        : notification
    );
    user && dispatch(markAllNotificationAsRead(user.id));
    setNewNotifications(updatedNewNotifications);
    setEarlierNotifications(updatedEarlierNotifications);
    setIsAllSeen(true);
  };

  return (
    <div>
      <Dropdown navbar={true} as="li" show={isOpen} onToggle={handleToggle}>
        <Dropdown.Toggle
          bsPrefix="toggle"
          as={Link}
          to="#!"
          className={classNames('p-0 nav-link', {
            'notification-indicator notification-indicator-primary': !isAllSeen
          })}
        >
          <FontAwesomeIcon icon="bell" transform="shrink-6" className="fs-4" />
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="dropdown-menu-card dropdown-menu-end dropdown-caret-bg"
          style={{
            backgroundColor: '#F4F5F6',
            border: '1px solid',
            borderColor: 'var(--falcon-dropdown-border-color)'
          }}
        >
          <Card
            className="dropdown-menu-notification dropdown-menu-end shadow-none"
            style={{ maxWidth: '20rem' }}
          >
            <FalconCardHeader
              className="card-header bg-white"
              title="Notificaciones"
              titleTag="h6"
              light={false}
              endEl={
                <Link
                  className="card-link fw-normal"
                  to="#!"
                  onClick={markAsRead}
                >
                  Marcar como leidas
                </Link>
              }
            />
            <ListGroup
              variant="flush"
              className="fw-normal fs--1 scrollbar bg-white"
              style={{ maxHeight: '19rem' }}
            >
              {isIterableArray(newNotifications) && (
                <>
                  <div className="list-group-title text-white bg-primary">
                    NUEVAS
                  </div>
                  {newNotifications.map(notification => (
                    <ListGroup.Item
                      key={notification.id}
                      onClick={() => handleClick(notification)}
                    >
                      <Notification {...notification} flush />
                    </ListGroup.Item>
                  ))}
                </>
              )}

              {isIterableArray(earlierNotifications) && (
                <>
                  <div className="list-group-title text-white bg-primary">
                    VISTAS
                  </div>
                  {earlierNotifications.map(notification => (
                    <ListGroup.Item
                      onClick={() => handleClick(notification)}
                      key={notification.id}
                    >
                      <Notification {...notification} flush />
                    </ListGroup.Item>
                  ))}
                </>
              )}

              {notifications && !notifications.length && (
                <div className="d-flex flex-column align-items-center py-3">
                  <ImHeartBroken className="text-1000 fs-3" />
                  <p className="text-1000 fw-bold fs-1">
                    No tenés notificaciones
                  </p>
                </div>
              )}
            </ListGroup>
          </Card>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

NotificationDropdown.propTypes = {
  establishment: PropTypes.object
};

export default NotificationDropdown;
