import React from 'react';
import PropTypes from 'prop-types';
import PropertyListItem from './components/PropertyListItem';
import { Row } from 'react-bootstrap';

const PropsCards = ({ properties }) => {
  return (
    <Row className="g-2">
      {properties.map(property => (
        <PropertyListItem key={property.id} property={property} />
      ))}
    </Row>
  );
};

PropsCards.propTypes = {
  properties: PropTypes.array.isRequired
};

export default PropsCards;
