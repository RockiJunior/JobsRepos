import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import NavbarVertical from 'components/varios/navbar/vertical/NavbarVertical';
import NavbarTop from 'components/varios/navbar/top/NavbarTop';

const MainLayout = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => {
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }
    }, 0);
  }, []);

  return (
    <>
      <Container fluid>
        <NavbarVertical />
        <div className="content pb-3">
          <NavbarTop />
          <Outlet />
        </div>
      </Container>
    </>
  );
};

MainLayout.propTypes = {
  socket: PropTypes.object
};

export default MainLayout;
