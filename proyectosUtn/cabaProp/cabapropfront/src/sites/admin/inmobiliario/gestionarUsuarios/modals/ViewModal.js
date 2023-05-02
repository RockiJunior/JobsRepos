import React from 'react';
import moment from 'moment';
moment.locale('es');
import 'moment/locale/es';
import FalconCloseButton from 'components/common/FalconCloseButton';
import { Modal } from 'react-bootstrap';
import ButtonClose from 'utils/buttons/buttonClose';

const ViewModal = ({ user, setShow, branchOffices }) => {
  const nombresSucursales = {};
  branchOffices?.map(
    office => (nombresSucursales[office.id] = office.branch_office_name)
  );

  const handleClose = () => setShow(false);
  return (
    <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Detalles de usuario</Modal.Title>

        <FalconCloseButton onClick={handleClose} />
      </Modal.Header>

      <Modal.Body className="px-4">
        {!user ? (
          'cargando...'
        ) : (
          <>
            <div className="mt-1">
              <b>Nombre:</b>
              &nbsp; &nbsp;
              {user.firstName} {user.lastName}
            </div>

            <div className="mt-1">
              <b>Email:</b>
              &nbsp; &nbsp;
              {user.email}
            </div>

            <div className="mt-1">
              <b>DNI:</b>
              &nbsp; &nbsp;
              {user.dni}
            </div>

            <div className="mt-1">
              <b>Teléfono:</b>
              &nbsp; &nbsp;
              {user.phoneNumber === '0' ? 'No asignado' : user.phoneNumber}
            </div>

            <div className="mt-1">
              <b>Estado:</b>
              &nbsp; &nbsp;
              {user.status === 'pending'
                ? 'Pendiente'
                : user.status === 'active'
                ? 'Activo'
                : user.status === 'expired'
                ? 'Expirado'
                : '*Deshabilitado'}
            </div>
          </>
        )}

        <br />

        <div>
          <b>Roles:</b>
        </div>

        <div className="mt-2">
          {user.roleToUser.length === 0
            ? 'Este usuario no tiene roles asignados'
            : user.roleToUser.map((role, index) => (
                <div key={index}>
                  Rol <b>{role.role.name}</b> asignado en{' '}
                  {nombresSucursales[role.branch_office_id]}
                </div>
              ))}
          <br />
          <br />
          {/* {user.deleted_at &&
                        <span>
                            {`*usuario deshabilitado el ${moment(user.deleted_at).format("DD/MM/YYYY")}`}
                        </span>} */}
        </div>

        <div className="d-flex justify-content-end">
          <ButtonClose text="Cerrar" funcion={handleClose} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
