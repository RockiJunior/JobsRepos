import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {
  tramiteGetById,
  tramiteSolicitarModificacionPorArea,
  upsertInputsValuesNoNotification
} from 'redux/actions/tramite';
import PropTypes from 'prop-types';

const ModificationActions = ({
  tramite,
  setRequestModification,
  requestModification,
  goToSection
}) => {
  const dispatch = useDispatch();

  const handleCancelRequestModification = () => {
    const secciones = tramite.tipo?.secciones;

    if (secciones) {
      const arrInputs = [];
      secciones.forEach(seccion => {
        seccion.inputs.forEach(input => {
          const estado = input.InputValues?.estado;
          if (estado === 'request') {
            const { id, tramiteId, inputNombre } = input.InputValues;
            arrInputs.push({
              id,
              tramiteId,
              inputNombre,
              estado: 'approved',
              comentario: ''
            });
          }
        });
      });
      dispatch(upsertInputsValuesNoNotification(arrInputs, tramite.id, true));
    }

    setRequestModification(false);
  };

  const handleSendModificationRequest = async () => {
    await dispatch(tramiteSolicitarModificacionPorArea(tramite.id));
    await dispatch(tramiteGetById(tramite.id));
    setRequestModification(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {requestModification ? (
        <>
          <Button
            variant="danger"
            onClick={handleCancelRequestModification}
            size="sm"
          >
            Cancelar solicitud de modificación
          </Button>
          <Button
            onClick={handleSendModificationRequest}
            variant="success"
            size="sm"
            className="ms-2"
          >
            Enviar solicitud de modificación
          </Button>
        </>
      ) : (
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Solicitar modificacion</Tooltip>}
        >
          <Button
            size="lg"
            variant="warning"
            className="p-1 d-flex align-items-center"
            onClick={() => {
              setRequestModification(true), goToSection(0);
            }}
          >
            <FontAwesomeIcon icon="exclamation-circle" />
          </Button>
        </OverlayTrigger>
      )}
    </div>
  );
};

ModificationActions.propTypes = {
  tramite: PropTypes.object.isRequired,
  setRequestModification: PropTypes.func.isRequired,
  requestModification: PropTypes.bool.isRequired,
  goToSection: PropTypes.func.isRequired
};

export default ModificationActions;
