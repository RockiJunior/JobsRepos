import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const getStatusIconFiscalizacion = (status, formDataStatus) => {
  const style = { left: -9, top: -9, zIndex: 1 };

  if (formDataStatus) {
    switch (formDataStatus) {
      case 'approved':
        return (
          <div
            className="position-absolute bg-info d-flex justify-content-center align-items-center"
            style={{
              left: -9,
              top: -9,
              borderRadius: '50%',
              width: 17,
              height: 17,
              zIndex: 1
            }}
          >
            <FontAwesomeIcon
              className="text-white"
              icon="floppy-disk"
              style={{ fontSize: '11px' }}
            />
          </div>
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
        <div
          className="position-absolute bg-info d-flex justify-content-center align-items-center"
          style={{
            left: -9,
            top: -9,
            borderRadius: '50%',
            width: 17,
            height: 17
          }}
        >
          <FontAwesomeIcon
            className="text-white"
            icon="floppy-disk"
            style={{ fontSize: '11px' }}
          />
        </div>
      );

    default:
      return null;
  }
};
