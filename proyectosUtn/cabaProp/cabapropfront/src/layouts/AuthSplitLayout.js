import React from 'react';
import PropTypes from 'prop-types';
import Background from 'components/common/Background';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import Logo from 'components/common/Logo';

const AuthSplitLayout = ({ children, bgProps }) => {
  return (
    <Container fluid>
      <Row className="min-vh-100 bg-100">
        <Col xs={6} className="d-none d-lg-block position-relative">
          {bgProps && <Background {...bgProps} />}
        </Col>
        <Col
          sm={10}
          md={6}
          className="px-sm-0 d-flex align-items-center mx-auto justify-content-center py-5"
        >
          <div style={{ maxWidth: '400px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Logo className="fs-4 z-index-1 position-relative" />
            </Link>

            <Card className="mt-4">
              <Card.Body className="p-4">{children || <Outlet />}</Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

AuthSplitLayout.propTypes = {
  children: PropTypes.node,
  bgProps: PropTypes.shape(Background.propTypes).isRequired
};

export default AuthSplitLayout;
