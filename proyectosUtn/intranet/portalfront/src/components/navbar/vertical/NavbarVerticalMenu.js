import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Nav, Collapse } from 'react-bootstrap';
import NavbarVerticalMenuItem from './NavbarVerticalMenuItem';
import classNames from 'classnames';
import AppContext from 'context/Context';
import { useSelector } from 'react-redux';

const CollapseItems = ({ route }) => {
  const { pathname } = useLocation();

  const openCollapse = childrens => {
    const checkLink = children => {
      if (children.to === pathname) {
        return true;
      }
      return (
        Object.prototype.hasOwnProperty.call(children, 'children') &&
        children.children.some(checkLink)
      );
    };
    return childrens.some(checkLink);
  };

  const [open, setOpen] = useState(openCollapse(route.children));

  return (
    <Nav.Item as="li">
      <Nav.Link
        onClick={() => {
          setOpen(!open);
        }}
        className={classNames('dropdown-indicator cursor-pointer', {
          'text-500': !route.active
        })}
        aria-expanded={open}
        /* {...route} */
      >
        <NavbarVerticalMenuItem route={route} />
      </Nav.Link>
      <Collapse in={open}>
        <Nav className="flex-column nav" as="ul">
          <NavbarVerticalMenu routes={route.children} />
        </Nav>
      </Collapse>
    </Nav.Item>
  );
};

CollapseItems.propTypes = {
  route: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    children: PropTypes.array.isRequired,
    active: PropTypes.bool
  }).isRequired
};

const NavbarVerticalMenu = ({ routes }) => {
  const {
    config: { showBurgerMenu },
    setConfig
  } = useContext(AppContext);

  const handleNavItemClick = () => {
    if (showBurgerMenu) {
      setConfig('showBurgerMenu', !showBurgerMenu);
    }
  };

  const { user } = useSelector(state => state.authReducer);
  const { eventos } = useSelector(state => state.eventoReducer);

  const filterRoutes = route => {
    switch (route.visible) {
      case 'actividadComercial':
        return user?.datos?.actividadComercial;

      case 'eventosLength':
        return !!eventos.length;

      default:
        if (route.visible) {
          return true;
        } else if (route.children) {
          return route.children.some(filterRoutes);
        } else {
          return false;
        }
    }
  };

  return routes.filter(filterRoutes).map(route => {
    if (!route.children) {
      return (
        <div key={route.name}>
          <Nav.Item as="li" onClick={handleNavItemClick} className="mb-lg-1">
            <NavLink
              end={route.exact}
              to={route.to}
              state={{ open: route.to === '/authentication-modal' }}
              className={({ isActive }) =>
                isActive ? 'active nav-link' : 'nav-link'
              }
            >
              <NavbarVerticalMenuItem route={route} />
            </NavLink>
          </Nav.Item>
          <div className="mb-2" />
        </div>
      );
    }
    return (
      <div key={route.name}>
        <CollapseItems route={route} />
        <div className="mb-2" />
      </div>
    );
  });
};

NavbarVerticalMenu.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape(NavbarVerticalMenuItem.propTypes))
    .isRequired
};

export default NavbarVerticalMenu;
