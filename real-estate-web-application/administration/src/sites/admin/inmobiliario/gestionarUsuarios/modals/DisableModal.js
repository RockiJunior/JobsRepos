import React from 'react'
import FalconCloseButton from 'components/common/FalconCloseButton';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { changeCollabStatus } from 'redux/colabsSlice';
import ButtonClose from 'utils/buttonClose';
import ButtonAccept from 'utils/buttonAccept';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DisableModal = ({ user, setShow, switchNewUser, setSwitchNewUser }) => {
  const dispatch = useDispatch()

  const token = localStorage.getItem("token")
  const handleClose = () => setShow(false)
  const handleDisable = async () => {
    dispatch(changeCollabStatus(user.id, 'disabled', token))
    setSwitchNewUser(!switchNewUser)
    handleClose()
  }

  return (
    <>
      <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static" >
        <Modal.Header closeButton>
          <FontAwesomeIcon
            icon='fa-pause'
            title='Deshabilitar'
            size='1x'
            style={{ marginRight: 8, color: '#02a8b5' }} />
          <Modal.Title>Deshabilitar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-4'>
            El usuario <b>{user.firstName} {user.lastName}</b> ya no podrá ingresar con su cuenta.
            <br />
            <br />
            ¿Está seguro de confirmar esta acción?
          </div>
          <div className='d-flex justify-content-end' style={{ gap: 30 }}>
            {ButtonClose('Cancelar', handleClose)}
            {ButtonAccept('Confirmar', handleDisable)}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DisableModal