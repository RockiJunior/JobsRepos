import React from 'react'
import FalconCloseButton from 'components/common/FalconCloseButton';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import ButtonClose from 'utils/buttonClose';
import ButtonAccept from 'utils/buttonAccept';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DeleteModal = ({ property, setShow, handleStatus }) => {

  const handleClose = () => setShow(false);

  const handleDelete = async (prop) => {
    await handleStatus(prop)
    handleClose()
  }

  return (
    <>
      <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static" >

        <Modal.Header closeButton>
          <FontAwesomeIcon
            icon='fa-trash-can'
            title='Eliminar'
            size='1x'
            style={{ marginRight: 8, color: '#e63757' }} />
          <Modal.Title >Eliminar propiedad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-4'>
            La propiedad de dirección <b>{property.location.street} {property.location.number}</b> se eliminará, lo que la marcará como operación no concretada y los clientes no podrán verla.
            <br />
            <br />
            ¿Está seguro de confirmar esta acción?
          </div>
          <div className='d-flex justify-content-end' style={{gap:30}}>
            {ButtonClose('Cancelar', handleClose)}
            {ButtonAccept('Confirmar', handleDelete, { id: property._id, status: 'deleted' })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DeleteModal