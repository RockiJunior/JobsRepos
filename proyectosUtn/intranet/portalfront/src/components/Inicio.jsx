import React from 'react';
import { Card } from 'react-bootstrap';
import { CustomCard } from './common/CustomCard';

const Inicio = () => {
  return (
    <CustomCard title="Inicio" icon="home">
      <Card.Body>
        <Card.Title>tuki</Card.Title>
      </Card.Body>
    </CustomCard>
  );
};

export default Inicio;
