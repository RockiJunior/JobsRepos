import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FiscalizacionModal } from 'components/fiscalizaciones/FiscalizacionModal';

const IniciarFiscalizacion = ({ expediente, setKey }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="d-flex">
      <div>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Iniciar fiscalización</Tooltip>}
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

      <FiscalizacionModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        expediente={expediente}
        loading={loading}
        setLoading={setLoading}
        setKey={setKey}
      />
    </div>
  );
};

IniciarFiscalizacion.propTypes = {
  expediente: PropTypes.object.isRequired,
  setKey: PropTypes.func.isRequired
};

export default IniciarFiscalizacion;
