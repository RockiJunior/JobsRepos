import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { tramiteGetById, tramitesAprobarPorArea } from 'redux/actions/tramite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmacionModal from './ConfirmacionModal';

const Approve = ({ tramite, onlyApproveTitle }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
      const action = goto.find(g => g.includes('allAreasApproved'));
      if (action) {
        const nextStepIndex = action.split('/')[1];
        const nextStep = tramite.tipo.pasos[nextStepIndex];
        return ` y enviar a ${nextStep.intraTitle}`;
      }
    }
  };

  return (
    <div className="d-flex">
      <div>
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip>
              {onlyApproveTitle || `Aprobar${getTitleApprove()}`}
            </Tooltip>
          }
        >
          <Button
            size="lg"
            variant="success"
            className="p-1 d-flex align-items-center justify-content-center"
            disabled={loading}
            onClick={() => setOpenModal(true)}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FontAwesomeIcon icon="circle-check" />
            )}
          </Button>
        </OverlayTrigger>
      </div>

      <ConfirmacionModal
        openModal={openModal}
        setOpenModal={setOpenModal}
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

Approve.propTypes = {
  tramite: PropTypes.object.isRequired,
  onlyApproveTitle: PropTypes.string
};

export default Approve;
