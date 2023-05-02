import prisma from '../config/db';
import areas from '../data/areas';
import procesoLegalesPasos from '../data/procesoLegales';
import empleadoServices from '../services/empleado.services';
import procesoLegalesServices from '../services/procesoLegales.services';
import Exception from '../utils/Exception';
import ProcesolegalActionStep from '../utils/procesoLegales/procesoLegalesActionStep';
import ProcesoLegalesActionStepRejected from '../utils/procesoLegales/procesoLegalesActionStepRejected';
import procesoLegalesCheckGotoNextStep from '../utils/procesoLegales/procesolegalesCheckGotoNextStep';
import { procesoLegalesVolverAtras } from '../utils/procesoLegales/procesoLegalesVolverAtras';
import { procesoLegalesCheckHasBeforeApprove } from '../utils/procesoLegales/procesoLegalesCheckHasBeforeApprove';
import { ProcesoLcheckPasoSiguiente } from '../utils/procesoLegales/procesoLegalesCheckPasoSiguiente';
import procesoLegalGoTo from '../utils/procesoLegales/procesoLegalGoTo';
import { registroHistorial } from '../utils/registrarHistorial';
import usersServices from '../services/users.services';
import matriculaServices from '../services/matricula.services';
import expedienteServices from '../services/expediente.services';
import { EstadoExpediente } from '@prisma/client';
import ExpedienteClass from '../ejemplo clases/expediente';

