import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const HistorialContent = ({ historial }) => {
  const { user } = useSelector(state => state.authReducer);

  return (
    <div className="timeline-vertical">
      {historial.map((item, index) => {
        const { fecha, nombre, descripcion, usuario } = item;

        return (
          <div
            key={index}
            className={classNames('timeline-item', {
              'timeline-item-start': usuario.id === user.id,
              'timeline-item-end': usuario.id !== user.id
            })}
          >
            <div className="timeline-icon icon-item icon-item-lg text-primary border-300">
              <FontAwesomeIcon icon="clock" className="fs-1" />
            </div>
            <Row
              className={` ${
                usuario.id === user.id
                  ? 'timeline-item-start'
                  : 'timeline-item-end'
              }`}
            >
              <Col
                lg={6}
                className="timeline-item-time"
                style={{ marginTop: 0 }}
              >
                <div>
                  <p className="mb-0 fw-semi-bold text-dark">
                    {usuario.nombre + ' ' + usuario.apellido}
                  </p>
                  <p className="fs--1 text-dark fw-semi-bold">
                    {dayjs(fecha).format('DD/MM/YYYY - HH:mm [hs]')}
                  </p>
                </div>
              </Col>
              <Col lg={6}>
                <div className="timeline-item-content">
                  <div className="timeline-item-card border">
                    <h5 className="mb-2">{nombre}</h5>
                    <p className="fs--1 mb-0">{descripcion}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        );
      })}
    </div>
  );
};

HistorialContent.propTypes = {
  historial: PropTypes.array.isRequired
};

export default HistorialContent;
