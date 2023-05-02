import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { cedulaGetById, cedulaPasoSiguiente } from 'redux/actions/cedula';

const GotoNextStep = ({ cedulaId, pasoActual, pasos }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip>Continuar a {pasos[pasoActual + 1].intraTitle}</Tooltip>
        }
      >
        <Button
          size="lg"
          variant="success"
          className="p-1 d-flex align-items-center justify-content-center"
          disabled={loading}
          onClick={async () => {
            if (!loading) {
              setLoading(true);
              await dispatch(cedulaPasoSiguiente(cedulaId));
              await dispatch(cedulaGetById(cedulaId));
              setLoading(false);
            }
          }}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <FontAwesomeIcon icon="circle-check" />
          )}
        </Button>
      </OverlayTrigger>
    </div>
  );
};

GotoNextStep.propTypes = {
  cedulaId: PropTypes.number.isRequired,
  pasoActual: PropTypes.number.isRequired,
  pasos: PropTypes.array.isRequired
};

export default GotoNextStep;
