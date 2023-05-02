import ActionsWrapper from 'components/common/ActionsWrapper';
import React, { useEffect, useState } from 'react';
import IniciarFiscalizacion from './buttons/IniciarFiscalizacion';
import SendTo from './buttons/SendTo';
import PropTypes from 'prop-types';
import areas from 'data/areas';
import IniciarProcesoLegal from './buttons/IniciarProcesoLegal';
import Finalizar from './buttons/Finalizar';

const areasExpedienteInit = [
  { id: 3, nombre: 'Legales' },
  { id: 5, nombre: 'Fiscalización' }
];

export const ExpedienteActions = ({ userAreaId, expediente, setKey }) => {
  const [areasExpediente, setAreasExpediente] = useState(areasExpedienteInit);

  const [allFiscalizacionesFinished, setAllFiscalizacionesFinished] = useState(
    expediente.fiscalizaciones.every(
      f => f.estado === 'finalizada' || f.estado === 'cancelada'
    )
  );
  const [allProcesosLegalesFinished, setAllProcesosLegalesFinished] = useState(
    expediente.procesosLegales.every(
      pl =>
        pl.estado === 'finalizado' ||
        pl.estado === 'cancelado' ||
        pl.estado === 'no_ratificado' ||
        pl.estado === 'desestimado'
    )
  );

  useEffect(() => {
    setAllFiscalizacionesFinished(
      expediente.fiscalizaciones.every(
        f => f.estado === 'finalizada' || f.estado === 'cancelada'
      )
    );

    setAllProcesosLegalesFinished(
      expediente.procesosLegales.every(
        pl =>
          pl.estado === 'finalizado' ||
          pl.estado === 'cancelado' ||
          pl.estado === 'no_ratificado' ||
          pl.estado === 'desestimado'
      )
    );
  }, [expediente]);

  useEffect(() => {
    setAreasExpediente(
      areasExpedienteInit.filter(area =>
        expediente.carpeta
          ? area.id !== userAreaId
          : area.id !== userAreaId && area.id !== areas.legales
      )
    );
  }, [userAreaId, expediente]);

  return (
    <ActionsWrapper>
      {userAreaId === areas.fiscalizacion &&
        allFiscalizacionesFinished &&
        allProcesosLegalesFinished && (
          <IniciarFiscalizacion expediente={expediente} setKey={setKey} />
        )}

      {userAreaId === areas.legales &&
        allFiscalizacionesFinished &&
        allProcesosLegalesFinished &&
        expediente.carpeta && (
          <IniciarProcesoLegal expediente={expediente} setKey={setKey} />
        )}

      {allFiscalizacionesFinished &&
        allProcesosLegalesFinished &&
        areasExpediente.length && (
          <SendTo expediente={expediente} areasExpediente={areasExpediente} />
        )}

      {allFiscalizacionesFinished && allProcesosLegalesFinished && (
        <Finalizar expediente={expediente} setKey={setKey} />
      )}
    </ActionsWrapper>
  );
};

ExpedienteActions.propTypes = {
  userAreaId: PropTypes.number.isRequired,
  expediente: PropTypes.object.isRequired,
  setKey: PropTypes.func.isRequired
};
