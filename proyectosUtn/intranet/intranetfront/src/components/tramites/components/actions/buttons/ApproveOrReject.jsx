import React, { useState } from 'react';
import {
  Button,
  Modal,
  OverlayTrigger,
  Spinner,
  Tooltip
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  tramiteGetById,
  tramitesAprobarPorArea,
  tramitesRechazarPorArea
} from 'redux/actions/tramite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DocumentModal from '../../document/DocumentModal';
import ConfirmacionModal from './ConfirmacionModal';

const ApproveOrReject = ({ tramite, approveRejectTitle }) => {
  const dispatch = useDispatch();

  const [showInformeModal, setShowInformeModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenInformeModal = () => setShowInformeModal(true);
  const handleCloseInformeModal = () => setShowInformeModal(false);

  const handleConfirmInformeModal = async () => {
    await dispatch(tramitesRechazarPorArea(tramite.id));
    await dispatch(tramiteGetById(tramite.id));
  };

  const getTitleReject = () => {
    const pasoActualIndex = tramite.pasoActual;
    const paso = tramite.tipo.pasos[pasoActualIndex];

    const goto = paso.onRejectActions.find(action => action.includes('goTo/'));
    if (goto) {
      const stepIndex = goto.split('/')[1];
      const step = tramite.tipo.pasos[stepIndex];
      return `y enviar a ${step.intraTitle}`;
    }
  };

  const getTitleApprove = () => {
    const pasoActualIndex = tramite.pasoActual;
    const paso = tramite.tipo.pasos[pasoActualIndex];

    const goto = paso.goto;
    const nextConditions = paso.nextConditions;

    if (nextConditions) {
      if (nextConditions.includes('allAreasApproved')) {
        const nextStepIndex = pasoActualIndex + 1;
        const nextStep = tramite.tipo.pasos[nextStepIndex];
        return ` y enviar a ${nextStep.intraTitle}`;
      }
    } else if (goto) {
      const condition = goto.find(action =>
        action.includes('allAreasApproved/')
      );
      if (condition) {
        const nextStepIndex = condition.split('/')[1];
        const nextStep = tramite.tipo.pasos[nextStepIndex];
        return ` y enviar a ${nextStep.intraTitle}`;
      }
    }
  };

  return (
    <div className="d-flex">
      <div className="me-2">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip>
              {approveRejectTitle?.rechazar || `Rechazar ${getTitleReject()}`}
            </Tooltip>
          }
        >
          <Button
            size="lg"
            variant="danger"
            className="p-1 d-flex align-items-center"
            disabled={loading}
            onClick={() => setOpenModal(true)}
          >
            <FontAwesomeIcon icon="xmark-circle" />
          </Button>
        </OverlayTrigger>
      </div>

      <div>
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip>
              {approveRejectTitle?.aprobar || `Aprobar${getTitleApprove()}`}
            </Tooltip>
          }
        >
          <Button
            size="lg"
            variant="success"
            className="p-1 d-flex align-items-center justify-content-center"
            disabled={loading}
            onClick={() => setOpenConfirmationModal(true)}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FontAwesomeIcon icon="circle-check" />
            )}
          </Button>
        </OverlayTrigger>
      </div>

      <DocumentModal
        show={showInformeModal}
        handleClose={handleCloseInformeModal}
        handleConfirm={handleConfirmInformeModal}
        tramite={tramite}
        type="informe"
      />

      <Modal
        show={openModal}
        onHide={() => setOpenModal(false)}
        contentClassName="border"
        centered
      >
        <Modal.Header
          closeButton
          className="bg-light px-card border-bottom-0 d-flex align-items-start"
        >
          <Modal.Title>Rechazo de trámite</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="d-flex flex-column align-items-center">
            <Button
              size="sm"
              variant="success"
              className="mb-2"
              onClick={() => {
                handleOpenInformeModal();
              }}
            >
              <span>Generar informe de rechazo</span>
            </Button>

            <Button
              className="mb-2"
              size="sm"
              variant="danger"
              onClick={() => {
                handleConfirmInformeModal();
                setOpenModal(false);
              }}
            >
              <span>Rechazar sin generar informe</span>
            </Button>

            <Button
              size="sm"
              variant="warning"
              onClick={() => setOpenModal(false)}
            >
              <span>Cancelar rechazo</span>
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <ConfirmacionModal
        openModal={openConfirmationModal}
        setOpenModal={setOpenConfirmationModal}
        setLoading={setLoading}
        title="aprobar"
        handleAccept={async () => {
          await dispatch(tramitesAprobarPorArea(tramite.id));
          await dispatch(tramiteGetById(tramite.id));
        }}
      />
    </div>
  );
};

ApproveOrReject.propTypes = {
  tramite: PropTypes.object.isRequired,
  approveRejectTitle: PropTypes.object
};

export default ApproveOrReject;
