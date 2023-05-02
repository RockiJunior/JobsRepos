import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {
  expedienteFinalizar,
  expedienteGetById
} from 'redux/actions/expediente';
import ConfirmacionModal from './ConfirmacionModal';

const Finalizar = ({ expediente }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleAccept = async () => {
    await dispatch(expedienteFinalizar(expediente.id));
    await dispatch(expedienteGetById(expediente.id));
  };

  return (
    <div className="d-flex">
      <div>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Finalizar Expediente</Tooltip>}
        >
          <Button
            size="lg"
            variant="primary"
            className="p-1 d-flex align-items-center justify-content-center"
            disabled={loading}
            onClick={() => setOpenModal(true)}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FontAwesomeIcon icon="hourglass-end" />
            )}
          </Button>
        </OverlayTrigger>
      </div>

      <ConfirmacionModal
        loading={loading}
        setLoading={setLoading}
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleAccept={handleAccept}
        title="finalizar el expediente"
      />
    </div>
  );
};

Finalizar.propTypes = {
  expediente: PropTypes.object.isRequired
};

export default Finalizar;
