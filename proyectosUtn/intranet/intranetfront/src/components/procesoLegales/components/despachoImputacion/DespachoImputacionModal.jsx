import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import WizardDespachoImputacion from './wizard/WizardDespachoImputacion';

const DespachoImputacionModal = ({
  show,
  handleClose,
  procesoLegalId,
  expedienteId,
  goToSection,
  setKey,
  despachoImputacion
}) => {
  const [step, setStep] = useState(1);

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {despachoImputacion ? 'Editar' : 'Añadir'} imputaciones
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <WizardDespachoImputacion
          step={step}
          setStep={setStep}
          expedienteId={expedienteId}
          procesoLegalId={procesoLegalId}
          handleClose={handleClose}
          goToSection={goToSection}
          setKey={setKey}
          despachoImputacion={despachoImputacion}
        />
      </Modal.Body>
    </Modal>
  );
};

DespachoImputacionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  procesoLegalId: PropTypes.number.isRequired,
  expedienteId: PropTypes.number.isRequired,
  goToSection: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired,
  despachoImputacion: PropTypes.object
};

export default DespachoImputacionModal;
