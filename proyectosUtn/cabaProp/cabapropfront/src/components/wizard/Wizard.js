import React from 'react';
import PropTypes from 'prop-types';
import PropiedadesWizard from './PropiedadesWizard';
import AuthWizardProvider from './AuthWizardProvider';
import PropiedadesWizardEdit from './PropiedadesWizardEdit';

const Wizard = ({ variant, progressBar, statusType }) => {
  return (
    <AuthWizardProvider>
      <div className="pe-3">
        {statusType === 'crear' ? (
          <PropiedadesWizard variant={variant} progressBar={progressBar} />
        ) : (
          <PropiedadesWizardEdit variant={variant} progressBar={progressBar} />
        )}
      </div>
    </AuthWizardProvider>
  );
};

Wizard.propTypes = {
  variant: PropTypes.oneOf(['pills']),
  progressBar: PropTypes.bool
};

export default Wizard;
