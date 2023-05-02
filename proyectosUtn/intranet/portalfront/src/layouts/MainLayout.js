import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarTop from 'components/navbar/top/NavbarTop';
import NavbarVertical from 'components/navbar/vertical/NavbarVertical';
import AppContext from 'context/Context';
import classNames from 'classnames';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';

const MainLayout = () => {
  const { hash, pathname } = useLocation();
  const isKanban = pathname.includes('kanban');
  // const isChat = pathname.includes('chat');

  const {
    config: { /* isFluid, */ navbarPosition }
  } = useContext(AppContext);

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

  const loadingFirstTime = false;

  return (
    <Container
      className="m-0 p-0"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '100%'
      }}
      fluid={true}
    >
      <Container fluid={true} className="m-0">
        {(navbarPosition === 'vertical' || navbarPosition === 'combo') && (
          <NavbarVertical />
        )}
        <div
          className={classNames('content', { 'pb-0': isKanban })}
          style={{
            filter: loadingFirstTime ? 'blur(0.4rem)' : 'blur(0)',
            transition: 'all 1.5s ease-out',
            marginLeft: '35px',
            marginRight: '35px',
            paddingBottom: '16px'
          }}
        >
          <NavbarTop />

          <Outlet />
        </div>
      </Container>
    </Container>
  );
};

MainLayout.propTypes = {
  socket: PropTypes.object
};

export default MainLayout;
