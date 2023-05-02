import ConfirmacionModal from 'components/expedientes/components/actions/buttons/ConfirmacionModal';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { expedienteGetById } from 'redux/actions/expediente';
import {
  fiscalizacionCancelar,
  fiscalizacionFinalizar
} from 'redux/actions/fiscalizacion';
import InformeFiscalizacionModal from '../../../informeFiscalizacion/InformeFiscalizacionModal';

const FinalizarModal = ({
  show,
  setShow,
  fiscalizacionId,
  loading,
  setLoading,
  expedienteId,
  setKey,
  expedienteUserId,
  expediente
}) => {
  const [openModalEnviarLegales, setOpenModalEnviarLegales] = useState(false);
  const [openModalAltaMatriculacion, setOpenModalAltaMatriculacion] =
    useState(false);
  const [openModalFirmoDeclaracion, setOpenModalFirmoDeclaracion] =
    useState(false);
  const [openModalNoEncontroNada, setOpenModalNoEncontroNada] = useState(false);

  const dispatch = useDispatch();

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        centered
        contentClassName="border"
      >
        <Modal.Header closeButton>
          <Modal.Title>Finalizar fiscalización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <OverlayTrigger
              placement="top"
              overlay={
                !expediente.carpeta ? (
                  <Tooltip>
                    El expediente no tiene un matriculado asociado
                  </Tooltip>
                ) : (
                  <div />
                )
              }
            >
              <Button
                size="sm"
                variant="info"
                className="mb-2"
                disabled={loading || !expediente.carpeta}
                onClick={() => {
                  if (!loading && expediente.carpeta) {
                    setOpenModalEnviarLegales(true);
                  }
                }}
              >
                <span>Generar informe y envíar a Legales</span>
              </Button>
            </OverlayTrigger>

            <Button
              size="sm"
              variant="success"
              className="mb-2"
              disabled={loading}
              onClick={() => {
                if (!loading) {
                  setOpenModalAltaMatriculacion(true);
                }
              }}
            >
              <span>Iniciar Alta de Matriculación</span>
            </Button>

            <Button
              size="sm"
              variant="warning"
              className="mb-2"
              disabled={loading}
              onClick={() => {
                if (!loading) {
                  setOpenModalFirmoDeclaracion(true);
                }
              }}
            >
              <span>Firmó la declaración y pagó</span>
            </Button>

            <Button
              className="mb-2"
              size="sm"
              variant="secondary"
              disabled={loading}
              onClick={() => {
                if (!loading) {
                  setOpenModalNoEncontroNada(true);
                }
              }}
            >
              <span>No se encontró nada</span>
            </Button>

            <Button
              size="sm"
              variant="danger"
              disabled={loading}
              onClick={() => setShow(false)}
            >
              <span>Cancelar acción</span>
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <ConfirmacionModal
        openModal={openModalAltaMatriculacion}
        setOpenModal={setOpenModalAltaMatriculacion}
        loading={loading}
        setLoading={setLoading}
        title="iniciar el Alta de Matriculación"
        handleAccept={async () => {
          await dispatch(
            fiscalizacionFinalizar(fiscalizacionId, 'matriculacion')
          );
          await dispatch(expedienteGetById(expedienteId));
        }}
      />

      <ConfirmacionModal
        openModal={openModalFirmoDeclaracion}
        setOpenModal={setOpenModalFirmoDeclaracion}
        loading={loading}
        setLoading={setLoading}
        title="indicar que el matriculado firmó la declaración y pagó"
        handleAccept={async () => {
          await dispatch(
            fiscalizacionFinalizar(fiscalizacionId, 'transaccion')
          );
          await dispatch(expedienteGetById(expedienteId));
        }}
      />

      <ConfirmacionModal
        openModal={openModalNoEncontroNada}
        setOpenModal={setOpenModalNoEncontroNada}
        loading={loading}
        setLoading={setLoading}
        title="cancelar la fiscalizacion"
        handleAccept={async () => {
          await dispatch(fiscalizacionCancelar(fiscalizacionId));
          await dispatch(expedienteGetById(expedienteId));
        }}
      />

      <InformeFiscalizacionModal
        show={openModalEnviarLegales}
        expedienteId={expedienteId}
        handleClose={() => {
          setOpenModalEnviarLegales(false);
        }}
        handleConfirm={async () => {
          await dispatch(fiscalizacionFinalizar(fiscalizacionId, 'informe'));
          await dispatch(expedienteGetById(expedienteId));
          setShow(false);
          setKey('informe');
        }}
        fiscalizacionId={fiscalizacionId}
        expedienteUserId={expedienteUserId}
      />
    </>
  );
};

FinalizarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  fiscalizacionId: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  expedienteId: PropTypes.number.isRequired,
  setKey: PropTypes.func,
  expedienteUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  expediente: PropTypes.object.isRequired
};

export default FinalizarModal;
