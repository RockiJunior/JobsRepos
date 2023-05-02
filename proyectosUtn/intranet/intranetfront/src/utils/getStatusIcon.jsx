import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const getStatusIcon = (status, formDataStatus) => {
  const style = { left: -9, top: -9, zIndex: 1 };

  if (formDataStatus) {
    switch (formDataStatus) {
      case 'approved':
        return (
          <FontAwesomeIcon
            className="position-absolute text-success"
            icon="check-circle"
            style={style}
          />
        );

      case 'request':
        return (
          <FontAwesomeIcon
            className="position-absolute text-warning"
            icon="exclamation-circle"
            style={style}
          />
        );

      default:
        return null;
    }
  }

  switch (status) {
    case 'approved':
      return (
        <FontAwesomeIcon
          className="position-absolute text-success"
          icon="check-circle"
          style={style}
        />
      );

    case 'sent':
      return (
        <FontAwesomeIcon
          className="position-absolute text-primary"
          icon="question-circle"
          style={style}
        />
      );

    case 'request':
      return (
        <FontAwesomeIcon
          className="position-absolute text-warning"
          icon="exclamation-circle"
          style={style}
        />
      );

    case 'rejected':
      return (
        <FontAwesomeIcon
          className="position-absolute text-danger"
          icon="times-circle"
          style={style}
        />
      );

    default:
      return null;
  }
};
