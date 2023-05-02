import React from 'react';
import { Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

const TopNavRightSideNavItem = () => {
  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto flex-row align-items-center justify-content-center"
      as="ul"
    >
      <NotificationDropdown />
      <ProfileDropdown />
    </Nav>
  );
};

TopNavRightSideNavItem.propTypes = {
  socket: PropTypes.object,
  establishment: PropTypes.object
};

export default TopNavRightSideNavItem;
