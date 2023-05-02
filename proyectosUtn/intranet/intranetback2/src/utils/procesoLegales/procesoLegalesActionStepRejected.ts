import {
  EstadoAreaTramite,
  EstadoExpediente,
  EstadoProcesoLegales
} from '@prisma/client';
import prisma from '../../config/db';
import procesoLegalesPasos from '../../data/procesoLegales';
import { IProcesoLegales } from '../../interfaces/expediente.interface';
import empleadoServices from '../../services/empleado.services';
import expedienteServices from '../../services/expediente.services';
import procesoLegalesServices from '../../services/procesoLegales.services';
import { registroHistorial } from '../registrarHistorial';
import ProcesolegalActionStep from './procesoLegalesActionStep';

async function ProcesoLegalesActionStepRejected(
  procesoLegales: IProcesoLegales
) {
  // const pasos = expediente.tipo.pasos;
  // const actions = pasos[expediente.pasoActual].onRejectActions;
  const actions =
    procesoLegalesPasos[procesoLegales.pasoActual].onRejectActions;

  if (actions) {
    let deletePreviousAreas = true;

    for (const item of actions) {
      const [action, tipo] = item.split('/');
      switch (action) {
        case 'goTo':
          await procesoLegalesServices.update(procesoLegales.id, {
            pasoActual: Number(tipo)
          });

          const procesoLegalesDB = await procesoLegalesServices.findById(
            procesoLegales.id
          );

          if (procesoLegalesDB) {
            await ProcesolegalActionStep(procesoLegalesDB);
          }

          break;

        case 'changeStatus':
          const estado = tipo as EstadoProcesoLegales;

          let fechaFin;

          if (
            (estado === EstadoProcesoLegales.finalizado ||
              estado === EstadoProcesoLegales.cancelado,
            estado === EstadoProcesoLegales.desestimado)
          ) {
            await procesoLegalesServices.deleteAllAreas(procesoLegales.id);
            fechaFin = new Date();
            await expedienteServices.changeStatus({
              status: EstadoExpediente.pendiente,
              expedienteId: procesoLegales.expedienteId
            });
          }

          await prisma.procesoLegales.update({
            where: {
              id: procesoLegales.id
            },
            data: {
              estado,
              fechaFin
            }
          });
          const expteDB = await expedienteServices.findById(procesoLegales.id);
          const empleado = await empleadoServices.findById(
            Number(expteDB.carpeta?.usuarioId)
          );
          await registroHistorial({
            titulo: `El Proceso Legal fue <strong>${estado}</strong>`,
            descripcion: ``,
            usuarioId: empleado?.usuarioId,
            expedienteId: procesoLegales.id
          });
          break;

        case 'sendTo':
          const area = await prisma.area.findUnique({
            where: {
              id: Number(tipo)
            }
          });

          if (area) {
            const areasObj = deletePreviousAreas
              ? {
                  updateMany: {
                    where: {
                      expedienteId: procesoLegales.expedienteId
                    },
                    data: {
                      deleted: new Date()
                    }
                  },
                  upsert: {
                    where: {
                      areaId_expedienteId: {
                        areaId: area.id,
                        expedienteId: procesoLegales.expedienteId
                      }
                    },
                    update: {
                      deleted: null,
                      status: EstadoAreaTramite.pending
                    },
                    create: {
                      areaId: area.id
                    }
                  }
                }
              : {
                  upsert: {
                    where: {
                      areaId_expedienteId: {
                        areaId: area.id,
                        expedienteId: procesoLegales.expedienteId
                      }
                    },
                    update: {
                      deleted: null,
                      status: EstadoAreaTramite.pending
                    },
                    create: {
                      areaId: area.id
                    }
                  }
                };

            await prisma.expediente.update({
              where: {
                id: procesoLegales.expedienteId
              },
              data: {
                areas: areasObj
              }
            });

            deletePreviousAreas = false;
          }

          break;

        default:
          break;
      }
    }
  }
}

export default ProcesoLegalesActionStepRejected;
