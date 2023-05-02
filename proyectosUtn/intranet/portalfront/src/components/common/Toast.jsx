import React from 'react';
import PropTypes from 'prop-types';
import { cssTransition } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'react-bootstrap';

export const Fade = cssTransition({ enter: 'fadeIn', exit: 'fadeOut' });

export const CloseButton = ({ closeToast }) => (
  <FontAwesomeIcon
    icon="times"
    className="my-2 fs--2"
    style={{ opacity: 0.5 }}
    onClick={closeToast}
  />
);

CloseButton.propTypes = { closeToast: PropTypes.func };

export const ToastContent = ({ title, body, time }) => {
  const handleClick = () => {};

  return (
    <div onClick={handleClick}>
      <Row>
        <Col className="pe-4" xs={12}>
          <p className="m-0 text-black">
            <strong className="me-auto">{title}</strong>
          </p>
        </Col>
      </Row>
      <hr className="mt-1 mb-2" />
      <Row>
        <Col xs={12}>
          <p className="m-0 text-black">{body}</p>
        </Col>
      </Row>
      <small
        className="m-0 mb-1 me-2 text-black"
        style={{ position: 'absolute', bottom: 0, right: 0 }}
      >
        {time}
      </small>
    </div>
  );
};

ToastContent.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  time: PropTypes.string,
  appointmentId: PropTypes.any,
  establishmentId: PropTypes.any,
  type: PropTypes.string
};
