import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Note from './Note';
import CreateNote from './CreateNote';
import './Notes.css';

const Notes = ({ notes, fiscalizacionId, expedienteId }) => {
  const [create, setCreate] = useState(false);
  const ref = useRef(null);

  return (
    <Card
      style={{
        minHeight: '100%',
        maxHeight: 'calc(100vh - 220px)',
        width: '100%'
      }}
      className="bg-soft-primary border border-3 border-primary"
    >
      <Card.Header className="d-flex justify-content-between">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon="sticky-note" className="d-flex fs-1 me-2" />

          <Card.Title className="m-0 fs-2">Notas</Card.Title>
        </div>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-top">
              <strong>Crear nota</strong>
            </Tooltip>
          }
        >
          <Button
            size="sm"
            variant="primary"
            className="p-0 d-flex align-items-center justify-content-center"
            onClick={() => {
              setCreate(true);
              ref.current.scrollTo(0, 0);
            }}
            style={{ width: '25px', height: '25px' }}
          >
            <FontAwesomeIcon icon="plus" />
          </Button>
        </OverlayTrigger>
      </Card.Header>
      <Card.Body
        className="notes-card pt-0"
        style={{ overflow: 'scroll', overflowX: 'hidden' }}
        ref={ref}
      >
        {create && (
          <CreateNote
            setCreate={setCreate}
            fiscalizacionId={fiscalizacionId}
            expedienteId={expedienteId}
          />
        )}

        {notes.map((note, index) => (
          <div
            key={note.id}
            className={index !== notes.length - 1 ? 'mb-3' : ''}
          >
            <Note note={note} />
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

Notes.propTypes = {
  notes: PropTypes.array.isRequired,
  fiscalizacionId: PropTypes.number.isRequired,
  expedienteId: PropTypes.number.isRequired
};

export default Notes;
