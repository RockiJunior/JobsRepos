import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Modal } from 'react-bootstrap';
import ButtonAccept from 'utils/buttons/buttonAccept';
import ButtonClose from 'utils/buttons/buttonClose';

const ConfirmarBorrado = ({ rol, closeModalDelete, handleDelete }) => {
  return (
    <Modal
      keyboard={true}
      show={true}
      onHide={closeModalDelete}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <FontAwesomeIcon
          icon="fa-trash-can"
          title="Eliminar"
          size="1x"
          style={{ marginRight: 8, color: '#e63757' }}
        />

        <Modal.Title>Eliminar rol</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-4">
          El rol <b>{rol.name}</b> será eliminado y los usuarios que lo tengan
          asignado quedarán sin permisos.
          <br />
          <br />
          ¿Está seguro de confirmar esta acción?
        </div>

        <div className="d-flex justify-content-end" style={{ gap: 30 }}>
          <ButtonClose text="Cancelar" funcion={closeModalDelete} />

          <ButtonAccept text="Confirmar" funcion={handleDelete} data={rol.id} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmarBorrado;
