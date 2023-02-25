import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Card, Dropdown, ListGroup } from 'react-bootstrap';
import { isIterableArray } from 'helpers/utils';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Notification from 'components/notification/Notification';
import dayjs from 'dayjs';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import { ImHeartBroken } from 'react-icons/im';

const getEmoji = type => {
  switch (type) {
    case 'Stage':
      return '🎾';

    case 'Message':
      return '💬';

    case 'Appointment':
      return '🗓️';

    case 'successPayment':
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
const notifications = [];

const NotificationDropdown = () => {  

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isAllSeen, setIsAllSeen] = useState(true);
  const [newNotifications, setNewNotifications] = useState([]);
  const [earlierNotifications, setEarlierNotifications] = useState([]);

  // Handler
  const handleToggle = () => setIsOpen(!isOpen);

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

    handleToggle();
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.innerWidth < 1200 && setIsOpen(false);
    });
  }, []);

  useEffect(() => {
    if (notifications) {
      const unseenNotifications = notifications.filter(n => !n.seen);
      const seenNotifications = notifications.filter(n => n.seen);

      notifications &&
        setNewNotifications(
          unseenNotifications.map(n => ({
            id: n.id,
            children: `<strong>${n.title}</strong>: ${n.body}`,
            time: getTime(n.createdAt),
            emoji: getEmoji(n.type),
            className: 'rounded-0 border-x-0 border-300 border-bottom-0',
            unread: !n.read,
            info: n.info,
            type: n.type
          }))
        );

      notifications &&
        setEarlierNotifications(
          seenNotifications.map(n => ({
            id: n.id,
            children: `<strong>${n.title}</strong>: ${n.body}`,
            time: getTime(n.createdAt),
            emoji: getEmoji(n.type),
            className: 'rounded-0 border-x-0 border-300 border-bottom-0',
            unread: !n.read,
            info: n.info,
            type: n.type
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

    setNewNotifications(updatedNewNotifications);
    setEarlierNotifications(updatedEarlierNotifications);
    setIsAllSeen(true);
    handleToggle(!isOpen);
  };

  return (
    <>
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

        <Dropdown.Menu className="dropdown-menu-card dropdown-menu-end dropdown-caret-bg">
          <Card
            className="dropdown-menu-notification dropdown-menu-end shadow-none"
            style={{ maxWidth: '20rem' }}
          >
            <FalconCardHeader
              className="card-header"
              title="Notificaciones"
              titleTag="h6"
              light={false}
              endEl={
                <Link
                  className="card-link fw-normal"
                  to="#!"
                  onClick={markAsRead}
                >
                  Marcar como vistas
                </Link>
              }
            />
            <ListGroup
              variant="flush"
              className="fw-normal fs--1 scrollbar"
              style={{ maxHeight: '19rem' }}
            >
              {isIterableArray(newNotifications) && (
                <>
                  <div className="list-group-title">NUEVAS</div>{' '}
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
                  <div className="list-group-title">VISTAS</div>
                  {earlierNotifications.map(notification => (
                    <ListGroup.Item
                      key={notification.id}
                      onClick={() => handleClick(notification)}
                    >
                      <Notification {...notification} flush />
                    </ListGroup.Item>
                  ))}
                </>
              )}

              {!notifications.length && (
                <div className="d-flex flex-column align-items-center py-3">
                  <ImHeartBroken className="text-1000 fs-3" />
                  <p className="text-1000 fw-bold fs-1">
                    No tienes notificaciones
                  </p>
                </div>
              )}
            </ListGroup>
            <div
              className="card-footer text-center border-top"
              onClick={handleToggle}
            >
              <Link className="card-link d-block" to="#!">
                Ver todas
              </Link>
            </div>
          </Card>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

NotificationDropdown.propTypes = {
  establishment: PropTypes.object
};

export default NotificationDropdown;
