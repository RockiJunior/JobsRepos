import React, { useState } from 'react';
import PropType from 'prop-types';
import {
  Button,
  Card,
  Form,
  FormGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { expedienteGetById } from 'redux/actions/expediente';
import { fiscalizacionCrearNota } from 'redux/actions/fiscalizacion';

const CreateNote = ({ setCreate, fiscalizacionId, onSubmit, expedienteId }) => {
  const dispatch = useDispatch();

  const [descripcion, setDescripcion] = useState('');

  return (
    <div className="mb-3">
      <Card className="border border-3 border-primary">
        <Card.Body className="p-0">
          <FormGroup size="sm">
            <Form.Control
              as="textarea"
              rows={3}
              onChange={e => setDescripcion(e.target.value)}
            />
          </FormGroup>
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-end mt-2">
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-top">
              <strong>Cancelar</strong>
            </Tooltip>
          }
        >
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setDescripcion('');
              setCreate(false);
            }}
            className="p-0 px-1 py-1 d-flex align-items-center justify-content-center"
          >
            <FontAwesomeIcon icon="xmark-circle" className="fs-1" />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-top">
              <strong>Guardar</strong>
            </Tooltip>
          }
        >
          <Button
            variant="success"
            size="sm"
            className="ms-2 p-0 px-1 py-1 d-flex align-items-center justify-content-center"
            onClick={async () => {
              await dispatch(
                fiscalizacionCrearNota(fiscalizacionId, descripcion)
              );
              await dispatch(expedienteGetById(expedienteId));
              setDescripcion('');
              setCreate(false);
              onSubmit && onSubmit();
            }}
          >
            <FontAwesomeIcon icon="circle-check" className="fs-1" />
          </Button>
        </OverlayTrigger>
      </div>
    </div>
  );
};

CreateNote.propTypes = {
  setCreate: PropType.func.isRequired,
  fiscalizacionId: PropType.number.isRequired,
  onSubmit: PropType.func.isRequired,
  expedienteId: PropType.number.isRequired
};

export default CreateNote;
