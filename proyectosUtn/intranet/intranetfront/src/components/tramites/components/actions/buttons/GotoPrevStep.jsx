import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import {
  Button,
  Modal,
  OverlayTrigger,
  Spinner,
  Tooltip
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { pasoAnterior, tramiteGetById } from 'redux/actions/tramite';
import PropTypes from 'prop-types';
import CreateNote from '../../notes/CreateNote';

const GotoPrevStep = ({ tramiteId, prevStepTitle }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

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
          <Tooltip>
            {`Devolver el tramite${
              prevStepTitle ? ` a ${prevStepTitle}` : ' al paso anterior'
            }`}
          </Tooltip>
        }
      >
        <Button
          size="lg"
          variant="info"
          className="p-1 d-flex align-items-center justify-content-center"
          disabled={loading}
          onClick={() => setShowNotes(true)}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <FontAwesomeIcon icon="arrow-circle-left" />
          )}
        </Button>
      </OverlayTrigger>
      <Modal show={showNotes} onHide={() => setShowNotes(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nota</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <CreateNote
            tramiteId={tramiteId}
            setCreate={setShowNotes}
            suggestion="Lo devuelvo porque..."
            onSubmit={async () => {
              if (!loading) {
                setLoading(true);
                await dispatch(pasoAnterior(tramiteId));
                await dispatch(tramiteGetById(tramiteId));
                setLoading(false);
              }
            }}
            textButtons
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

GotoPrevStep.propTypes = {
  tramiteId: PropTypes.number.isRequired,
  prevStepTitle: PropTypes.string.isRequired
};

export default GotoPrevStep;
