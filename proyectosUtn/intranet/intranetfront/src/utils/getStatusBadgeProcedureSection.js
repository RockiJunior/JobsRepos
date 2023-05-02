import React from 'react';
import { Badge } from 'react-bootstrap';

export const getStatusBadgeProcedureSection = status => {
  switch (status) {
    case 'sent':
      return (
        <Badge bg="primary" className="ms-2">
          Pendiente de aprobación
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
