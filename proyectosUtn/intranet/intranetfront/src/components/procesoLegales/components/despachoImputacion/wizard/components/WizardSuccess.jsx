import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { expedienteGetById } from 'redux/actions/expediente';
import {
  procesoLegalCrearDespachoImputacion,
  procesoLegalUpdateDespachoImputacion
} from 'redux/actions/procesoLegales';
import ImputacionesSeleccionadas from './seleccionar/ImputacionesSeleccionadas';

const Success = ({
  reset,
  selectedImputaciones,
  formData,
  imputaciones,
  procesoLegalId,
  expedienteId,
  handleClose,
  goToSection,
  setKey,
  despachoImputacion
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (
      !loading &&
      formData.motivo &&
      formData.titulo &&
      selectedImputaciones.length
    ) {
      setLoading(true);

      if (despachoImputacion) {
        await dispatch(
          procesoLegalUpdateDespachoImputacion(
            despachoImputacion.id,
            selectedImputaciones,
            formData.titulo,
            formData.motivo,
            handleClose,
            reset
          )
        );
      } else {
        await dispatch(
          procesoLegalCrearDespachoImputacion(
            procesoLegalId,
            selectedImputaciones,
            formData.titulo,
            formData.motivo,
            handleClose,
            reset,
            goToSection,
            setKey
          )
        );
      }
      await dispatch(expedienteGetById(expedienteId));

      setLoading(false);
    }
  };

  return (
    <div className="text-center w-100">
      <Row className="text-start">
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <h4 className="fw-bold">{formData.titulo}</h4>
          <p className="text-muted">{formData.motivo}</p>
        </Col>
        <Col>
          <ImputacionesSeleccionadas
            imputaciones={imputaciones}
            selectedImputaciones={selectedImputaciones}
            esVistaPrevia
          />
        </Col>
      </Row>

      <div className="mt-4">
        <Button variant="warning" className="me-1" onClick={reset}>
          Reiniciar
        </Button>

        <Button
          variant="success"
          className="ms-1 display-flex justify-content-center align-items-center"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            'Guardar'
          )}
        </Button>
      </div>
    </div>
  );
};

Success.propTypes = {
  reset: PropTypes.func.isRequired,
  selectedImputaciones: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  imputaciones: PropTypes.array.isRequired,
  procesoLegalId: PropTypes.number.isRequired,
  expedienteId: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  goToSection: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired,
  despachoImputacion: PropTypes.object.isRequired
};

export default Success;
