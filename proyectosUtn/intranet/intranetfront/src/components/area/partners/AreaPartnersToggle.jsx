import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AreaPartnersToggle = ({ setShowAreaPartners, area }) => {
  return (
    <Card
      className="cursor-pointer position-fixed bg-100"
      style={{
        top: '40%',
        right: 0,
        zIndex: 2000,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
      }}
      onClick={() => setShowAreaPartners(true)}
    >
      <Card.Body
        className="d-flex align-items-center py-md-2 px-2"
        style={{ transform: 'rotate(180deg)', writingMode: 'vertical-rl' }}
      >
        <span>Empleados de {area}</span>
        <FontAwesomeIcon className="mt-2" icon="arrow-right" />
      </Card.Body>
    </Card>
  );
};

AreaPartnersToggle.propTypes = {
  setShowAreaPartners: PropTypes.func.isRequired,
  area: PropTypes.string.isRequired
};

export default AreaPartnersToggle;
