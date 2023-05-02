import { EstadoAreaTramite, EstadoExpediente, EstadoProcesoLegales } from '@prisma/client';
import prisma from '../../config/db';
import procesoLegalesPasos from '../../data/procesoLegales';
import {
  IExpediente,
  IProcesoLegales
} from '../../interfaces/expediente.interface';

import plazoServices from '../../services/plazo.services';
import procesoLegalesServices from '../../services/procesoLegales.services';

import { notificacionMail, notificacionMailProceso } from '../enviarEmail';
import { notifyExpediente } from '../notify';
import { denunciasPdf } from '../pdf';
import { log } from 'console';
import expedienteValidators from '../../validators/expediente.validators';
import { registroHistorial } from '../registrarHistorial';

async function ProcesolegalActionStep(procesoLegal: IProcesoLegales) {
  const actions = procesoLegalesPasos[procesoLegal.pasoActual].actions;
  let deletePreviousAreas = true;

  if (actions) {
    for (const item of actions) {
      const [action, tipo] = item.split('/');
      switch (action) {
        //   case 'startExpiration':
        //     if (expediente.tipo.plazo) {
        //       await prisma.expediente.update({
        //         where: {
        //           id: expediente.id
        //         },
        //         data: {
        //           expiracion:
        //             tipo === 'tipo'
        //               ? dayjs().add(expediente.tipo.plazo, 'days').toDate()
        //               : dayjs().add(Number(tipo), 'days').toDate()
        //         }
        //       });
        //     }
        //     break;

        //   case 'finishExpiration':
        //     await prisma.expediente.update({
        //       where: {
        //         id: expediente.id
        //       },
        //       data: {
        //         expiracion: null
        //       }
        //     });
        //     break;

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
                      expedienteId: procesoLegal.expedienteId
                    },
                    data: {
                      deleted: new Date()
                    }
                  },
                  upsert: {
                    where: {
                      areaId_expedienteId: {
                        areaId: area.id,
                        expedienteId: procesoLegal.expedienteId
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
                        expedienteId: procesoLegal.expedienteId
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
                id: procesoLegal.expedienteId
              },
              data: {
                areas: areasObj
              }
            });

            deletePreviousAreas = false;
          }

          break;

        case 'notifyExpediente':
          let expediente = await expedienteValidators.getByIdForActions(procesoLegal.expedienteId)

          if (expediente) {
            await notifyExpediente({
              tipo,
              expediente: expediente as IExpediente,
              procesoLegalId: procesoLegal.id
            });
          }

          break;

        case 'denunciaPdf':
          await denunciasPdf(procesoLegal.id);
          break;

        case 'startPlazo':
          const [dias, areas] = tipo.split('_');
          await plazoServices.create({
            areas,
            dias: Number(dias),
            expedienteId: procesoLegal.expedienteId
          });
          break;

        //   case 'startExpediente':
        //     await expedienteValidators.create(
        //       Number(tipo),
        //       expediente.carpetaId,
        //       undefined,
        //       expediente.id
        //     );
        //     break;

        case 'changeStatus':
          const estado = tipo as EstadoProcesoLegales;
          await prisma.procesoLegales.update({
            where: {
              id: procesoLegal.id
            },
            data: {
              estado
            }
          });

          switch(estado) {
            case EstadoProcesoLegales.finalizado:
              await prisma.expediente.update({
                where: {
                  id: procesoLegal.expedienteId
                },
                data: {
                  estado: EstadoExpediente.pendiente
                }
              })
              
              await registroHistorial({
                titulo: 'Proceso legal finalizado',
                descripcion: `El proceso legal ${procesoLegal.id} ha finalizado`,
                expedienteId: procesoLegal.expedienteId,
                procesoLegalId: procesoLegal.id,
              })

              await registroHistorial({
                titulo: 'Proceso legal finalizado',
                descripcion: `El proceso legal ${procesoLegal.id} ha finalizado`,
                expedienteId: procesoLegal.expedienteId,
              })
              break;

            default:
              break;
          }
          break;

        //   case 'manualAssingEmployee':
        //     await prisma.expediente.update({
        //       where: {
        //         id: expediente.id
        //       },
        //       data: {
        //         asignarEmpleado: true
        //       }
        //     });

        //     break;
        case 'cedulaNotificacionDenuncia':
          const [mail, destinatario, tipoNotificacion] = tipo.split('_');
          if (mail === 'mail') {
            if (destinatario === 'ambos') {
              const procesoLegalDB = await procesoLegalesServices.findById(
                procesoLegal.id
              );
              if (procesoLegalDB) {
                await notificacionMailProceso({
                  type: tipoNotificacion,
                  procesoLegal: procesoLegalDB,
                  condition: 'ambos'
                });
              }
            } else if (destinatario === 'solo') {
              const procesoLegalDB = await procesoLegalesServices.findById(
                procesoLegal.id
              );
              if (procesoLegalDB) {
                await notificacionMailProceso({
                  type: tipoNotificacion,
                  procesoLegal: procesoLegalDB,
                  condition: 'solo'
                });
              }
            }
          }
          // crear cedulas para ambos
          break;

        case 'notifyMail':
          await notificacionMailProceso({
            type: tipo,
            condition: 'mail',
            procesoLegal
          })
        break;

        default:
          break;
      }
    }
  }
}

export default ProcesolegalActionStep;
