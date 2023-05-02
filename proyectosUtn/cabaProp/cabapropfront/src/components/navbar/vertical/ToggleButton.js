import React, { useContext } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AppContext from 'context/Context';
import Logo from 'components/common/Logo';

const renderTooltip = props => (
  <Tooltip id="button-tooltip" {...props}>
    Toggle Navigation
  </Tooltip>
);

const ToggleButtonWithLogo = () => {
  const {
    config: { isNavbarVerticalCollapsed, isFluid, isRTL },
    setConfig
  } = useContext(AppContext);

  const handleClick = () => {
    document
      .getElementsByTagName('html')[0]
      .classList.toggle('navbar-vertical-collapsed');
    setConfig('isNavbarVerticalCollapsed', !isNavbarVerticalCollapsed);
  };

  return (
    <OverlayTrigger
      placement={
        isFluid ? (isRTL ? 'bottom' : 'right') : isRTL ? 'bottom' : 'left'
      }
      overlay={renderTooltip}
    >
      <div
        className="toggle-icon-wrapper m-0 d-flex align-items-center"
        style={{ minWidth: 250, width: 250 }}
      >
        <Button
          variant="link"
          className="navbar-toggler-humburger-icon navbar-vertical-toggle ms-1"
          id="toggleNavigationTooltip"
          onClick={handleClick}
          style={{ aspectRatio: '1/1' }}
        >
          <span className="navbar-toggle-icon">
            <span className="toggle-line" />
          </span>
        </Button>
        <Logo at="navbar-vertical" />
      </div>
    </OverlayTrigger>
  );
};

export default ToggleButtonWithLogo;