class ProcesoLegalesValidator {
  async create({
    expedienteId,
    usuarioId //empleado
  }: {
    usuarioId: number;
    expedienteId: number;
  }) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }
    if (!expedienteId) {
      throw new Exception('El id del expediente es requerido');
    }
    let procesoLegales;

    const expediente = await expedienteServices.findById(expedienteId);

    if (expediente.carpeta?.usuarioId) {
      procesoLegales = await procesoLegalesServices.create(expedienteId);
    } else {
      throw new Exception(
        'No se puede iniciar el Proceso legal, porque el usuario no esta matriculado'
      );
    }
    const procesoLegalesDB = await procesoLegalesServices.findById(
      procesoLegales.id
    );
    const empleado = await empleadoServices.findById(usuarioId);
    await registroHistorial({
      titulo: 'Se creó un Proceso Legal',
      descripcion: `Se creó un Proceso Legal bajo el Nro. <strong>${procesoLegalesDB?.id}</strong>.`,
      usuarioId: empleado?.usuarioId,
      expedienteId: procesoLegalesDB?.expedienteId,
      info: {
        tipo: 'procesoLegal',
        id: procesoLegales.id
      }
    });

    await registroHistorial({
      titulo: 'Se creó un Proceso Legal',
      descripcion: `Se creó un Proceso Legal bajo el Nro. <strong>${procesoLegalesDB?.id}</strong>.`,
      usuarioId: empleado?.usuarioId,
      expedienteId: procesoLegalesDB?.expedienteId,
      procesoLegalId: procesoLegalesDB?.id,
      info: {
        tipo: 'procesoLegal',
        id: procesoLegales.id
      }
    });

    await expedienteServices.changeStatus({
      status: EstadoExpediente.proceso_legal_abierto,
      expedienteId: expediente.id
    });

    return procesoLegales;
  }

  async pasoSiguiente({
    procesoLegalId,
    usuarioId
  }: {
    procesoLegalId: number;
    usuarioId: number;
  }) {
    if (!procesoLegalId) {
      throw new Exception('El Proceso Legal es requerido');
    }
    const procesoLegal = await procesoLegalesServices.findById(procesoLegalId);

    if (!procesoLegal) {
      throw new Exception('El proceso legal no existe');
    }
    await ProcesoLcheckPasoSiguiente(procesoLegal, usuarioId);

    await procesoLegalesServices.update(procesoLegal.id, {
      pasoActual: procesoLegal.pasoActual + 1
    });

    const newProcesoLegal = await procesoLegalesServices.findById(
      procesoLegal.id
    );
    if (!newProcesoLegal) {
      throw new Exception('El proceso legal no existe');
    }
    await ProcesolegalActionStep(newProcesoLegal);

    return procesoLegal;
  }

  async pasoAnterior({
    procesoLegalId,
    usuarioId
  }: {
    procesoLegalId: number;
    usuarioId: number;
  }) {
    if (!procesoLegalId) {
      throw new Exception('El id del proceso legal es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El userId es requerido');
    }
    const procesoLegal = await procesoLegalesServices.findById(procesoLegalId);

    if (!procesoLegal) {
      throw new Exception('El proceso legal no existe');
    }

    const pasoActualProcesoLegal = procesoLegalesPasos[procesoLegal.pasoActual];

    // usuarioid -> areaId
    // pasoAcutal -> actions

    // Solo podria ir para atras si alguna action es:
    // canGoPrevStep/{areaId}  ej."canGoPrevStep/1"
    // appointment/{areaId}    ej."appointment/1"

    // si alguno concuerda con el areaId del usuario entra al if
    // si no hay coincidencia tira error

    const empleadoDB = await empleadoServices.findById(usuarioId);

    if (!empleadoDB) {
      throw new Exception('El empleado no existe');
    }

    if (
      pasoActualProcesoLegal.actions &&
      (pasoActualProcesoLegal.actions.includes(
        `canGoPrevStep/${empleadoDB?.areaId}`
      ) ||
        pasoActualProcesoLegal.actions.includes(
          `appointment/${empleadoDB?.areaId}`
        ))
    ) {
      if (pasoActualProcesoLegal.onGoPrevStep) {
        await procesoLegalesVolverAtras(procesoLegal);
      } else {
        await procesoLegalesServices.update(procesoLegal.id, {
          pasoActual: procesoLegal.pasoActual - 1
        });
      }
      const procesoLegalesDB = await procesoLegalesServices.findById(
        procesoLegal.id
      );
      if (!procesoLegalesDB) {
        throw new Exception('El proceso legal no existe');
      }
      await ProcesolegalActionStep(procesoLegalesDB);

      if (
        procesoLegalesPasos[procesoLegalesDB?.pasoActual].actions?.some(
          (action) => action.includes('ppointment')
        )
      ) {
        const ultimoTurno = procesoLegalesDB.turnos[0];
        await prisma.turno.update({
          where: {
            id: ultimoTurno.id
          },
          data: {
            estado: 'pending'
          }
        });
      }

      await registroHistorial({
        titulo: `Se ha retrocedido un paso`,
        descripcion: `Se ha pasado del paso <strong>${
          procesoLegalesPasos[procesoLegal.pasoActual].intraTitle
        }</strong> al paso <strong>${
          procesoLegalesPasos[procesoLegal.pasoActual - 1].intraTitle
        }</strong> en el Proceso Legal Nro <strong>${procesoLegal.id}</strong>`,
        usuarioId: empleadoDB.usuarioId,
        expedienteId: procesoLegal.expedienteId
      });

      await registroHistorial({
        titulo: `Se ha retrocedido un paso`,
        descripcion: `Se ha pasado del paso <strong>${
          procesoLegalesPasos[procesoLegal.pasoActual].intraTitle
        }</strong> al paso <strong>${
          procesoLegalesPasos[procesoLegal.pasoActual - 1].intraTitle
        }</strong> en el Proceso Legal Nro <strong>${procesoLegal.id}</strong>`,
        usuarioId: empleadoDB.usuarioId,
        procesoLegalId: procesoLegal.id,
        expedienteId: procesoLegal.expedienteId,
      });

      const newProcesoLegal = await procesoLegalesServices.findById(
        procesoLegalId
      );
      if (!newProcesoLegal) throw new Exception('El proceso legal no existe');
    } else {
      throw new Exception('No tenés permisos para ir al paso anterior');
    }

    return procesoLegal;
  }

  async aprobarPorArea({
    procesoLegalId,
    usuarioId
  }: {
    procesoLegalId: number;
    usuarioId: number;
  }) {
    if (!procesoLegalId) {
      throw new Exception('El id del proceso es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const procesoLegal = await procesoLegalesServices.findById(procesoLegalId);

    if (!procesoLegal) {
      throw new Exception('El proceso no se encontró');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no se encontró');
    }

    const { area } = empleado;
    const paso = procesoLegalesPasos[procesoLegal.pasoActual];

    if (!paso) {
      throw new Exception('El trámite no se encuentra en un paso');
    }

    if (!area) {
      throw new Exception('El empleado no tiene área asignada');
    }

    if (!paso.actions) {
      throw new Exception('El paso no tiene acciones');
    }

    if (
      !paso.actions.some((i) => i.includes('approveOrReject')) &&
      !paso.actions.some((i) => i.includes('canOnlyApprove'))
    ) {
      throw new Exception('El paso no tiene acciones de aprobación');
    }

    /* const pasoAreas = paso.actions
      .filter((a) => a.includes('sendTo'))
      .map((a) => a.split('/')[1]); */

    await procesoLegalesCheckHasBeforeApprove(procesoLegal);

    await prisma.areaToExpediente.update({
      where: {
        areaId_expedienteId: {
          areaId: area.id,
          expedienteId: procesoLegal.expedienteId
        }
      },
      data: {
        status: 'approved'
      }
    });

    const procesoLegalAction = await procesoLegalesServices.findById(
      procesoLegal.id
    );

    if (!procesoLegalAction) {
      throw new Exception('El proceso legal no se encontró');
    }

    if (await procesoLegalesCheckGotoNextStep(procesoLegalAction)) {
      await procesoLegalesServices.update(procesoLegalAction.id, {
        pasoActual: procesoLegalAction.pasoActual + 1
      });

      /* const areasPasoNames = getAreasPasoNames(pasoAreas);

      await registroHistorial(
        areasPasoNames.title,
        areasPasoNames.description,
        empleado.usuarioId,
        tramiteId
      );

      const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);
      if (plazo) {
        await plazoServices.finish(plazo.id);
      } */

      const newProcesoLegal = await procesoLegalesServices.findById(
        procesoLegal.id
      );

      if (!newProcesoLegal) throw new Exception('El proceso legal no existe');

      await ProcesolegalActionStep(newProcesoLegal);

      const procesoLegalUpdated = await procesoLegalesServices.findById(
        procesoLegal.id
      );

      return procesoLegalUpdated;
    }
    await procesoLegalGoTo(procesoLegalAction);

    const procesoLegalUpdated = await procesoLegalesServices.findById(
      procesoLegal.id
    );
    return procesoLegalUpdated;
  }

  async rechazarPorArea({
    procesoLegalId,
    usuarioId
  }: {
    procesoLegalId: number;
    usuarioId: number;
  }) {
    if (!procesoLegalId) {
      throw new Exception('El id del trámite es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const procesoLegal = await procesoLegalesServices.findById(procesoLegalId);

    if (!procesoLegal) {
      throw new Exception('El trámite no se encontró');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no se encontró');
    }

    const { area } = empleado;
    const paso = procesoLegalesPasos[procesoLegal.pasoActual];

    if (!paso) {
      throw new Exception('El trámite no se encuentra en un paso');
    }

    if (!area) {
      throw new Exception('El empleado no tiene área asignada');
    }

    if (!paso.actions) {
      throw new Exception('El paso no tiene acciones');
    }

    if (!paso.actions.some((i) => i.includes('approveOrReject'))) {
      throw new Exception('El paso no tiene acciones de aprobación');
    }

    const pasoAreas = paso.actions
      .filter((a) => a.includes('sendTo'))
      .map((a) => a.split('/')[1]);

    if (!pasoAreas.includes(`${area.id}`)) {
      throw new Exception('El trámite no se encuentra en el área');
    }

    await prisma.areaToExpediente.update({
      where: {
        areaId_expedienteId: {
          areaId: area.id,
          expedienteId: procesoLegal.expedienteId
        }
      },
      data: {
        status: 'rejected'
      }
    });

    /* const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);
    if (plazo) {
      await plazoServices.finish(plazo.id);
    } */

    const procesoLegalAction = await procesoLegalesServices.findById(
      procesoLegal.id
    );
    if (!procesoLegalAction) throw new Exception('El proceso legal no existe');
    await ProcesoLegalesActionStepRejected(procesoLegalAction);

    await registroHistorial({
      titulo: 'Se rechazó el Proceso Legal',
      descripcion: `El proceso legal fue rechazado por el área <strong>${area.nombre}</strong>`,
      usuarioId,
      expedienteId: procesoLegal.expedienteId
    });

    await registroHistorial({
      titulo: 'Se rechazó el Proceso Legal',
      descripcion: `El proceso legal fue rechazado por el área <strong>${area.nombre}</strong>`,
      usuarioId,
      expedienteId: procesoLegal.expedienteId,
      procesoLegalId: procesoLegal.id
    });

    return procesoLegalAction;
  }

  async cancelarProcesoLegales({
    procesoLegalesId,
    usuarioId
  }: {
    procesoLegalesId: number;
    usuarioId: number;
  }) {
    if (!procesoLegalesId) {
      throw new Exception('El id del proceso legal es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const procesoLegales = await procesoLegalesServices.findById(
      procesoLegalesId
    );

    if (!procesoLegales) {
      throw new Exception('El proceso legal no se encontró');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no se encontró');
    }

    if (empleado.areaId !== areas.legales) {
      throw new Exception('No tienes permisos para cancelar el proceso legal');
    }

    const procesoLegalesDB =
      await procesoLegalesServices.cancelarProcesoLegales(procesoLegalesId);

    await expedienteServices.changeStatus({
      status: EstadoExpediente.pendiente,
      expedienteId: procesoLegales.expedienteId
    });

    await registroHistorial({
      titulo: 'Se canceló un Proceso Legal',
      descripcion: `El Proceso Legal Nro <strong>${procesoLegalesDB.id}</strong> fue cancelado`,
      usuarioId: empleado.usuarioId,
      expedienteId: procesoLegalesDB.expedienteId
    });

    await registroHistorial({
      titulo: 'Se canceló un Proceso Legal',
      descripcion: `El Proceso Legal Nro <strong>${procesoLegalesDB.id}</strong> fue cancelado`,
      usuarioId: empleado.usuarioId,
      expedienteId: procesoLegalesDB.expedienteId,
      procesoLegalId: procesoLegalesDB.id
    });

    // await procesoLegalesServices.deleteAllAreas(procesoLegalesId);

    return procesoLegalesDB;
  }
}

export default new ProcesoLegalesValidator();
