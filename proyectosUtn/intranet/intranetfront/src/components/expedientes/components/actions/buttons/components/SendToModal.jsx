import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ConfirmacionModal from '../ConfirmacionModal';
import {
  expedienteCambiarArea,
  expedienteGetById
} from 'redux/actions/expediente';
import { useDispatch } from 'react-redux';
import { areasNames } from 'data/areas';

const SendToModal = ({
  show,
  setShow,
  expedienteId,
  loading,
  setLoading,
  areasExpediente
}) => {
  const [areaId, setAreaId] = useState(areasExpediente[0].id);
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setAreaId(areasExpediente[0].id);
  }, [areasExpediente]);

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enviar expediente a otra área</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Área</Form.Label>
            <Form.Select
              value={areaId}
              onChange={e => setAreaId(e.target.value)}
            >
              {areasExpediente.map(area => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShow(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={() => setOpenModal(true)}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Enviar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmacionModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        setLoading={setLoading}
        title={`enviar el expediente a ${areasNames[areaId]}`}
        handleAccept={async () => {
          await dispatch(expedienteCambiarArea(areaId, expedienteId));
          await dispatch(expedienteGetById(expedienteId));
          setShow();
        }}
      />
    </>
  );
};

SendToModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  expedienteId: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  areasExpediente: PropTypes.array.isRequired
};

export default SendToModal;
