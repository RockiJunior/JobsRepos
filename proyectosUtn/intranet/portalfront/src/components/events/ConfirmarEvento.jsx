import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { eventosAceptarRechazar, eventosGetAll } from 'redux/actions/eventos';
import { useDispatch } from 'react-redux';

const inicialState = {
  invitado1: { nombre: '', dni: '' },
  invitado2: { nombre: '', dni: '' }
};

const ConfirmarEvento = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(inicialState);

  useEffect(() => {
    setFormData(inicialState);
  }, [show]);
  const onSubmit = async () => {
    await dispatch(eventosAceptarRechazar(show, 'confirmado', formData));
    await dispatch(eventosGetAll());
    setShow(false);
  };
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Title className="fs-1 ">Invitados</Modal.Title>

        <Form.Group className="mt-3">
          <Form.Label className="fs-0">Invitado 1</Form.Label> <br />
          <Form.Label>Nombre y Apellido</Form.Label>
          <Form.Control
            type="text"
            value={formData.invitado1.nombre}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                invitado1: { ...prev.invitado1, nombre: e.target.value }
              }))
            }
          />
          <Form.Label>DNI</Form.Label>
          <Form.Control
            type="number"
            value={formData.invitado1.dni}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                invitado1: { ...prev.invitado1, dni: e.target.value }
              }))
            }
          />
        </Form.Group>

        <Form.Group className="mt-4">
          <Form.Label className="fs-0">Invitado 2</Form.Label> <br />
          <Form.Label>Nombre y Apellido</Form.Label>
          <Form.Control
            type="text"
            value={formData.invitado2.nombre}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                invitado2: { ...prev.invitado2, nombre: e.target.value }
              }))
            }
          />
          <Form.Label>DNI</Form.Label>
          <Form.Control
            type="number"
            value={formData.invitado2.dni}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                invitado2: { ...prev.invitado2, dni: e.target.value }
              }))
            }
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => setShow(false)}>
          Cancelar
        </Button>

        <Button variant="success" onClick={onSubmit}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
ConfirmarEvento.propTypes = {
  show: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setShow: PropTypes.func.isRequired
};
export default ConfirmarEvento;
