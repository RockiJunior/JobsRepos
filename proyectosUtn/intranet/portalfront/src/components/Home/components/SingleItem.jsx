import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export const SingleItem = ({ icon, name, to }) => {
  return (
    <Col xs={12} md={6} lg={4} xl={3}>
      <Flex
        alignItems="center"
        className="border border-1 border-300 rounded-2 p-2 px-3 ask-analytics-item position-relative"
      >
        <FontAwesomeIcon icon={icon} className="text-primary" />
        <Link to={to} className="stretched-link text-decoration-none">
          <h5 className="fs--1 text-600 mb-0 ps-3">{name}</h5>
        </Link>
      </Flex>
    </Col>
  );
};
SingleItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  childrens: PropTypes.array,
  to: PropTypes.string.isRequired
};
