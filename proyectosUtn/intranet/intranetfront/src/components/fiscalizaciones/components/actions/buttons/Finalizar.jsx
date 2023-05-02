import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import FinalizarModal from './components/FinalizarModal';

const Finalizar = ({
  fiscalizacion,
  expedienteId,
  setKey,
  expedienteUserId,
  expediente
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="d-flex">
      <div>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Finalizar fiscalización</Tooltip>}
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

      <FinalizarModal
        show={openModal}
        setShow={setOpenModal}
        fiscalizacionId={fiscalizacion.id}
        loading={loading}
        setLoading={setLoading}
        expedienteId={expedienteId}
        setKey={setKey}
        expedienteUserId={expedienteUserId}
        expediente={expediente}
      />
    </div>
  );
};

Finalizar.propTypes = {
  fiscalizacion: PropTypes.object.isRequired,
  expedienteId: PropTypes.number.isRequired,
  setKey: PropTypes.func.isRequired,
  expedienteUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  expediente: PropTypes.object.isRequired
};

export default Finalizar;
