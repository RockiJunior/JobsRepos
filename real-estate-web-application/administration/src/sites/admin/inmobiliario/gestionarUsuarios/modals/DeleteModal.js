import React from 'react'
import FalconCloseButton from 'components/common/FalconCloseButton';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { deleteCollab } from 'redux/colabsSlice';
import ButtonClose from 'utils/buttonClose';
import ButtonAccept from 'utils/buttonAccept';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DeleteModal = ({ user, setShow, switchNewUser, setSwitchNewUser }) => {
  const dispatch = useDispatch()

  const token = localStorage.getItem("token")
  const handleClose = () => setShow(false)

  const handleDelete = async () => {
    const response = await dispatch(deleteCollab(user.id, token))
    if (response < 400) {
      setSwitchNewUser(!switchNewUser)
      handleClose()
    }
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
          <Modal.Title>Deshabilitar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-4'>
            El usuario <b>{user.firstName} {user.lastName}</b> perderá su cuenta y ya no podrá recuperarla.
            <br />
            <br />
            ¿Está seguro de confirmar esta acción?
          </div>
          <div className='d-flex justify-content-end' style={{ gap: 30 }}>
            {ButtonClose('Cancelar', handleClose)}
            {ButtonAccept('Confirmar', handleDelete)}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DeleteModal