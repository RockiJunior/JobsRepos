import React /* , { useContext } */ from 'react';
import { Nav /*, Tooltip, OverlayTrigger */ } from 'react-bootstrap';
import ProfileDropdown from 'components/navbar/top/ProfileDropdown';
import NotificationDropdown from 'components/navbar/top/NotificationDropdown';
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'context/Context'; */

import PropTypes from 'prop-types';

const TopNavRightSideNavItem = () => {
  /* const {
    config: { isDark, isRTL },
    setConfig
  } = useContext(AppContext); */

  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto flex-row align-items-center"
      as="ul"
    >
      <NotificationDropdown />

      {/* <Nav.Link
        className="theme-control-toggle p-0 px-2"
        onClick={() => setConfig('isDark', !isDark)}
      >
        <OverlayTrigger
          key="left"
          placement={isRTL ? 'bottom' : 'left'}
          overlay={
            <Tooltip id="ThemeColor">
              {isDark ? 'Cambia a modo claro' : 'Cambia a modo oscuro'}
            </Tooltip>
          }
        >
          <div className="theme-control-toggle-label">
            <FontAwesomeIcon icon={isDark ? 'sun' : 'moon'} className="fs-0" />
          </div>
        </OverlayTrigger>
      </Nav.Link> */}

      <ProfileDropdown />
    </Nav>
  );
};

TopNavRightSideNavItem.propTypes = {
  socket: PropTypes.object,
  establishment: PropTypes.object
};

export default TopNavRightSideNavItem;
