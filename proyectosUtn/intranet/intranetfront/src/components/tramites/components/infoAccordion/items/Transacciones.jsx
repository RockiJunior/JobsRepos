import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import Transaccion from '../../transactions/Transaccion';

function Transacciones({ transacciones }) {
  return (
    <div>
      {transacciones?.length ? (
        <Row>
          {transacciones.map(transaccion => (
            <Transaccion key={transaccion.id} transaccion={transaccion} />
          ))}
        </Row>
      ) : (
        <h3>No hay pagos pendientes</h3>
      )}
    </div>
  );
}

Transacciones.propTypes = {
  transacciones: PropTypes.array
};

export default Transacciones;
