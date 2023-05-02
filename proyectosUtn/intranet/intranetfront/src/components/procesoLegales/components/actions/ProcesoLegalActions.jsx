import React from 'react';
import GotoNextStep from './buttons/GotoNextStep';
import GotoPrevStep from './buttons/GotoPrevStep';
import PropTypes from 'prop-types';
import ActionsWrapper from 'components/common/ActionsWrapper';
import ApproveOrReject from './buttons/ApproveOrReject';
import Approve from './buttons/Approve';

const ProcesoLegalActions = ({
  canGoPrevStep,
  canGoNextStep,
  canOnlyApproveOrReject,
  canOnlyApprove,
  procesoLegal,
  expediente,
  approveRejectTitle,
  onlyApproveTitle
  /* goToSection */
}) => {
  return (
    <ActionsWrapper>
      {canGoPrevStep && (
        <GotoPrevStep
          procesoLegalId={procesoLegal.id}
          prevStepTitle={
            procesoLegal.pasos[procesoLegal.pasoActual - 1].intraTitle
          }
          expedienteId={expediente.id}
        />
      )}

      {canOnlyApproveOrReject && (
        <ApproveOrReject
          expediente={expediente}
          procesoLegal={procesoLegal}
          approveRejectTitle={approveRejectTitle}
        />
      )}

      {canOnlyApprove && (
        <Approve
          expedienteId={expediente.id}
          procesoLegal={procesoLegal}
          onlyApproveTitle={onlyApproveTitle}
        />
      )}

      {canGoNextStep && (
        <GotoNextStep
          procesoLegalId={procesoLegal.id}
          nextStepTitle={
            procesoLegal.pasos[procesoLegal.pasoActual + 1].intraTitle
          }
          expedienteId={expediente.id}
        />
      )}
    </ActionsWrapper>
  );
};

ProcesoLegalActions.propTypes = {
  canGoPrevStep: PropTypes.bool,
  canGoNextStep: PropTypes.bool,
  canOnlyApproveOrReject: PropTypes.bool,
  procesoLegal: PropTypes.object.isRequired,
  goToSection: PropTypes.func.isRequired,
  expediente: PropTypes.object.isRequired,
  canOnlyApprove: PropTypes.bool,
  approveRejectTitle: PropTypes.object,
  onlyApproveTitle: PropTypes.string
};

export default ProcesoLegalActions;
