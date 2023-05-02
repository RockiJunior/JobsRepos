import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'react-bootstrap';
import ProcedureValues from 'components/tramites/components/infoAccordion/values/ProcedureValues';
import Archivos from './items/Archivos';
import { getStatusBadgeProcedureSection } from '../../../../utils/getStatusBadgeProcedureSection';
import { CustomAccordionItem } from './CustomAccordionItem';
import Informes from './items/Informes';
import Dictamenes from './items/Dictamenes';
import Intimaciones from './items/Intimaciones';
import Transacciones from './items/Transacciones';
import { hideInputs } from 'components/tramites/TramiteCheckers';
import Resoluciones from './items/Resolucion';
import ProcedureInputs from './inputs/ProcedureInputs';

const ProcedureAccordion = ({
  tramite,
  requestModificationFromProcedure,
  goToSection,
  actualSection,
  canAddData,
  canAddDictamen,
  canAddInforme,
  canAddIntimacion,
  canAddResolucion
}) => {
  return (
    <Accordion
      activeKey={actualSection}
      onSelect={section => goToSection(section)}
    >
      {tramite.tipo.secciones
        .filter(s => s.tipo === tramite.tipoSeccion || !s.tipo)
        .map((accordionItem, index) => (
          <CustomAccordionItem
            key={index}
            eventKey={index}
            title={
              <>
                {accordionItem.titulo}
                {getStatusBadgeProcedureSection(accordionItem.estado)}
              </>
            }
            isDisabled={hideInputs(tramite)}
          >
            {!hideInputs(tramite) &&
              (!canAddData ? (
                <ProcedureValues
                  values={accordionItem.inputs}
                  title={accordionItem.titulo}
                  status={accordionItem.estado}
                  tramiteId={tramite.id}
                  requestModificationFromProcedure={
                    requestModificationFromProcedure
                  }
                  goToSection={goToSection}
                  actualSection={actualSection}
                  tramiteStatus={tramite.estado}
                  tramite={tramite}
                />
              ) : (
                <ProcedureInputs
                  inputs={accordionItem.inputs}
                  title={accordionItem.titulo}
                  status={accordionItem.estado}
                  isDisabled={
                    accordionItem.estado === 'rejected' ||
                    accordionItem.estado === 'sent' ||
                    accordionItem.estado === 'approved' ||
                    tramite.estado !== 'pendiente'
                  }
                  tramiteId={tramite.id}
                  tramite={tramite}
                />
              ))}
          </CustomAccordionItem>
        ))}

      {!!tramite.informe.length && (
        <CustomAccordionItem title="Informes" eventKey="informe">
          <Informes
            canAddInforme={canAddInforme}
            informes={tramite.informe}
            tramite={tramite}
          />
        </CustomAccordionItem>
      )}

      {!!tramite.dictamen.length && (
        <CustomAccordionItem title="Dictámenes" eventKey="dictamen">
          <Dictamenes
            canAddDictamen={canAddDictamen}
            dictamenes={tramite.dictamen}
            tramite={tramite}
          />
        </CustomAccordionItem>
      )}

      {!!tramite.intimacion.length && (
        <CustomAccordionItem title="Intimaciones" eventKey="intimacion">
          <Intimaciones
            canAddIntimacion={canAddIntimacion}
            intimaciones={tramite.intimacion}
            tramite={tramite}
          />
        </CustomAccordionItem>
      )}

      {!!tramite.resoluciones.length && (
        <CustomAccordionItem title="Resoluciones" eventKey="resolucion">
          <Resoluciones
            canAddResolucion={canAddResolucion}
            resoluciones={tramite.resoluciones}
            tramite={tramite}
          />
        </CustomAccordionItem>
      )}

      {!!tramite.archivos?.length && (
        <CustomAccordionItem title="Archivos" eventKey="archivos">
          <Archivos
            archivos={tramite.archivos}
            pasoActual={tramite.pasoActual}
            tramite={tramite}
          />
        </CustomAccordionItem>
      )}

      {!!tramite.transacciones?.length && (
        <CustomAccordionItem title="Transacciones" eventKey="transacciones">
          <Transacciones transacciones={tramite.transacciones} />
        </CustomAccordionItem>
      )}
    </Accordion>
  );
};

ProcedureAccordion.propTypes = {
  tramite: PropTypes.object,
  requestModificationFromProcedure: PropTypes.bool,
  goToSection: PropTypes.func,
  actualSection: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  canAddData: PropTypes.bool,
  canAddDictamen: PropTypes.bool,
  canAddInforme: PropTypes.bool,
  canAddIntimacion: PropTypes.bool,
  canAddResolucion: PropTypes.bool
};

export default ProcedureAccordion;
