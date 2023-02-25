import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Outlet } from 'react-router-dom';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Logo from 'components/common/Logo';
import Section from 'components/common/Section';

const InvitacionInvalida = () => {
  return (
    <Section className="py-0">
      <Row className="flex-center min-vh-100 py-6">
        <Col sm={11} md={9} lg={7} xl={6} className="col-xxl-5 w-75">
          <Logo />
          <Card className="text-center">
            <Card.Body className="p-5">
              <div className="display-1 text-700">Error en la invitacion</div>
              <p className="lead mt-4 text-800 font-sans-serif fw-semi-bold">
                El enlace de invitacion es inválido o ha expirado.
              </p>
              <hr />
              <p>
                Por favor, contacta a tu administrador para mayor información.
              </p>
              <Link className="btn btn-primary btn-sm mt-3" to="/">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Home
              </Link>
            </Card.Body>
          </Card>
          <Outlet />
        </Col>
      </Row>
    </Section>
  );
};

export default InvitacionInvalida;
