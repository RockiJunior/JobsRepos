import ActionsWrapper from 'components/common/ActionsWrapper';
import React from 'react';
import PropTypes from 'prop-types';
import Finalizar from './buttons/Finalizar';

export const FiscalizacionActions = ({
  fiscalizacion,
  expedienteId,
  setKey,
  expedienteUserId,
  expediente
}) => {
  return (
    <ActionsWrapper>
      {fiscalizacion.estado === 'pendiente' && (
        <Finalizar
          fiscalizacion={fiscalizacion}
          expedienteId={expedienteId}
          setKey={setKey}
          expedienteUserId={expedienteUserId}
          expediente={expediente}
        />
      )}
      {false && <div />}
    </ActionsWrapper>
  );
};

FiscalizacionActions.propTypes = {
  fiscalizacion: PropTypes.object.isRequired,
  expedienteId: PropTypes.number.isRequired,
  setKey: PropTypes.func.isRequired,
  expedienteUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  expediente: PropTypes.object.isRequired
};
