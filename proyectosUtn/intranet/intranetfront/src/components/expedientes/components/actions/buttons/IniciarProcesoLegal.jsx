import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmacionModal from './ConfirmacionModal';
import { useDispatch } from 'react-redux';
import { procesoLegalesCrear } from 'redux/actions/procesoLegales';
import { expedienteGetById } from 'redux/actions/expediente';

const IniciarProcesoLegal = ({ expediente, setKey }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleAccept = async () => {
    await dispatch(procesoLegalesCrear(expediente.id));
    await dispatch(expedienteGetById(expediente.id));
    setKey('procesosLegales');
  };

  return (
    <div className="d-flex">
      <div>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Iniciar proceso legal</Tooltip>}
        >
          <Button
            size="lg"
            variant="info"
            className="p-1 d-flex align-items-center justify-content-center"
            disabled={loading}
            onClick={() => setOpenModal(true)}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FontAwesomeIcon icon="plus" />
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
        title="iniciar un proceso legal"
      />
    </div>
  );
};

IniciarProcesoLegal.propTypes = {
  expediente: PropTypes.object.isRequired,
  setKey: PropTypes.func.isRequired
};

export default IniciarProcesoLegal;
