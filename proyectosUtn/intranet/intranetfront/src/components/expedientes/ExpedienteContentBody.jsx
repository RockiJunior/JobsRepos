import React from 'react';
import Relations from './components/relations/Relations';
import PropTypes from 'prop-types';
import ActionsContent from './components/ActionsContent';
import ExpedienteAccordion from './components/infoAccordion/ExpedienteAccordion';
import MatriculadoContent from './components/MatriculadoContent';
import HistorialContent from './components/HistorialContent';
import Fiscalizaciones from 'components/fiscalizaciones/Fiscalizaciones';
import ProcesosLegales from 'components/procesoLegales/ProcesosLegales';
import Denuncia from './components/denuncia/Denuncia';

export const ExpedienteContentBody = ({
  expediente,
  actualKey,
  relations,
  goToSection,
  actualSection,
  setKey
}) => {
  switch (actualKey) {
    case 'relaciones':
      return <Relations expediente={expediente} relations={relations} />;

    case 'historial':
      return <HistorialContent expediente={expediente} />;

    case 'acciones':
      return (
        <ActionsContent
          expediente={expediente}
          goToSection={goToSection}
          setKey={setKey}
        />
      );

    case 'informacion':
      return (
        <ExpedienteAccordion
          actualSection={actualSection}
          expediente={expediente}
          goToSection={goToSection}
        />
      );

    case 'fiscalizaciones':
      return <Fiscalizaciones expediente={expediente} />;

    case 'procesosLegales':
      return <ProcesosLegales expediente={expediente} />;

    case 'matriculado':
      return <MatriculadoContent usuario={expediente.carpeta.usuario} />;

    case 'denuncia':
      return <Denuncia denuncia={expediente.denuncia} />;

    default:
      return null;
  }
};
ExpedienteContentBody.propTypes = {
  expediente: PropTypes.object.isRequired,
  actualKey: PropTypes.string.isRequired,
  relations: PropTypes.object.isRequired,
  goToSection: PropTypes.func.isRequired,
  actualSection: PropTypes.string,
  setKey: PropTypes.func.isRequired
};
