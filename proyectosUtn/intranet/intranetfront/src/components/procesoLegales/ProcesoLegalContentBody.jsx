import React from 'react';
import PropTypes from 'prop-types';
import ActionsContent from './components/ActionsContent';
import ProcesoLegalAccordion from './components/infoAccordion/ProcesoLegalAccordion';
import {
  canAddArchivo,
  canAddImputaciones,
  canAddDictamen,
  canAddFallos,
  canAddInforme,
  canAddResolucion,
  canGenerateCedula
} from './ProcesoLegalCheckers';
import Denuncia from 'components/expedientes/components/denuncia/Denuncia';

export const ProcesoLegalContentBody = ({
  expediente,
  procesoLegal,
  actualKey,
  goToSection,
  actualSection,
  setKey,
  user
}) => {
  switch (actualKey) {
    case 'acciones':
      return procesoLegal.estado !== 'cancelado' &&
        procesoLegal.estado !== 'finalizado' &&
        procesoLegal.estado !== 'no_ratificado' &&
        procesoLegal.estado !== 'desestimado' ? (
        <ActionsContent
          expediente={expediente}
          goToSection={goToSection}
          setKey={setKey}
          procesoLegalId={procesoLegal.id}
          archivoTitle={canAddArchivo(procesoLegal, user)[1]?.split(':')}
          canAddArchivo={canAddArchivo(procesoLegal, user)[0]}
          canAddImputaciones={canAddImputaciones(procesoLegal, user)}
          canAddDictamen={canAddDictamen(procesoLegal, user)}
          canAddFallos={canAddFallos(procesoLegal, user)}
          canAddResolucion={canAddResolucion(procesoLegal, user)}
          canGenerateCedula={canGenerateCedula(procesoLegal, user)[0]}
          cedulaType={canGenerateCedula(procesoLegal, user)[1]}
          canAddInforme={canAddInforme(procesoLegal, user)}
          despachoImputacion={procesoLegal.despachoImputacion}
        />
      ) : null;

    case 'informacion':
      return (
        <ProcesoLegalAccordion
          actualSection={actualSection}
          goToSection={goToSection}
          procesoLegal={procesoLegal}
          expediente={expediente}
        />
      );

    case 'denuncia':
      return <Denuncia denuncia={expediente.denuncia} />;

    default:
      return null;
  }
};
ProcesoLegalContentBody.propTypes = {
  expediente: PropTypes.object.isRequired,
  actualKey: PropTypes.string.isRequired,
  goToSection: PropTypes.func.isRequired,
  actualSection: PropTypes.string,
  setKey: PropTypes.func.isRequired,
  procesoLegal: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};
