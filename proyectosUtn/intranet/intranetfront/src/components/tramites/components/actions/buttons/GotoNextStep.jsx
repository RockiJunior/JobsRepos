import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { pasoSiguiente, tramiteGetById } from 'redux/actions/tramite';
import PropTypes from 'prop-types';
import ConfirmacionModal from './ConfirmacionModal';

const GotoNextStep = ({ tramiteId, nextStepTitle }) => {
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
          await dispatch(pasoSiguiente(tramiteId));
          await dispatch(tramiteGetById(tramiteId));
        }}
        setLoading={setLoading}
        loading={loading}
        title="aprobar y continuar"
      />
    </div>
  );
};

GotoNextStep.propTypes = {
  tramiteId: PropTypes.number.isRequired,
  nextStepTitle: PropTypes.string
};

export default GotoNextStep;
