import React, { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { expedienteGetById } from 'redux/actions/expediente';
import { fiscalizacionCreate } from 'redux/actions/fiscalizacion';
import ConfirmacionModal from 'components/expedientes/components/actions/buttons/ConfirmacionModal';

export const FiscalizacionModal = ({
  expediente,
  openModal,
  setOpenModal,
  loading,
  setLoading,
  setKey
}) => {
  const dispatch = useDispatch();

  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);
  const [titulo, setTitulo] = useState('');

  return (
    <>
      <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar fiscalización</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>Título de la nueva fiscalización</Form.Label>

            <Form.Control
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={() => setOpenModalConfirmacion(true)}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Enviar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmacionModal
        openModal={openModalConfirmacion}
        setOpenModal={setOpenModalConfirmacion}
        setLoading={setLoading}
        title="iniciar una nueva fiscalización"
        handleAccept={async () => {
          await dispatch(fiscalizacionCreate(expediente.id, titulo));
          await dispatch(expedienteGetById(expediente.id));
          setKey('fiscalizaciones');
          setOpenModal(false);
        }}
      />
    </>
  );
};
FiscalizacionModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  expediente: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired
};
