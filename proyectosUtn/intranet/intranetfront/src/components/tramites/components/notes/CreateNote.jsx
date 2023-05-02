import React, { useState } from 'react';
import PropType from 'prop-types';
import {
  Button,
  Card,
  Form,
  FormGroup,
  OverlayTrigger,
  Spinner,
  Tooltip
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { tramiteGetById, tramitesCrearNota } from 'redux/actions/tramite';
import { useDispatch } from 'react-redux';

const CreateNote = ({
  setCreate,
  tramiteId,
  suggestion,
  onSubmit,
  textButtons
}) => {
  const dispatch = useDispatch();

  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="mb-3">
      <Card className="border border-3 border-primary">
        <Card.Body className="p-0">
          <FormGroup size="sm">
            <Form.Control
              as="textarea"
              rows={3}
              onChange={e => setDescripcion(e.target.value)}
              value={descripcion}
              placeholder={suggestion}
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
            {textButtons ? (
              'Cancelar'
            ) : (
              <FontAwesomeIcon icon="xmark-circle" className="fs-1" />
            )}
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
              if (descripcion && !loading) {
                setLoading(true);
                await dispatch(tramitesCrearNota(tramiteId, descripcion));
                onSubmit && onSubmit();
                await dispatch(tramiteGetById(tramiteId));
                setDescripcion('');
                setCreate(false);
                setLoading(false);
              }
            }}
            disabled={!descripcion}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : textButtons ? (
              'Enviar'
            ) : (
              <FontAwesomeIcon icon="circle-check" className="fs-1" />
            )}
          </Button>
        </OverlayTrigger>
      </div>
    </div>
  );
};

CreateNote.propTypes = {
  setCreate: PropType.func.isRequired,
  tramiteId: PropType.number.isRequired,
  suggestion: PropType.string,
  onSubmit: PropType.func,
  textButtons: PropType.bool
};

export default CreateNote;
