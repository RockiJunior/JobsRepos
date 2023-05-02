import axios from 'axios';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const DesasignarExpedienteModal = ({
  openModal,
  setOpenModal,
  expedienteId
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      show={openModal}
      onHide={() => setOpenModal(false)}
      contentClassName="border"
      centered
    >
      <Modal.Header
        closeButton
        className="bg-light px-card border-bottom-0 d-flex align-items-start"
      >
        <Modal.Title as="h5">
          ¿Estás seguro que deseas desasignarte este expediente?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <Button
            size="sm"
            variant="success"
            className="me-1"
            onClick={async () => {
              try {
                await axios.put(
                  process.env.REACT_APP_SERVER +
                    '/expediente/desasignar_empleado',
                  { expedienteId: expedienteId }
                );
                setOpenModal(false);
                navigate('/expedientes');
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <span>Si</span>
          </Button>
          <Button
            className="ms-1"
            size="sm"
            variant="danger"
            onClick={() => setOpenModal(false)}
          >
            <span>No</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
DesasignarExpedienteModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  expedienteId: PropTypes.number.isRequired
};
