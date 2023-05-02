import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'react-bootstrap';
import './accordionButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const CustomAccordionItem = ({
  eventKey,
  children,
  title,
  isDisabled
}) => {
  return isDisabled ? (
    <h2 className="custom-accordion-button fw-normal m-0 d-flex align-items-center justify-content-between">
      <span>{title}</span>
      <FontAwesomeIcon icon="ban" className="text-danger fs-1" />
    </h2>
  ) : (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>{title}</Accordion.Header>
      <Accordion.Body>{children}</Accordion.Body>
    </Accordion.Item>
  );
};
CustomAccordionItem.propTypes = {
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  title: PropTypes.node,
  isDisabled: PropTypes.bool
};
