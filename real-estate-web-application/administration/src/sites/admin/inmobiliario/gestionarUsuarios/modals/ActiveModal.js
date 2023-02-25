import React from 'react'
import FalconCloseButton from 'components/common/FalconCloseButton';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { activeCollab, changeCollabStatus } from 'redux/colabsSlice';
import ButtonClose from 'utils/buttonClose';
import ButtonAccept from 'utils/buttonAccept';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ActiveModal = ({ user, setShow, switchNewUser, setSwitchNewUser }) => {
  const dispatch = useDispatch()
  
  const token = localStorage.getItem("token")
  const handleClose = () => setShow(false);

  const handleActive = async () => {
    if (user.password) {
      dispatch(activeCollab(user.id, token))
    } else {
      dispatch(changeCollabStatus(user.id, 'pending', token))
    }
    setSwitchNewUser(!switchNewUser)
    handleClose()
  }

  return (
    <>
      <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
        <FontAwesomeIcon
                icon='fa-power-off'
                size='1x'
                title='Activar'
                style={{ marginRight: 8, color: '#00d97e'}}
            />
          <Modal.Title >Activar usuarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-4'>
            El usuario <b>{user.firstName} {user.lastName}</b> podrá volver a ingresar y operar en la plataforma.
            <br />
            <br />
            ¿Está seguro de confirmar esta acción?.
          </div>
          <div className='d-flex justify-content-end' style={{gap:30}}>
            {ButtonClose('Cancelar', handleClose)}
            {ButtonAccept('Activar', handleActive)}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ActiveModal