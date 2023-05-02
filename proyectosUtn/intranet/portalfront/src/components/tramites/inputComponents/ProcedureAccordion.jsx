import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Badge } from 'react-bootstrap';
import ProcedureInputs from './ProcedureInputs';
import ProcedureValues from './values/ProcedureValues';

const getStatusBadge = status => {
  switch (status) {
    case 'sent':
      return (
        <Badge bg="primary" className="ms-2">
          Envíado
        </Badge>
      );

    case 'approved':
      return (
        <Badge bg="success" className="ms-2">
          Aprobado
        </Badge>
      );

    case 'request':
      return (
        <Badge bg="warning" className="ms-2">
          Solicitud de modificación
        </Badge>
      );

    case 'rejected':
      return (
        <Badge bg="danger" className="ms-2">
          Rechazado
        </Badge>
      );

    default:
      return (
        <Badge bg="secondary" className="ms-2">
          Pendiente de subir
        </Badge>
      );
  }
};

function ObservationsNotes({ observations }) {
  return (
    <ul className="mb-4 text-danger">
      {observations.map((observation, index) => (
        <li key={index}>
          <span className="fw-bold">{observation.titulo}: </span>
          <span className="text-dark">{observation.comentario}</span>
        </li>
      ))}
    </ul>
  );
}

ObservationsNotes.propTypes = {
  observations: PropTypes.array
};

const ProcedureAccordion = ({ secciones, tramiteId, cantAddData }) => {
  return (
    <Accordion>
      {secciones
        .filter(s => s.tipo !== 'interno' && s.tipo !== 'infraccion')
        .map((accordionItem, index) => (
          <Accordion.Item key={index} eventKey={index}>
            <Accordion.Header>
              {accordionItem.titulo}
              {!cantAddData && getStatusBadge(accordionItem.estado)}
            </Accordion.Header>
            <Accordion.Body>
              {accordionItem.comentarios &&
                accordionItem.estado === 'request' && (
                  <ObservationsNotes observations={accordionItem.comentarios} />
                )}
              {!cantAddData ? (
                <ProcedureInputs
                  inputs={accordionItem.inputs}
                  title={accordionItem.titulo}
                  status={accordionItem.estado}
                  isDisabled={
                    accordionItem.estado === 'rejected' ||
                    accordionItem.estado === 'sent' ||
                    accordionItem.estado === 'approved'
                  }
                  tramiteId={tramiteId}
                />
              ) : (
                <ProcedureValues
                  values={accordionItem.inputs}
                  title={accordionItem.titulo}
                  status={accordionItem.estado}
                  tramiteId={tramiteId}
                />
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
    </Accordion>
  );
};

ProcedureAccordion.propTypes = {
  secciones: PropTypes.array,
  tramiteId: PropTypes.number,
  cantAddData: PropTypes.bool
};

export default ProcedureAccordion;
