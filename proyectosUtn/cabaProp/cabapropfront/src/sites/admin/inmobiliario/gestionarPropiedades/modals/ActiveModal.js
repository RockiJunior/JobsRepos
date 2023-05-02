import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import ButtonAccept from 'utils/buttons/buttonAccept';
import ButtonClose from 'utils/buttons/buttonClose';

const ActiveModal = ({ property, setShow, handleStatus }) => {
  const handleClose = () => setShow(false);

  const handleActive = async prop => {
    await handleStatus(prop);
    handleClose();
  };

  return (
    <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <FontAwesomeIcon
          icon="fa-power-off"
          size="1x"
          title="Activar"
          style={{ marginRight: 8, color: '#00d97e' }}
        />

        <Modal.Title>Activar propiedad</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-4">
          La propiedad de dirección{' '}
          <b>
            {property.location.street} {property.location.number}
          </b>{' '}
          se activará y los clientes podrán verla y consultar por ella.
          <br />
          <br />
          ¿Está seguro de confirmar esta acción?
        </div>

        <div className="d-flex justify-content-end" style={{ gap: 30 }}>
          <ButtonClose text="Cancelar" funcion={handleClose} />

          <ButtonAccept
            text="Confirmar"
            funcion={handleActive}
            data={{ id: property._id, status: 'published' }}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ActiveModal;
