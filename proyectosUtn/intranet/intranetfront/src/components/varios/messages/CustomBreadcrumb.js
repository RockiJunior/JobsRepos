import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomBreadcrumb = ({ links }) => {
  return (
    <>
      <Row>
        <Col>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              {links.map((link, i) => {
                return !link.active ? (
                  <li className="breadcrumb-item" key={i}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ) : (
                  <li className="breadcrumb-item active" key={i}>
                    {link.name}
                  </li>
                );
              })}
            </ol>
          </nav>
        </Col>
      </Row>
    </>
  );
};

CustomBreadcrumb.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      path: PropTypes.string,
      name: PropTypes.string
    })
  )
};

export default CustomBreadcrumb;
