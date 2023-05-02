import React from 'react';
import HistorialContent from './components/HistorialContent';
import ProcedureAccordion from './components/infoAccordion/ProcedureAccordion';
import VirtualTab from '../common/virtualTab/VirtualTab';
import removeAccentsLowerCase from 'utils/revomeAccentsLowerCase';
import Relations from './components/relations/Relations';
import Turnos from './components/appointments/Turnos';
import ActionsContent from './components/ActionsContent';
import {
  canAddData,
  puedePedirTurno,
  canAddInforme,
  canAddIntimacion,
  canAddDictamen,
  canGenerateCedula,
  canAddArchivo,
  canAddResolucion
} from './TramiteCheckers';
import PropTypes from 'prop-types';
import MatriculadoContent from './components/MatriculadoContent';

export const ProcedureContentBody = ({
  tramite,
  virtualTabType,
  actualKey,
  user,
  relations,
  actualSection,
  goToSection,
  requestModification,
  setKey
}) => {
  switch (actualKey) {
    case 'informacion':
      return (
        <ProcedureAccordion
          tramite={tramite}
          requestModificationFromProcedure={requestModification}
          goToSection={goToSection}
          actualSection={actualSection}
          canAddData={canAddData(tramite, user)}
          canAddDictamen={canAddDictamen(tramite, user)}
          canAddInforme={canAddInforme(tramite, user)}
          canAddIntimacion={canAddIntimacion(tramite, user)}
          canAddResolucion={canAddResolucion(tramite, user)}
        />
      );

    case 'historial':
      return <HistorialContent tramite={tramite} />;

    case 'virtualTab':
      return (
        <VirtualTab
          type={removeAccentsLowerCase(virtualTabType)}
          tramite={tramite}
        />
      );

    case 'relaciones':
      return <Relations tramite={tramite} relations={relations} />;

    case 'turno':
      return <Turnos puedePedirTurno={puedePedirTurno} />;

    case 'acciones':
      return (
        <ActionsContent
          tramite={tramite}
          canAddDictamen={canAddDictamen(tramite, user)}
          canAddInforme={canAddInforme(tramite, user)}
          canAddIntimacion={canAddIntimacion(tramite, user)}
          canGenerateCedula={canGenerateCedula(tramite, user)[0]}
          cedulaType={canGenerateCedula(tramite, user)[1]}
          goToSection={goToSection}
          setKey={setKey}
          canAddArchivo={canAddArchivo(tramite, user)[0]}
          archivoTitle={canAddArchivo(tramite, user)[1]}
          canAddResolucion={canAddResolucion(tramite, user)}
        />
      );

    case 'matriculado':
      return <MatriculadoContent usuario={tramite.carpeta.usuario} />;

    default:
      return null;
  }
};
ProcedureContentBody.propTypes = {
  tramite: PropTypes.object.isRequired,
  virtualTabType: PropTypes.string,
  actualKey: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  relations: PropTypes.object.isRequired,
  actualSection: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  goToSection: PropTypes.func.isRequired,
  requestModification: PropTypes.bool,
  setKey: PropTypes.func.isRequired
};
