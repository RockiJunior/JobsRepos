import { CustomCard } from 'components/common/CustomCard';
import WizardNuevoTramite from './wizard/WizardNuevoTramite';
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

const NewProcedures = () => {
  const [step, setStep] = useState(1);

  return (
    <CustomCard icon="stamp" title="Nuevo Trámite">
      <Card.Body className="pt-0">
        <WizardNuevoTramite progressBar={false} step={step} setStep={setStep} />
      </Card.Body>
    </CustomCard>
  );
};

export default NewProcedures;
