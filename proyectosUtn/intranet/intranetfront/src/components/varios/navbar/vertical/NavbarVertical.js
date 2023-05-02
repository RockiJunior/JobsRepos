import React, { useContext, useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Nav, Navbar, Row, Col } from 'react-bootstrap';
import { navbarBreakPoint } from 'config';
import AppContext from 'context/Context';
import Logo from 'components/common/Logo';
import NavbarVerticalMenu from './NavbarVerticalMenu';
import routes from 'routes/routes';
import { capitalize } from 'helpers/utils';
import bgNavbar from 'assets/img/generic/bg-navbar.png';
import { useSelector } from 'react-redux';
import { checkRoutePermissionsArea } from 'utils/checkPermissionsArea';
import ToggleButton from './ToggleButton';
import { IoBrowsersOutline } from 'react-icons/io5';

const version = 'v1.1.1';

const NavbarVertical = () => {
  const {
    config: { navbarStyle, isNavbarVerticalCollapsed, showBurgerMenu }
  } = useContext(AppContext);

  const { user } = useSelector(state => state.authReducer);

  const HTMLClassList = document.getElementsByTagName('html')[0].classList;

  useEffect(() => {
    if (isNavbarVerticalCollapsed) {
      HTMLClassList.add('navbar-vertical-collapsed');
    } else {
      HTMLClassList.remove('navbar-vertical-collapsed');
    }
    return () => {
      HTMLClassList.remove('navbar-vertical-collapsed-hover');
    };
  }, [isNavbarVerticalCollapsed, HTMLClassList]);

  //Control mouseEnter event
  let time = null;
  const handleMouseEnter = () => {
    if (isNavbarVerticalCollapsed) {
      time = setTimeout(() => {
        HTMLClassList.add('navbar-vertical-collapsed-hover');
      }, 100);
    }
  };
  const handleMouseLeave = () => {
    clearTimeout(time);
    HTMLClassList.remove('navbar-vertical-collapsed-hover');
  };

  const NavbarLabel = ({ label }) => (
    <Nav.Item as="li">
      <Row className="mt-3 mb-2 navbar-vertical-label-wrapper">
        <Col xs="auto" className="navbar-vertical-label navbar-vertical-label">
          {label}
        </Col>
        <Col className="ps-0">
          <hr className="mb-0 navbar-vertical-divider"></hr>
        </Col>
      </Row>
    </Nav.Item>
  );

  const [showDropShadow, setShowDropShadow] = useState(false);

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
    <Navbar expand={navbarBreakPoint} className="navbar-vertical navbar-card">
      <div
        style={{ height: '74px' }}
        className="d-none d-lg-flex align-items-center"
      >
        <ToggleButton />

        <Logo
          at="navbar-vertical"
          isNavbar
          collapsed={!isNavbarVerticalCollapsed}
        />
      </div>

      <Navbar.Collapse
        in={showBurgerMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundImage:
            navbarStyle === 'vibrant'
              ? `linear-gradient(-45deg, rgba(0, 160, 255, 0.86), #0048a2),url(${bgNavbar})`
              : 'none',
          boxShadow: showDropShadow
            ? '.5rem 0 .5rem -.5rem rgba(0,0,0,.2)'
            : 'none'
        }}
      >
        <div className="navbar-vertical-content scrollbar">
          <div className="col-auto navbar-vertical-label mb-2">
            <IoBrowsersOutline /> Módulos
          </div>
          <Nav className="flex-column" as="ul">
            {
              //LINKS MENU HAMBURGUESA:
            }

            {user &&
              routes
                .filter(route =>
                  checkRoutePermissionsArea(route, user.empleado)
                )
                .map(route => (
                  <Fragment key={route.label}>
                    {!route.labelDisable && (
                      <NavbarLabel label={capitalize(route.label)} />
                    )}
                    <NavbarVerticalMenu
                      routes={route.children}
                      empleado={user.empleado}
                    />
                  </Fragment>
                ))}
            <p
              className="position-absolute fs--2 d-inline d-lg-none"
              style={{ bottom: -12, right: 24 }}
            >
              {version}
            </p>
          </Nav>

          <p
            className="position-absolute fs--2 d-none d-lg-inline"
            style={{ bottom: 2, left: 8 }}
          >
            {version}
          </p>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

NavbarVertical.propTypes = {
  label: PropTypes.string
};

export default NavbarVertical;
