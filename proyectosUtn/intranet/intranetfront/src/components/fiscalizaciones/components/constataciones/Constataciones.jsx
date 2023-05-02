import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Constatacion from './Constatacion';
import NuevaConstatacion from './NuevaConstatacion';

const Constataciones = ({
  constataciones,
  fiscalizacionId,
  expedienteId,
  expedienteUserId,
  isDisabled
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      {!isDisabled && (
        <div className="d-flex justify-content-center mb-2">
          <Button variant="primary" onClick={() => setShow(true)}>
            Añadir Constatación <FontAwesomeIcon icon="plus" />
          </Button>
        </div>
      )}

      {constataciones.map(constatacion => (
        <Constatacion
          constatacion={constatacion}
          expedienteId={expedienteId}
          expedienteUserId={expedienteUserId}
          fiscalizacionId={fiscalizacionId}
          key={constatacion.id}
          isDisabled={isDisabled}
        />
      ))}

      <NuevaConstatacion
        show={show}
        setShow={setShow}
        fiscalizacionId={fiscalizacionId}
        expedienteId={expedienteId}
        expedienteUserId={expedienteUserId}
      />
    </>
  );
};

Constataciones.propTypes = {
  constataciones: PropTypes.array.isRequired,
  fiscalizacionId: PropTypes.number.isRequired,
  expedienteId: PropTypes.number.isRequired,
  expedienteUserId: PropTypes.number,
  isDisabled: PropTypes.bool
};

export default Constataciones;
