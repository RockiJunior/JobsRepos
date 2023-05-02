import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';

const CustomTab = ({ isBadge, eventKey, title, isVisible }) => {
  return isVisible ? (
    <Nav.Item className="nav-tabs position-relative">
      {isBadge && (
        <div
          style={{
            height: 8,
            width: 8,
            backgroundColor: 'red',
            borderRadius: '50%',
            position: 'absolute',
            top: 3,
            right: 5
          }}
        />
      )}
      <Nav.Link eventKey={eventKey}>{title}</Nav.Link>
    </Nav.Item>
  ) : null;
};

CustomTab.propTypes = {
  isBadge: PropTypes.bool,
  eventKey: PropTypes.string,
  title: PropTypes.string,
  isVisible: PropTypes.bool
};

export default CustomTab;
