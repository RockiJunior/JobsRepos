import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const style = {
  left: -7,
  top: -7,
  zIndex: 1,
  borderRadius: '50%'
};

const getStatusIcon = status => {
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
          className="position-absolute text-primary bg-white"
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

export default getStatusIcon;
