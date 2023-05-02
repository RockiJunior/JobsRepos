import React from 'react';
import moment from 'moment';
moment.locale('es');
import 'moment/locale/es';
import FalconCloseButton from 'components/common/FalconCloseButton';
import { Modal } from 'react-bootstrap';
import ButtonClose from 'utils/buttons/buttonClose';

const ViewRol = ({ rol, closeModalView }) => {
  const handleClose = () => closeModalView();
  const { roleToPermission } = rol;

  return (
    <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>
          Detalles del rol <b>{rol.name}</b>
        </Modal.Title>

        <FalconCloseButton onClick={handleClose} />
      </Modal.Header>

      <Modal.Body className="px-4">
        <div>
          <h5 className="mb-3">Permisos</h5>

          <ul className="d-flex flex-row flex-wrap">
            {roleToPermission &&
              roleToPermission.map((perm, index) => (
                <li key={index} style={{ width: 200 }}>
                  <label>{perm.permission.permissionName}</label>
                </li>
              ))}
          </ul>
        </div>

        <div className="d-flex justify-content-end">
          <ButtonClose text="Cerrar" funcion={handleClose} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewRol;
