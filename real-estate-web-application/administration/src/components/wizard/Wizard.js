import React from 'react';
import PropTypes from 'prop-types';
import PropiedadesWizard from './PropiedadesWizard';
import AuthWizardProvider from './AuthWizardProvider';
import PropiedadesWizardEdit from './PropiedadesWizardEdit';

const Wizard = ({ variant, validation, progressBar, statusType }) => {
  return (
    <AuthWizardProvider>
      {
        statusType === "crear" ?
        <PropiedadesWizard
          variant={variant}
          validation={validation}
          progressBar={progressBar}
        /> :
        <PropiedadesWizardEdit
        variant={variant}
        validation={validation}
        progressBar={progressBar}
        />
      }
    </AuthWizardProvider>
  );
};

Wizard.propTypes = {
  variant: PropTypes.oneOf(['pills']),
  validation: PropTypes.bool,
  progressBar: PropTypes.bool
};

export default Wizard;
