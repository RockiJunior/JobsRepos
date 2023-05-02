import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const getLink = info => {
  switch (info.tipo) {
    case 'tramite':
      return `/tramites/${info.tramiteId}`;

    case 'evento':
      return `/eventos`;

    default:
      return '';
  }
};

const getTipo = tipo => {
  switch (tipo) {
    case 'transaccion':
      return 'transacciones';

    default:
      return '';
  }
};

const Notification = ({ notification, isLast }) => {
  const { titulo, info, descripcion } = notification;
  return (
    <li
      className={classNames('alert mb-0 rounded-0 py-2 px-0', {
        'border-0': isLast,
        'border-x-0 border-top-0': !isLast
      })}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div
          className="d-flex align-items-center"
          style={{
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          <FontAwesomeIcon icon="circle" className="fs--2 text-primary" />
          <div style={{ minWidth: 0 }}>
            <strong>
              <p
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
                className="fs--1 ps-2 mb-0"
              >
                {titulo}
              </p>
            </strong>
            <p
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
              className="fs--1 ps-2 mb-0"
            >
              {descripcion}
            </p>
          </div>
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Link to={getLink(info)} className="ps-2 alert-link fs--1 fw-medium">
            {`Ver ${getTipo(info.tipo)}`}
            <FontAwesomeIcon icon="chevron-right" className="ms-1 fs--2" />
          </Link>
        </div>
      </div>
    </li>
  );
};

Notification.propTypes = {
  notification: PropTypes.object,
  isLast: PropTypes.bool.isRequired
};

export default Notification;
