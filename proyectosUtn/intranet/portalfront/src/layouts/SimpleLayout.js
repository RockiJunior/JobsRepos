import Logo from 'components/common/Logo';
import React from 'react';
import { Button, Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';

const SimpleLayout = () => {
  return (
    <>
      <div className="bg-white mb-3 sticky-kit navbar-glass-shadow">
        <Container>
          <Navbar
            style={{ height: '79px' }}
            className="px-0 fs--1 navbar-top"
            collapseOnSelect
            expand="xl"
          >
            <Logo at="navbar-top" width={40} isNavbar />
            <Navbar.Toggle />
            <Navbar.Offcanvas placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="me-auto">
                  {process.env.REACT_APP_LOCAL && (
                    <Nav.Link as={Link} to="/">
                      Inicio
                    </Nav.Link>
                  )}

                  <Nav.Link as={Link} to="/tramites/alta-de-matriculacion">
                    Alta de Matriculación
                  </Nav.Link>

                  <Nav.Link as={Link} to="/turnos">
                    Turnos
                  </Nav.Link>

                  {process.env.REACT_APP_SISTEMA_DENUNCIAS && (
                    <Nav.Link as={Link} to="/tramites/sistema-de-denuncias">
                      Denuncias
                    </Nav.Link>
                  )}
                </Nav>

                <Nav.Item className="navbar-nav-icons ms-auto flex-row align-items-center">
                  <Button
                    variant="link"
                    as={Link}
                    to="/login"
                    className="text-primary fs-2 fs-xl-1 p-0 w-100 w-xl-auto mt-4 mt-xl-0"
                  >
                    Iniciar Sesión
                  </Button>
                </Nav.Item>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Navbar>
        </Container>
      </div>

      <Container className="pb-4">
        <Outlet />
      </Container>
    </>
  );
};

export default SimpleLayout;
