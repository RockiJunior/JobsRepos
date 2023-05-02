import React, { useContext, useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import classNames from 'classnames';
import AppContext from 'context/Context';
import Logo from 'components/common/Logo';

import { navbarBreakPoint, topNavbarBreakpoint } from 'config';
import TopNavRightSideNavItem from './TopNavRightSideNavItem';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';

const NavbarTop = ({ socket, establishment }) => {
  const {
    config: { showBurgerMenu, navbarPosition, navbarCollapsed },
    setConfig
  } = useContext(AppContext);

  const { pathname } = useLocation();
  const isChat = pathname.includes('chat');

  const [showDropShadow, setShowDropShadow] = useState(false);

  const handleBurgerMenu = () => {
    navbarPosition === 'top' && setConfig('navbarCollapsed', !navbarCollapsed);
    (navbarPosition === 'vertical' || navbarPosition === 'combo') &&
      setConfig('showBurgerMenu', !showBurgerMenu);
  };

  const setDropShadow = () => {
    const el = document.documentElement;
    if (el.scrollTop > 0) {
      setShowDropShadow(true);
    } else {
      setShowDropShadow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', setDropShadow);
    return () => window.removeEventListener('scroll', setDropShadow);
  }, []);

  return (
    <Navbar
      className={classNames('navbar-glass  fs--1 navbar-top sticky-kit', {
        // 'navbar-glass-shadow': showDropShadow
        'navbar-glass-shadow': showDropShadow && !isChat
      })}
      expand={
        navbarPosition === 'top' || navbarPosition === 'combo'
          ? topNavbarBreakpoint
          : true
      }
      style={{ height: '79px' }}
    >
      <Navbar.Toggle
        className={classNames('toggle-icon-wrapper me-md-3 me-2', {
          'd-lg-none': navbarPosition === 'top',
          [`d-${navbarBreakPoint}-none`]:
            navbarPosition === 'vertical' || navbarPosition === 'combo'
        })}
        as="div"
      >
        <button
          className="navbar-toggler-humburger-icon btn btn-link d-flex flex-center"
          onClick={handleBurgerMenu}
          id="burgerMenu"
        >
          <span className="navbar-toggle-icon">
            <span className="toggle-line" />
          </span>
        </button>
      </Navbar.Toggle>

      <Logo at="navbar-top" width={40} id="topLogo" isNavbar={true} />

      <TopNavRightSideNavItem socket={socket} establishment={establishment} />
    </Navbar>
  );
};

NavbarTop.propTypes = {
  socket: PropTypes.object,
  establishment: PropTypes.object
};

export default NavbarTop;
