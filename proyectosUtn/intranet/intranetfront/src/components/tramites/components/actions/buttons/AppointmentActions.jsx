import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  pasoAnterior,
  tramiteGetById,
  upsertInputsValuesNoNotification
} from 'redux/actions/tramite';
import { turnosUpdateStatus } from 'redux/actions/turnos';
import DocumentModal from '../../document/DocumentModal';
import ConfirmacionModal from './ConfirmacionModal';

const AppointmentActions = ({
  setRequestModificationOnAppointment,
  requestModificationOnAppointment,
  tramite,
  goToSection,
  handleAppointmentState
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleCancelRequestModification = () => {
    const secciones = tramite.tipo?.secciones;

    if (secciones) {
      const arrInputs = [];
      secciones.forEach(seccion => {
        seccion.inputs.forEach(input => {
          const estado = input.InputValues?.estado;
          if (estado === 'request') {
            const { id, tramiteId, inputNombre } = input.InputValues;
            arrInputs.push({ id, tramiteId, inputNombre, estado: 'approved' });
          }
        });
      });
      dispatch(upsertInputsValuesNoNotification(arrInputs, tramite.id, true));
    }

    setRequestModificationOnAppointment(false);
  };

  const handleSendModificationRequest = async () => {
    const turno = tramite.turno.find(t => t.estado === 'pending');
    await dispatch(turnosUpdateStatus('rejected', turno.id));
    await dispatch(pasoAnterior(tramite.id));
    await dispatch(tramiteGetById(tramite.id));
    setRequestModificationOnAppointment(false);
  };

  const [showInformeModal, setShowInformeModal] = useState(false);

  const handleOpenInformeModal = () => setShowInformeModal(true);
  const handleCloseInformeModal = () => setShowInformeModal(false);

  const handleConfirmInformeModal = () => {
    handleAppointmentState('rejected');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {requestModificationOnAppointment ? (
        <>
          <Button
            variant="danger"
            onClick={handleCancelRequestModification}
            size="sm"
            className="me-2"
          >
            Cancelar solicitud de modificación
          </Button>
          <Button
            onClick={handleSendModificationRequest}
            variant="success"
            size="sm"
          >
            Enviar solicitud de modificación
          </Button>
        </>
      ) : (
        <>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Reprogramar turno</Tooltip>}
          >
            <Button
              size="lg"
              variant="danger"
              className="p-1 d-flex align-items-center me-2"
              disabled={loading}
              onClick={() => {
                handleOpenInformeModal();
              }}
            >
              <FontAwesomeIcon icon="clock" />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Solicitar modificación</Tooltip>}
          >
            <Button
              size="lg"
              variant="warning"
              className="p-1 d-flex align-items-center me-2"
              disabled={loading}
              onClick={() => {
                setRequestModificationOnAppointment(true), goToSection(0);
              }}
            >
              <FontAwesomeIcon icon="exclamation-circle" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip>{`Aprobar documentación${
                tramite.tipo?.pasos[tramite.pasoActual].intraTitle
                  ? ` y continuar a ${
                      tramite.tipo?.pasos[tramite.pasoActual + 1].intraTitle
                    }`
                  : ''
              }`}</Tooltip>
            }
          >
            <Button
              size="lg"
              variant="success"
              className="p-1 d-flex align-items-center"
              disabled={loading}
              onClick={async () => {
                if (!loading) {
                  setOpenModal(true);
                }
              }}
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                <FontAwesomeIcon icon="circle-check" />
              )}
            </Button>
          </OverlayTrigger>
        </>
      )}

      <DocumentModal
        show={showInformeModal}
        handleClose={handleCloseInformeModal}
        handleConfirm={handleConfirmInformeModal}
        title="Informe de cancelación de turno"
        tramite={tramite}
        type="informe"
      />

      <ConfirmacionModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleAccept={async () => await handleAppointmentState('approved')}
        setLoading={setLoading}
        loading={loading}
        title="aprobar el turno"
      />
    </div>
  );
};

AppointmentActions.propTypes = {
  setRequestModificationOnAppointment: PropTypes.func.isRequired,
  requestModificationOnAppointment: PropTypes.bool.isRequired,
  tramite: PropTypes.object.isRequired,
  goToSection: PropTypes.func.isRequired,
  handleAppointmentState: PropTypes.func.isRequired
};

export default AppointmentActions;
