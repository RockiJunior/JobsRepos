import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'react-bootstrap';
import { CustomAccordionItem } from './CustomAccordionItem';
import Archivos from './items/Archivos';
import Dictamenes from './items/Dictamenes';
import Resoluciones from './items/Resoluciones';
import Informes from './items/Informes';
import Imputaciones from './items/Imputaciones';
import Fallos from './items/Fallos';

const ProcesoLegalAccordion = ({
  goToSection,
  actualSection,
  procesoLegal,
  expediente
}) => {
  return !procesoLegal.dictamen.length &&
    !procesoLegal.fallos?.length &&
    !procesoLegal.despachoImputacion &&
    !procesoLegal.informes?.length &&
    !procesoLegal.resoluciones?.length &&
    !procesoLegal.archivos?.length ? (
    <div className="text-center">Aún no se han adjuntado documentos</div>
  ) : (
    <Accordion
      activeKey={actualSection}
      onSelect={section => goToSection(section)}
    >
      {!!procesoLegal.archivos?.length && (
        <CustomAccordionItem title="Archivos" eventKey="archivos">
          <Archivos
            archivos={procesoLegal.archivos}
            pasoActual={procesoLegal.pasoActual}
            expedienteId={expediente.id}
          />
        </CustomAccordionItem>
      )}

      {!!procesoLegal.dictamen.length && (
        <CustomAccordionItem title="Dictamen" eventKey="dictamen">
          <Dictamenes
            procesoLegal={procesoLegal}
            dictamenes={procesoLegal.dictamen}
            expediente={expediente}
          />
        </CustomAccordionItem>
      )}

      {!!procesoLegal.fallos.length && (
        <CustomAccordionItem title="Fallos" eventKey="fallo">
          <Fallos
            procesoLegal={procesoLegal}
            fallos={procesoLegal.fallos}
            expediente={expediente}
          />
        </CustomAccordionItem>
      )}

      {!!procesoLegal.despachoImputacion && (
        <CustomAccordionItem title="Imputaciones" eventKey="imputaciones">
          <Imputaciones
            despachoImputacion={procesoLegal.despachoImputacion}
            procesoLegal={procesoLegal}
            expediente={expediente}
          />
        </CustomAccordionItem>
      )}

      {!!procesoLegal.informes.length && (
        <CustomAccordionItem title="Informes" eventKey="informe">
          <Informes
            procesoLegal={procesoLegal}
            informes={procesoLegal.informes}
            expediente={expediente}
          />
        </CustomAccordionItem>
      )}

      {!!procesoLegal.resoluciones.length && (
        <CustomAccordionItem title="Resoluciones" eventKey="resolucion">
          <Resoluciones
            procesoLegal={procesoLegal}
            resoluciones={procesoLegal.resoluciones}
            expediente={expediente}
          />
        </CustomAccordionItem>
      )}
    </Accordion>
  );
};

ProcesoLegalAccordion.propTypes = {
  goToSection: PropTypes.func.isRequired,
  actualSection: PropTypes.string,
  procesoLegal: PropTypes.object.isRequired,
  expediente: PropTypes.object.isRequired
};

export default ProcesoLegalAccordion;
