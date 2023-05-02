import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RegistrationForm from 'components/authentication/RegistrationForm';

const Registration = () => (
  <>
    <Row className="align-items-center mb-2">
      <Col>
        <h5 id="modalLabel">Registrase</h5>
      </Col>
      <Col xs="auto">
        <p className="fs--1 text-600 mb-0">
          Ya tiene un cuenta?{''}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </Col>
    </Row>
    <RegistrationForm />
  </>
);

export default Registration;
