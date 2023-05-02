import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import SendToModal from './components/SendToModal';

const SendTo = ({ expediente, areasExpediente }) => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="d-flex">
      <div>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Envíar a otra área</Tooltip>}
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
              <FontAwesomeIcon icon="paper-plane" />
            )}
          </Button>
        </OverlayTrigger>
      </div>

      <SendToModal
        show={openModal}
        setShow={setOpenModal}
        expedienteId={expediente.id}
        loading={loading}
        setLoading={setLoading}
        areasExpediente={areasExpediente}
      />
    </div>
  );
};

SendTo.propTypes = {
  expediente: PropTypes.object.isRequired,
  areasExpediente: PropTypes.array.isRequired
};

export default SendTo;
