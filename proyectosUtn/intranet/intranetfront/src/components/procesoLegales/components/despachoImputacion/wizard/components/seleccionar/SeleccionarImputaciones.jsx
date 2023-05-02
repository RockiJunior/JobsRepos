import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Imputaciones from './Imputaciones';
import ImputacionesSeleccionadas from './ImputacionesSeleccionadas';
import PropTypes from 'prop-types';

const SeleccionarImputaciones = ({
  selectedImputaciones,
  setSelectedImputaciones,
  imputaciones
}) => {
  return (
    <Row>
      <Col>
        <Imputaciones
          selectedImputaciones={selectedImputaciones}
          setSelectedImputaciones={setSelectedImputaciones}
          imputaciones={imputaciones}
        />
      </Col>
      <Col>
        <ImputacionesSeleccionadas
          selectedImputaciones={selectedImputaciones}
          setSelectedImputaciones={setSelectedImputaciones}
          imputaciones={imputaciones}
        />
      </Col>
    </Row>
  );
};

SeleccionarImputaciones.propTypes = {
  selectedImputaciones: PropTypes.array.isRequired,
  setSelectedImputaciones: PropTypes.func.isRequired,
  imputaciones: PropTypes.array.isRequired
};

export default SeleccionarImputaciones;
