import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from 'context/Context';

const NavbarNavLink = ({ title, route }) => {
  const {
    config: { navbarCollapsed, showBurgerMenu },
    setConfig
  } = useContext(AppContext);

  const handleClick = () => {
    if (navbarCollapsed) {
      setConfig('navbarCollapsed', !navbarCollapsed);
    }
    if (showBurgerMenu) {
      setConfig('showBurgerMenu', !showBurgerMenu);
    }
  };
  return (
    <Nav.Link
      style={{ color: 'white' }}
      className="py-0 my-0"
      as={title ? 'p' : Link}
      to={route?.to}
      onClick={handleClick}
    >
      {title ? title : route.name}
    </Nav.Link>
  );
};

NavbarNavLink.propTypes = {
  title: PropTypes.string,
  route: PropTypes.shape({
    name: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    active: PropTypes.bool
  })
};

export default NavbarNavLink;
