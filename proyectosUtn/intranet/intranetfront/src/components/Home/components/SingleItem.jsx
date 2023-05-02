import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export const SingleItem = ({ icon, name, to }) => {
  return (
    <Col
      xs={12}
      className="border border-1 border-300 rounded-2 p-3 ask-analytics-item position-relative mb-3"
    >
      <Flex alignItems="center" className="align-items-center">
        <FontAwesomeIcon
          icon={icon}
          className="svg-inline--fa fa-bug fa-w-16 text-primary"
        />
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
