import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import SoftBadge from 'components/common/SoftBadge';
import { expedienteGetById } from 'redux/actions/expediente';
import { fiscalizacionEliminarNota } from 'redux/actions/fiscalizacion';

const Note = ({ note }) => {
  const { user } = useSelector(state => state.authReducer);
  const [showTrash, setShowTrash] = useState(false);
  const { nombre, apellido } = note.empleado.usuario;
  const dispatch = useDispatch();

  return (
    <Card
      className="border border-3 border-primary text-dark bg-white"
      onMouseEnter={() => setShowTrash(true)}
      onMouseLeave={() => setShowTrash(false)}
    >
      <Card.Header className="d-flex justify-content-between pb-0">
        <Card.Subtitle className="m-0 fw-bold">{`${nombre} ${apellido}`}</Card.Subtitle>
        <Card.Subtitle className="m-0">
          {dayjs(note.createdAt).format('DD/MM/YYYY HH:mm')}
        </Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <p className="p-0 m-0">{note.descripcion}</p>
        <div className="d-flex justify-content-end mt-3">
          <SoftBadge bg="primary" className="text-dark">
            {note.empleado.area.nombre}
          </SoftBadge>
        </div>
      </Card.Body>

      {user.id === note.empleadoId && (
        <div
          style={{
            opacity: showTrash ? 1 : 0
          }}
          className="d-flex align-items-center justify-content-center bg-danger trash-notes"
          onClick={async () => {
            await dispatch(fiscalizacionEliminarNota(note.id));
            await dispatch(expedienteGetById(note.expedienteId));
          }}
        >
          <FontAwesomeIcon icon="trash" className="text-white" />
        </div>
      )}
    </Card>
  );
};

Note.propTypes = {
  note: PropTypes.object.isRequired
};

export default Note;
