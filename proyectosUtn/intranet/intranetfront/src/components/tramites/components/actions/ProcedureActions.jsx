import React from 'react';
import AppointmentActions from './buttons/AppointmentActions';
import Approve from './buttons/Approve';
import ApproveOrReject from './buttons/ApproveOrReject';
import GotoNextStep from './buttons/GotoNextStep';
import GotoPrevStep from './buttons/GotoPrevStep';
import ModificationActions from './buttons/ModificationActions';
import RejectProcedure from './buttons/RejectProcedure';
import PropTypes from 'prop-types';
import ActionsWrapper from 'components/common/ActionsWrapper';
import ApproveTramite from './buttons/ApproveTramite';

const ProcedureActions = ({
  canGoPrevStep,
  canRejectTramite,
  canOnlyApproveOrReject,
  canOnlyApprove,
  canUseAppointmentStep,
  canRequestChanges,
  canGoNextStep,
  tramite,
  goToSection,
  setRequestModification,
  handleAppointmentState,
  requestModification,
  canApproveTramite,
  onlyApproveTitle,
  approveRejectTitle
}) => {
  return (
    <ActionsWrapper>
      {canGoPrevStep && (
        <GotoPrevStep
          tramiteId={tramite.id}
          prevStepTitle={tramite.tipo?.pasos[tramite.pasoActual - 1].intraTitle}
        />
      )}

      {canRejectTramite && <RejectProcedure tramite={tramite} />}

      {!requestModification && canOnlyApproveOrReject && (
        <ApproveOrReject
          tramite={tramite}
          approveRejectTitle={approveRejectTitle}
        />
      )}

      {!requestModification && canOnlyApprove && (
        <Approve tramite={tramite} onlyApproveTitle={onlyApproveTitle} />
      )}

      {canUseAppointmentStep && (
        <AppointmentActions
          setRequestModificationOnAppointment={setRequestModification}
          handleAppointmentState={handleAppointmentState}
          requestModificationOnAppointment={requestModification}
          tramite={tramite}
          goToSection={goToSection}
        />
      )}

      {canRequestChanges && (
        <ModificationActions
          tramite={tramite}
          setRequestModification={setRequestModification}
          requestModification={requestModification}
          goToSection={goToSection}
        />
      )}

      {canGoNextStep && (
        <GotoNextStep
          tramiteId={tramite.id}
          nextStepTitle={tramite.tipo?.pasos[tramite.pasoActual + 1].intraTitle}
        />
      )}

      {canApproveTramite && <ApproveTramite tramite={tramite} />}
    </ActionsWrapper>
  );
};

ProcedureActions.propTypes = {
  canGoPrevStep: PropTypes.bool,
  canRejectTramite: PropTypes.bool,
  canOnlyApproveOrReject: PropTypes.bool,
  canOnlyApprove: PropTypes.bool,
  canUseAppointmentStep: PropTypes.bool,
  canRequestChanges: PropTypes.bool,
  canGoNextStep: PropTypes.bool,
  tramite: PropTypes.object,
  goToSection: PropTypes.func,
  setRequestModification: PropTypes.func,
  handleAppointmentState: PropTypes.func,
  requestModification: PropTypes.bool,
  canApproveTramite: PropTypes.bool,
  onlyApproveTitle: PropTypes.string,
  approveRejectTitle: PropTypes.object
};

export default ProcedureActions;
