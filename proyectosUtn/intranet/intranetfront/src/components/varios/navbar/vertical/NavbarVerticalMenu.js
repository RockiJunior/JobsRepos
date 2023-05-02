import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Nav, Collapse } from 'react-bootstrap';
import NavbarVerticalMenuItem from './NavbarVerticalMenuItem';
import classNames from 'classnames';
import AppContext from 'context/Context';
import { checkRoutePermissionsArea } from 'utils/checkPermissionsArea';

const CollapseItems = ({ route, empleado }) => {
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
        // {...route}
      >
        <NavbarVerticalMenuItem route={route} />
      </Nav.Link>
      <Collapse in={open}>
        <Nav className="flex-column nav" as="ul">
          <NavbarVerticalMenu routes={route.children} empleado={empleado} />
        </Nav>
      </Collapse>
    </Nav.Item>
  );
};

CollapseItems.propTypes = {
  empleado: PropTypes.object,
  route: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    children: PropTypes.array.isRequired,
    active: PropTypes.bool
  }).isRequired
};

const NavbarVerticalMenu = ({ routes, empleado }) => {
  const {
    config: { showBurgerMenu },
    setConfig
  } = useContext(AppContext);

  const handleNavItemClick = () => {
    if (showBurgerMenu) {
      setConfig('showBurgerMenu', !showBurgerMenu);
    }
  };

  return routes
    .filter(
      route => checkRoutePermissionsArea(route, empleado) && route.visible
    )
    .map((route, index) => {
      if (!route.children) {
        return (
          <div key={route.name + index}>
            <Nav.Item as="li" onClick={handleNavItemClick}>
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
        <React.Fragment key={route.name + index}>
          <CollapseItems route={route} empleado={empleado} />
          <div className="mb-2" />
        </React.Fragment>
      );
    });
};

NavbarVerticalMenu.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape(NavbarVerticalMenuItem.propTypes))
    .isRequired,
  empleado: PropTypes.object
};

export default NavbarVerticalMenu;
