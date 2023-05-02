/* eslint-disable react/prop-types */
import dayjs from 'dayjs';
import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import './nice-scroll.css';

const Hourpicker = ({
  events,
  appointment,
  setAppointment,
  className,
  style
}) => {
  return (
    <div className={className} style={style}>
      {events.length ? (
        events.map((event, index) => (
          <div key={index + 't'} className="p-1">
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center"
              onChange={() => {
                setAppointment(event);
              }}
              style={{ paddingTop: 7, paddingBottom: 7 }}
            >
              <div className="d-flex align-items-center">
                <Form.Check
                  checked={
                    JSON.stringify(appointment) === JSON.stringify(event)
                  }
                  type="radio"
                  className="pe-3"
                />

                <p style={{ fontSize: 13 }} className="m-0">
                  {dayjs(event.inicio).format('HH:mm')} a{' '}
                  {dayjs(event.fin).format('HH:mm')}
                </p>
              </div>
            </ListGroup.Item>
          </div>
        ))
      ) : (
        <ListGroup.Item className="text-center" style={{ fontSize: '14px' }}>
          Seleccione un día disponible
        </ListGroup.Item>
      )}
    </div>
  );
};

export default Hourpicker;
