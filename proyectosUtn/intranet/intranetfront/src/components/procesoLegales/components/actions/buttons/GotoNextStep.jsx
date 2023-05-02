import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { procesoLegalPasoSiguiente } from 'redux/actions/procesoLegales';
import { expedienteGetById } from 'redux/actions/expediente';
import ConfirmacionModal from 'components/expedientes/components/actions/buttons/ConfirmacionModal';

const GotoNextStep = ({ procesoLegalId, expedienteId, nextStepTitle }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
          <Tooltip>{`Aprobar y continuar${
            nextStepTitle ? ` a ${nextStepTitle}` : ''
          }`}</Tooltip>
        }
      >
        <Button
          size="lg"
          variant="success"
          className="p-1 d-flex align-items-center justify-content-center"
          disabled={loading}
          onClick={() => setOpenModal(true)}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <FontAwesomeIcon icon="circle-check" />
          )}
        </Button>
      </OverlayTrigger>

      <ConfirmacionModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleAccept={async () => {
          await dispatch(procesoLegalPasoSiguiente(procesoLegalId));
          await dispatch(expedienteGetById(expedienteId));
        }}
        setLoading={setLoading}
        loading={loading}
        title="aprobar y continuar"
      />
    </div>
  );
};

GotoNextStep.propTypes = {
  nextStepTitle: PropTypes.string,
  procesoLegalId: PropTypes.number.isRequired,
  expedienteId: PropTypes.number.isRequired
};

export default GotoNextStep;
