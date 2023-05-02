import { CedulaNotificacion } from '@prisma/client';
import cedulaServices from '../services/cedula.services';
import expedienteServices from '../services/expediente.services';
import tramiteServices from '../services/tramite.services';
import Exception from './Exception';
import { getNumeroExpediente } from './getNumeroExpediente';
import procesoLegalesServices from '../services/procesoLegales.services';

const mapCedulas = (cedula: CedulaNotificacion) => ({
  titulo: `Cédula de Notificación Nro. ${cedula.numero}: ${cedula.titulo}`,
  id: cedula.id,
  tipo: 'cedula',
  numero: cedula.numero
});

interface IFamilia {
  id: number;
  tipo: string;
  tramitesHijos?: IFamilia[];
  expedientesHijos?: IFamilia[];
  tramitePadre?: IFamilia;
  expedientePadre?: IFamilia;
  titulo: string;
  numero: string;
  estado: string;
  cedulas: Partial<CedulaNotificacion>[];
}

export const getFamily = async (id: number, tipo: string) => {
  if (!id) {
    throw new Exception('El id del tramite es requerido');
  }

  if (!tipo) {
    throw new Exception('El tipo es requerido');
  }

  const { id: idPadre, tipo: tipoPadre } = await buscarPadre(id, tipo);

  return await buscarFamilia(idPadre, tipoPadre);
};

const buscarFamilia = async (id: number, tipo: string): Promise<IFamilia> => {
  let tramite: any;

  if (tipo === 'tramite') {
    tramite = await tramiteServices.findFamilia(id);
  } else if (tipo === 'expediente') {
    tramite = await expedienteServices.findFamilia(id);
  }

  if (!tramite) {
    throw new Exception('El trámite no se encontró');
  }

  const objExpediente =
    tipo === 'expediente'
      ? {
          fiscalizaciones: tramite.fiscalizaciones,
          procesosLegales: tramite.procesosLegales
        }
      : {};

  const familia: IFamilia = {
    id,
    tipo,
    titulo:
      tipo === 'tramite'
        ? 'Trámite Nroº ' + tramite.id + ': ' + tramite.tipo?.titulo
        : tipo === 'expediente'
        ? `Expediente Nroº ${getNumeroExpediente({
            numeroLegales: tramite.numeroLegales,
            numeroFiscalizacion: tramite.numeroFiscalizacion
          })}`
        : 'Cédula de Notificación Nroº ' + tramite.numero,
    numero: tramite.numero,
    estado: tramite.estado,
    cedulas:
      (tipo === 'tramite' || tipo === 'expediente') &&
      tramite.cedulas.map(mapCedulas),
    ...objExpediente
  };

  if (tramite.tramitesHijos) {
    for (let hijo of tramite.tramitesHijos) {
      if (!familia.tramitesHijos) {
        familia.tramitesHijos = [];
      }

      familia.tramitesHijos.push(await buscarFamilia(hijo.id, 'tramite'));
    }
  }

  if (tramite.expedientesHijos) {
    for (let hijo of tramite.expedientesHijos) {
      if (!familia.expedientesHijos) {
        familia.expedientesHijos = [];
      }

      familia.expedientesHijos.push(await buscarFamilia(hijo.id, 'expediente'));
    }
  }

  return familia;
};

const buscarPadre = async (id: number, tipo: string): Promise<any> => {
  if (!id) {
    throw new Exception('El id del trámite es requerido');
  }

  if (!tipo) {
    throw new Exception('El tipo es requerido');
  }

  let tramite: any;

  if (tipo === 'tramite') {
    tramite = await tramiteServices.findFamilia(id);
  } else if (tipo === 'expediente') {
    tramite = await expedienteServices.findFamilia(id);
  } else if (tipo === 'procesoLegal') {
    tramite = await procesoLegalesServices.findFamilia(id);
  } else {
    tramite = await cedulaServices.findFamilia(id);
  }

  if (!tramite) {
    throw new Exception('El trámite no se encontró');
  }

  if (tramite.tramitePadre) {
    return await buscarPadre(tramite.tramitePadre.id, 'tramite');
  }

  if (tramite.expedientePadre) {
    return await buscarPadre(tramite.expedientePadre.id, 'expediente');
  }

  if (tramite.expediente && tipo === 'procesoLegal') {
    return await buscarPadre(tramite.expediente.id, 'expediente');
  }

  if (tramite.procesoLegalesPadre) {
    return await buscarPadre(tramite.procesoLegalesPadre.id, 'procesoLegal');
  }

  return {
    id,
    tipo
  };
};
