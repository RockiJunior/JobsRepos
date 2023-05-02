import { EstadoAreaTramite, EstadoTramite } from '@prisma/client';
import prisma from '../../config/db';
import { ITramite } from '../../interfaces/tramite.interface';
import tramiteServices from '../../services/tramite.services';
import expedienteValidators from '../../validators/expediente.validators';
import tramiteValidators from '../../validators/tramite.validators';
import { notificacionMail } from '../enviarEmail';
import { registroHistorial } from '../registrarHistorial';
import { createDenuncia } from './createDenuncia';
import actionStep from './tramiteActionStep';

async function tramiteRejectedActionStep(tramite: ITramite) {
  const pasos = tramite.tipo.pasos;
  const actions = pasos[tramite.pasoActual].onRejectActions;
  let deletePreviousAreas = true;

  if (actions) {
    for (const item of actions) {
      const [action, tipo] = item.split('/');
      switch (action) {
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
                      tramiteId: tramite.id
                    },
                    data: {
                      deleted: new Date()
                    }
                  },
                  upsert: {
                    where: {
                      areaId_tramiteId: {
                        areaId: area.id,
                        tramiteId: tramite.id
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
                      areaId_tramiteId: {
                        areaId: area.id,
                        tramiteId: tramite.id
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

            await prisma.tramite.update({
              where: {
                id: tramite.id
              },
              data: {
                areas: areasObj
              }
            });

            deletePreviousAreas = false;
          }

          break;

        case 'goTo':
          await tramiteServices.update(tramite.id, {
            pasoActual: Number(tipo)
          });

          const tramiteDB = await tramiteValidators.getByIdForAction(
            tramite.id
          );

          if (tramiteDB) {
            await actionStep(tramiteDB);
          }

          break;

        case 'startExpediente':
          const denuncia = await createDenuncia({
            tramite: tramite,
            esCucicba: true
          });

          if (tramite.carpetaId) {
            await expedienteValidators.create({
              areaId: Number(tipo),
              carpetaId: tramite.carpetaId,
              tramitePadreId: tramite.id,
              denunciaId: denuncia.id,
              isDenuncia: false
            });
          }
          break;

        case 'changeStatus':
          const estado = tipo as EstadoTramite;

          let fechaFin;

          if (
            estado === EstadoTramite.rechazado ||
            estado === EstadoTramite.cancelado ||
            estado === EstadoTramite.aprobado
          ) {
            await tramiteServices.deleteAllAreas(tramite.id);
            fechaFin = new Date();
          }

          await prisma.tramite.update({
            where: {
              id: tramite.id
            },
            data: {
              estado,
              fechaFin
            }
          });
          if (estado === EstadoTramite.rechazado) {
            if (tramite.empleadoId) {
              await registroHistorial({
                titulo: 'Finalización del Trámite',
                descripcion: `El trámite ha sido rechazado`,
                usuarioId: tramite.empleadoId,
                tramiteId: tramite.id
              });
            }
          }

          break;

        case 'notifyMail':
          await notificacionMail({ type: tipo, tramite, condition: 'mail' });
          break;

        default:
          break;
      }
    }
  }
}

export default tramiteRejectedActionStep;
