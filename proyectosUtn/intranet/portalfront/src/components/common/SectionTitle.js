import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import { Col } from 'react-bootstrap';

const SectionTitle = ({ title, subtitle, icon, transform, className }) => {
  return (
    <Flex className={className} alignItems="center">
      <span className="fa-stack ms-n1 me-2">
        <FontAwesomeIcon icon="circle" className="text-primary fa-stack-2x" />
        <FontAwesomeIcon
          icon={icon}
          transform={transform}
          className="text-white fa-stack-1x"
          inverse
        />
      </span>
      <Col>
        <h5 className="mb-0 text-primary position-relative">
          <span className="border position-absolute top-50 translate-middle-y w-100 start-0"></span>
          <span className="bg-200 position-absolute dark__bg--1100 pe-3">
            <strong className="fs-1">{title}</strong>
          </span>
          <span className="bg-200 dark__bg--1100 pe-3">
            <strong className="fs-1">{title}</strong>
          </span>
        </h5>
        {subtitle && <p className="mb-0">{subtitle}</p>}
      </Col>
    </Flex>
  );
};

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  transform: PropTypes.string,
  className: PropTypes.string
};

export default SectionTitle;
