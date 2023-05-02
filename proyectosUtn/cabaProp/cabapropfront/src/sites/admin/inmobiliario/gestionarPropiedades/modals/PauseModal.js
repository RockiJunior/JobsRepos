import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import ButtonAccept from 'utils/buttons/buttonAccept';
import ButtonClose from 'utils/buttons/buttonClose';

const PauseModal = ({ property, setShow, handleStatus }) => {
  const handleClose = () => setShow(false);

  const handlePause = async prop => {
    await handleStatus(prop);
    handleClose();
  };

  return (
    <>
      <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <FontAwesomeIcon
            icon="fa-pause"
            title="Pausar"
            size="1x"
            style={{ marginRight: 8, color: '#02a8b5' }}
          />

          <Modal.Title>Pausar propiedad</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-4">
            La propiedad de dirección{' '}
            <b>
              {property.location.street} {property.location.number}
            </b>{' '}
            se pausará y ya no será visible por los clientes.
            <br />
            <br />
            ¿Está seguro de confirmar esta acción?
          </div>

          <div className="d-flex justify-content-end" style={{ gap: 30 }}>
            <ButtonClose text="Cancelar" funcion={handleClose} />

            <ButtonAccept
              text="Confirmar"
              funcion={handlePause}
              data={{ id: property._id, status: 'paused' }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PauseModal;
