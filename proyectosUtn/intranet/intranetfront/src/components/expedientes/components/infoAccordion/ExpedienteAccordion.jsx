import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'react-bootstrap';
import { CustomAccordionItem } from './CustomAccordionItem';
import Informes from './items/Informes';
import Archivos from './items/Archivos';

const ExpedienteAccordion = ({ expediente, goToSection, actualSection }) => {
  return !expediente.informes.length && !expediente.archivos?.length ? (
    <div className="text-center">Aún no se han adjuntado documentos</div>
  ) : (
    <Accordion
      activeKey={actualSection}
      onSelect={section => goToSection(section)}
    >
      {!!expediente.informes.length && (
        <CustomAccordionItem title="Informes" eventKey="informe">
          <Informes expediente={expediente} informes={expediente.informes} />
        </CustomAccordionItem>
      )}

      {!!expediente.archivos?.length && (
        <CustomAccordionItem title="Archivos" eventKey="archivos">
          <Archivos expediente={expediente} archivos={expediente.archivos} />
        </CustomAccordionItem>
      )}
    </Accordion>
  );
};

ExpedienteAccordion.propTypes = {
  expediente: PropTypes.object.isRequired,
  goToSection: PropTypes.func.isRequired,
  actualSection: PropTypes.string
};

export default ExpedienteAccordion;
