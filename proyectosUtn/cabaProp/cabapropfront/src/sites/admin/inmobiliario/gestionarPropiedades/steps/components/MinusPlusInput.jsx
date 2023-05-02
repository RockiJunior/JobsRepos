import React from 'react';
import { Button } from 'react-bootstrap';

export const MinusPlusInput = ({
  handleChangeCarac,
  name,
  title,
  quantity
}) => (
  <div className="text-center">
    <label>{title}</label>

    <div className="caracteristicas__box w-100 d-flex justify-content-center">
      <Button
        variant="falcon-default"
        className="rounded-pill me-2 py-0 px-2"
        size="sm"
        onClick={e => handleChangeCarac(e, name, 'rest')}
      >
        -
      </Button>

      <span className="caracteristicas__quantity">{quantity}</span>

      <Button
        variant="falcon-default"
        className="rounded-pill ms-2 px-2 py-0"
        size="sm"
        onClick={e => handleChangeCarac(e, name, 'add')}
      >
        +
      </Button>
    </div>
  </div>
);
