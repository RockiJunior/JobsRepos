import React from 'react'
import FalconCloseButton from 'components/common/FalconCloseButton';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import ButtonClose from 'utils/buttonClose';
import ButtonAccept from 'utils/buttonAccept';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons';

const FinishModal = ({ property, setShow, handleStatus }) => {

  const handleClose = () => setShow(false);

  const handleFinish = async (prop) => {
    await handleStatus(prop)
    handleClose()
  }

  return (
    <>
      <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static" >
        <Modal.Header closeButton>
          <FontAwesomeIcon
            icon={faFlagCheckered}
            title='Finalizar'
            size='1x'
            style={{ marginRight: 8, color: '#0b1727' }} />
          <Modal.Title >Finalizar propiedad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-4'>
            La propiedad de dirección <b>{property.location.street} {property.location.number}</b> se finalizará, lo que la marcará como una operación realizada.
            <br />
            <br />
            ¿Está seguro de confirmar esta acción?
          </div>
          <div className='d-flex justify-content-end' style={{ gap: 30 }}>
            {ButtonClose('Cancelar', handleClose)}
            {ButtonAccept('Confirmar', handleFinish, { id: property._id, status: 'finished' })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default FinishModal