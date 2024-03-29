import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { resendInvitation } from 'redux/colabsSlice';
import ButtonAccept from 'utils/buttons/buttonAccept';
import ButtonClose from 'utils/buttons/buttonClose';

const ResendModal = ({
  user,
  setShow,
  show,
  switchNewUser,
  setSwitchNewUser
}) => {
  const dispatch = useDispatch();
  const data = {
    email: user.email,
    dni: user.dni
  };

  const handleClose = () => setShow(false);

  const handleResend = () => {
    dispatch(resendInvitation(data));
    setSwitchNewUser(!switchNewUser);
    handleClose();
  };

  return (
    <>
      <Modal keyboard={true} show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <FontAwesomeIcon
            icon="fa-rotate-right"
            title="Reenviar"
            size="1x"
            style={{ marginRight: 8, color: '#6b5eae' }}
          />

          <Modal.Title>Reenviar invitación</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-4">
            El usuario{' '}
            <b>
              {user.firstName} {user.lastName}
            </b>{' '}
            recibirá un nuevo email con la invitación y tendrá 24 horas para
            ingresar al enlace y registrar su contraseña.
            <br />
            <br />
            ¿Está seguro de confirmar esta acción?
          </div>

          <div className="d-flex justify-content-end" style={{ gap: 30 }}>
            <ButtonClose text="Cancelar" funcion={handleClose} />

            <ButtonAccept text="Enviar" funcion={handleResend} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ResendModal;
