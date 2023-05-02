import { EstadoAreaTramite, EstadoTramite } from '@prisma/client';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import prisma from '../../config/db';
import areasObj from '../../data/areas';
import tramites from '../../data/tramites';
import { ITramite } from '../../interfaces/tramite.interface';
import { IDatos } from '../../interfaces/users.interface';
import carpetaServices from '../../services/carpeta.services';
import plazoServices from '../../services/plazo.services';
import tramiteServices from '../../services/tramite.services';
import usersServices from '../../services/users.services';
import usuarioEventoServices from '../../services/usuarioEvento.services';
import expedienteValidators from '../../validators/expediente.validators';
import { notificacionMail } from '../enviarEmail';
import { notify } from '../notify';
import { create, firmaPdf } from '../pdf';
import { generateQR } from '../qrGenerator';
import { registroHistorial } from '../registrarHistorial';
import { condicionTransaccion } from './condicionTransaccion';
import { createDenuncia } from './createDenuncia';
import { saveUserData } from './tramiteSaveUserData';

dayjs.extend(isBetween);

declare const process: {
  env: {
    CRYPTO_SECRET: string;
    PORTAL_URL: string;
  };
};

async function tramiteActionStep(tramite: ITramite) {
  const pasos = tramite.tipo.pasos;
  const actions = pasos[tramite.pasoActual].actions;
  let deletePreviousAreas = true;
  if (actions) {
    for (const item of actions) {
      const [action, tipo] = item.split('/');
      switch (action) {
        case 'createTransaction':
          const parseTransacciones: { nombre: string; condicion?: string }[] =
            JSON.parse(tipo);

          for (const infoTransaccion of parseTransacciones) {
            let nuevoMonto;
            if (infoTransaccion.condicion) {
              const [cumpleCondicion, montoDinamico] = condicionTransaccion(
                tramite,
                infoTransaccion.nombre,
                infoTransaccion.condicion
              );

              if (!cumpleCondicion) {
                continue;
              }

              if (montoDinamico) {
                nuevoMonto = montoDinamico;
              }
            }
            let tipoTransaccion = await prisma.tipoTransaccion.findUnique({
              where: {
                nombre: infoTransaccion.nombre
              },
              include: {
                TipoTransaccionConcepto: {
                  include: {
                    concepto: true
                  }
                },
                opcionesCuotas: {
                  where: {
                    activo: true
                  }
                }
              }
            });

            const inicioPlazo = dayjs(tramite.expiracion).subtract(
              tramite.tipo.plazo,
              'day'
            );
            const anio = inicioPlazo.year();
            if (
              inicioPlazo.isBetween(`${anio}-11-01`, `${anio}-12-31`) &&
              infoTransaccion.nombre === 'matriculacion2'
            ) {
              tipoTransaccion = await prisma.tipoTransaccion.findUnique({
                where: {
                  nombre: 'matriculacion3'
                },
                include: {
                  TipoTransaccionConcepto: {
                    include: {
                      concepto: true
                    }
                  },
                  opcionesCuotas: {
                    where: {
                      activo: true
                    }
                  }
                }
              });
            } else if (
              infoTransaccion.nombre === 'infraccionAntesDeMatricularse1' &&
              nuevoMonto &&
              nuevoMonto >= 50000 &&
              nuevoMonto < 100000
            ) {
              tipoTransaccion = await prisma.tipoTransaccion.findUnique({
                where: {
                  nombre: 'infraccionAntesDeMatricularse2'
                },
                include: {
                  TipoTransaccionConcepto: {
                    include: {
                      concepto: true
                    }
                  },
                  opcionesCuotas: {
                    where: {
                      activo: true
                    }
                  }
                }
              });
            } else if (
              infoTransaccion.nombre === 'infraccionAntesDeMatricularse1' &&
              nuevoMonto &&
              nuevoMonto >= 100000
            ) {
              tipoTransaccion = await prisma.tipoTransaccion.findUnique({
                where: {
                  nombre: 'infraccionAntesDeMatricularse3'
                },
                include: {
                  TipoTransaccionConcepto: {
                    include: {
                      concepto: true
                    }
                  },
                  opcionesCuotas: {
                    where: {
                      activo: true
                    }
                  }
                }
              });
            }

            if (
              tipoTransaccion &&
              tramite.carpeta &&
              !tramite.transacciones.some(
                (t) => t.tipoTransaccionNombre === tipoTransaccion?.nombre
              )
            ) {
              if (tipoTransaccion.opcionesCuotas.length === 1) {
                await prisma.transaccion.create({
                  data: {
                    monto:
                      nuevoMonto || tipoTransaccion.opcionesCuotas[0].monto,
                    cuotaNro: 1,
                    opcionCuotasId: tipoTransaccion.opcionesCuotas[0].id,
                    tipoTransaccionNombre: tipoTransaccion.nombre,
                    usuarioId: tramite.carpeta.usuarioId,
                    tramiteId: tramite.id
                  }
                });
              } else {
                await prisma.transaccion.create({
                  data: {
                    usuarioId: tramite.carpeta.usuarioId,
                    tipoTransaccionNombre: tipoTransaccion.nombre,
                    tramiteId: tramite.id,
                    montoDinamico: nuevoMonto
                  }
                });
              }
            }
          }

          break;

        case 'startExpiration':
          await prisma.tramite.update({
            where: {
              id: tramite.id
            },
            data: {
              expiracion:
                tipo === 'tipo'
                  ? dayjs().add(tramite.tipo.plazo, 'days').toDate()
                  : dayjs().add(Number(tipo), 'days').toDate()
            }
          });
          break;

        case 'finishExpiration':
          await prisma.tramite.update({
            where: {
              id: tramite.id
            },
            data: {
              expiracion: null
            }
          });
          break;

        case 'manualAssingEmployee':
          await prisma.tramite.update({
            where: {
              id: tramite.id
            },
            data: {
              asignarEmpleado: true
            }
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

        case 'event':
          const tipoEvento = await prisma.tipoEvento.findUnique({
            where: {
              nombre: tipo
            }
          });

          if (tipoEvento && tramite.carpeta?.usuarioId) {
            const usuarioEvento = await prisma.usuario_Evento.findFirst({
              where: {
                usuarioId: tramite.carpeta.usuarioId,
                tipoEventoId: tipoEvento.id
              }
            });

            if (!usuarioEvento) {
              await usuarioEventoServices.create({
                usuarioId: tramite.carpeta.usuarioId,
                tipoEventoId: tipoEvento.id
              });
            }
          }

          break;

        case 'notify':
          await notify({ tipo, tramite });
          break;

        case 'notifyMail':
          await notificacionMail({ type: tipo, tramite, condition: 'mail' });
          break;

        case 'assingMatricula':
          if (tramite.carpeta?.usuarioId) {
            const matriPenditeActiva = await prisma.matricula.findFirst({
              where: {
                OR: [{ estado: 'pendiente' }, { estado: 'activo' }],
                usuarioId: tramite.carpeta.usuarioId
              }
            });
            if (!matriPenditeActiva) {
              const ultimaMatricula = await prisma.matricula.findFirst({
                orderBy: {
                  id: 'desc'
                }
              });
              if (ultimaMatricula && tramite.carpeta) {
                const matricula = await prisma.matricula.create({
                  data: {
                    id: ++ultimaMatricula.id,
                    usuarioId: tramite.carpeta.usuarioId
                  }
                });

                await prisma.usuario.update({
                  where: {
                    id: tramite.carpeta.usuarioId
                  },
                  data: {
                    nroUltimaMatricula: matricula.id
                  }
                });

                const destination = `/public/archivos/${tramite.carpeta.usuarioId}/qrmatricula`;
                const filename = `${matricula.id}.png`;

                const encryptMatriculaId = CryptoJS.AES.encrypt(
                  String(matricula.id),
                  process.env.CRYPTO_SECRET
                )
                  .toString()
                  .replaceAll('+', 'xMl3Jk')
                  .replaceAll('/', 'Por21Ld')
                  .replaceAll('=', 'Ml32');

                const encryptUser = CryptoJS.AES.encrypt(
                  String(tramite.carpeta.usuarioId),
                  process.env.CRYPTO_SECRET
                )
                  .toString()
                  .replaceAll('+', 'xMl3Jk')
                  .replaceAll('/', 'Por21Ld')
                  .replaceAll('=', 'Ml32');

                const url = `${process.env.PORTAL_URL}/qr?m=${encryptMatriculaId}&u=${encryptUser}`;

                await generateQR(destination, filename, url);

                await registroHistorial({
                  titulo: 'Asignación de Matrícula',
                  descripcion: `Se te ha asignado Número de Matrícula <strong>${matricula.id}</strong>`,
                  usuarioId: tramite.carpeta.usuarioId,
                  tramiteId: tramite.id
                });

                await notify({ tipo: 'user_assingMatricula', tramite });
              }
            }
          }
          break;

        case 'vencimientoMatricula':
          if (tramite.carpeta?.usuarioId) {
            const matriPenditeActivaVenc = await prisma.matricula.findFirst({
              where: {
                estado: 'activo_sin_actividad',
                usuarioId: tramite.carpeta.usuarioId
              }
            });

            if (matriPenditeActivaVenc) {
              const anio = dayjs().year();
              const fechaVencimiento = dayjs(`${anio}-12-31`).toDate();
              await prisma.matricula.update({
                where: {
                  id: matriPenditeActivaVenc.id
                },
                data: {
                  vencimiento: fechaVencimiento
                }
              });
            }
          }
          break;

        case 'activateMatriculaSinActividad':
          if (tramite.carpeta?.usuarioId) {
            const matriPendiente = await prisma.matricula.findFirst({
              where: {
                OR: [{ estado: 'pendiente' }, { estado: 'activo' }],
                usuarioId: tramite.carpeta.usuarioId
              }
            });
            if (matriPendiente) {
              await prisma.matricula.update({
                where: {
                  id: matriPendiente.id
                },
                data: {
                  estado: 'activo_sin_actividad'
                }
              });
              await registroHistorial({
                titulo: 'Activación de Matrìcula (Sin Actividad Comercial)',
                descripcion: `Ya tenes tu Matrícula Activa`,
                usuarioId: tramite.carpeta.usuarioId,
                tramiteId: tramite.id
              });
            }
          }
          break;

        case 'activateMatriculaConActividad':
          if (tramite.carpeta?.usuarioId) {
            const matriPendiente = await prisma.matricula.findFirst({
              where: {
                estado: 'activo_sin_actividad',
                usuarioId: tramite.carpeta.usuarioId
              }
            });
            if (matriPendiente) {
              await prisma.matricula.update({
                where: {
                  id: matriPendiente.id
                },
                data: {
                  estado: 'activo'
                }
              });
              await registroHistorial({
                titulo: 'Activación de Matrìcula (Con Actividad Comercial)',
                descripcion: `Ya tenes tu Matrícula Activa`,
                usuarioId: tramite.carpeta.usuarioId,
                tramiteId: tramite.id
              });
            }
          }
          break;

        case 'activateMatriculaCesantia':
          if (tramite.carpeta?.usuarioId) {
            const matriculaCesante = await prisma.matricula.findFirst({
              where: {
                estado: 'cesante',
                usuarioId: tramite.carpeta.usuarioId
              },
              orderBy: {
                fecha: 'desc'
              }
            });
            if (matriculaCesante && tramite.carpeta) {
              const secciones = tramite.tipo.secciones;
              const seccion = secciones.find((s) => s.tipo === 'matricula');
              const obj: { [prop: string]: string | undefined | null } = {};
              if (seccion) {
                for (const input of seccion.inputs) {
                  obj[input.nombre] = input.InputValues?.value;
                }
              }

              await prisma.matricula.update({
                where: {
                  id: matriculaCesante.id
                },
                data: {
                  estado: 'activo_sin_actividad',
                  libro: obj.libroMatricula,
                  tomo: obj.tomoMatricula,
                  folio: obj.folioMatricula
                }
              });
              await registroHistorial({
                titulo: 'Activación de Matrícula',
                descripcion: `Ya tenes tu Matricula Activa`,
                usuarioId: tramite.carpeta.usuarioId,
                tramiteId: tramite.id
              });
            }
          }
          break;

        case 'inactivateMatricula':
          if (tramite.carpeta?.usuarioId) {
            const matriActiva = await prisma.matricula.findFirst({
              where: {
                OR: [{ estado: 'activo' }, { estado: 'activo_sin_actividad' }],
                usuarioId: tramite.carpeta.usuarioId
              }
            });
            if (matriActiva) {
              await prisma.matricula.update({
                where: {
                  id: matriActiva.id
                },
                data: {
                  estado: 'baja'
                }
              });
              await registroHistorial({
                titulo: 'Baja Matrícula',
                descripcion: `Tu Matrícula paso a estar de baja`,
                usuarioId: tramite.carpeta.usuarioId,
                tramiteId: tramite.id
              });
            }
          }
          break;

        case 'pasivaMatricula':
          if (tramite.carpeta?.usuarioId) {
            const matricuActiva = await prisma.matricula.findFirst({
              where: {
                estado: 'activo',
                usuarioId: tramite.carpeta.usuarioId
              }
            });
            if (matricuActiva) {
              await prisma.matricula.update({
                where: {
                  id: matricuActiva.id
                },
                data: {
                  estado: 'pasiva'
                }
              });
              await registroHistorial({
                titulo: 'Inactiva Matrícula',
                descripcion: `Tu Matrícula paso a estar inactiva`,
                usuarioId: tramite.carpeta.usuarioId,
                tramiteId: tramite.id
              });
            }
          }
          break;

        case 'startPlazo':
          const [dias, areas] = tipo.split('_');
          await plazoServices.create({
            areas,
            dias: Number(dias),
            tramiteId: tramite.id
          });
          break;

        case 'tipoSeccion':
          if (tipo === 'matricula') {
            const secciones = tramite.tipo.secciones;
            const seccion = secciones.find((s) => s.tipo === 'matricula');
            if (seccion) {
              const inputs = seccion.inputs;
              for (const input of inputs) {
                if (input.InputValues) {
                  await prisma.inputsValues.delete({
                    where: {
                      tramiteId_inputNombre: {
                        tramiteId: tramite.id,
                        inputNombre: input.nombre
                      }
                    }
                  });
                }
              }
              const matriculaDB = await prisma.matricula.findFirst({
                where: {
                  usuarioId: tramite.carpeta?.usuarioId,
                  estado: 'pendiente'
                }
              });
              if (matriculaDB) {
                await prisma.matricula.update({
                  where: {
                    id: matriculaDB.id
                  },
                  data: {
                    libro: null,
                    tomo: null,
                    folio: null
                  }
                });
              }
            }
          }
          await prisma.tramite.update({
            where: {
              id: tramite.id
            },
            data: {
              tipoSeccion: tipo
            }
          });
          break;

        case 'approveTramite':
          await prisma.tramite.update({
            where: {
              id: tramite.id
            },
            data: {
              estado: 'aprobado',
              fechaFin: new Date()
            }
          });

          await registroHistorial({
            titulo: 'Finalización del Trámite',
            descripcion: `El trámite ha sido aprobado`,
            usuarioId: tramite.carpeta?.usuarioId,
            tramiteId: tramite.id
          });

          await notificacionMail({ type: action, tramite, condition: action });
          await tramiteServices.deleteAllAreas(tramite.id);
          await saveUserData(tramite);

          break;

        case 'createPdf':
          await create(tramite.id);
          break;

        case 'firmaPdf':
          await firmaPdf(tramite.id);
          break;

        case 'startExpediente':
          let expediente;
          if (tramite.tipo.tipo === 'denuncia') {
            const denuncia = await createDenuncia({
              tramite: tramite,
              esCucicba:
                tramite.tipoId === tramites.denunciaPorCucicba ||
                tramite.tipoId === tramites.denunciaCucicbaFiscalizacion
            });

            if (tramite.info.denunciado) {
              let carpetaDenunciado = await carpetaServices.findCarpetaActiva(
                tramite.info.denunciado
              );

              if (!carpetaDenunciado) {
                carpetaDenunciado = await carpetaServices.create({
                  usuarioId: tramite.info.denunciado,
                  descripcion: 'Carpeta de trámites'
                });
              }

              if (carpetaDenunciado) {
                expediente = await expedienteValidators.create({
                  areaId:
                    tramite.tipoId === tramites.denunciaCucicbaFiscalizacion
                      ? areasObj.fiscalizacion
                      : areasObj.legales,
                  carpetaId: carpetaDenunciado.id,
                  tramitePadreId: tramite.id,
                  denunciaId: denuncia.id,
                  isDenuncia: true
                });
              } else {
                expediente = await expedienteValidators.create({
                  areaId:
                    tramite.tipoId === tramites.denunciaPorCucicba
                      ? areasObj.legales
                      : areasObj.fiscalizacion,
                  tramitePadreId: tramite.id,
                  denunciaId: denuncia.id,
                  isDenuncia: true
                });
              }
            } else {
              expediente = await expedienteValidators.create({
                areaId:
                  tramite.tipoId === tramites.denunciaPorCucicba
                    ? areasObj.legales
                    : areasObj.fiscalizacion,
                tramitePadreId: tramite.id,
                denunciaId: denuncia.id,
                isDenuncia: true
              });
            }
          } else {
            const denuncia = await createDenuncia({
              tramite: tramite,
              esCucicba: true
            });

            if (tramite.carpetaId) {
              expediente = await expedienteValidators.create({
                areaId: areasObj.legales,
                carpetaId: tramite.carpetaId,
                tramitePadreId: tramite.id,
                denunciaId: denuncia.id,
                isDenuncia: false
              });
            } else {
              expediente = await expedienteValidators.create({
                areaId: areasObj.fiscalizacion,
                tramitePadreId: tramite.id,
                isDenuncia: false,
                denunciaId: denuncia.id
              });
            }
          }
          break;

        case 'approveOblea':
          if (
            tramite.tipoSeccion === 'actividadComercial' &&
            tramite.carpeta?.usuarioId
          ) {
            const usuario = await prisma.usuario.findUnique({
              where: {
                id: tramite.carpeta.usuarioId
              }
            });

            if (usuario) {
              const oldData = usuario.datos as IDatos;
              await usersServices.update(tramite.carpeta.usuarioId, {
                datos: {
                  ...oldData,
                  oblea: true
                }
              });
            }
          }
          break;

        case `deleteComercialData`:
          const tipoActividadComercial = await prisma.tipoTramite.findUnique({
            where: {
              id: tramites.ddjjActividadComercial
            },
            include: {
              secciones: {
                include: {
                  inputs: true
                }
              }
            }
          });

          if (tipoActividadComercial) {
            const inputs = tipoActividadComercial.secciones.find(
              (seccion) => seccion.tipo === 'actividadComercial'
            )?.inputs;

            if (inputs && tramite.carpeta?.usuarioId) {
              const inputNames = inputs.map((input) => input.nombre);

              const userDatos = (
                await prisma.usuario.findUnique({
                  where: {
                    id: tramite.carpeta?.usuarioId
                  }
                })
              )?.datos as IDatos;

              if (userDatos) {
                for (const key in userDatos) {
                  if (inputNames.includes(key)) {
                    delete userDatos[key];
                  }
                }

                await usersServices.update(tramite.carpeta.usuarioId, {
                  datos: { ...userDatos, oblea: false }
                });
              }
            }
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
          await registroHistorial({
            titulo: `El trámite fue <strong>${estado}</strong>`,
            descripcion: ``,
            usuarioId: tramite.carpeta?.usuarioId,
            tramiteId: tramite.id
          });
          break;

        case 'setActividadComercial':
          if (tramite.carpeta?.usuarioId) {
            const user = await usersServices.findById(
              tramite.carpeta.usuarioId
            );
            if (user) {
              const datos = user.datos as IDatos;
              await usersServices.update(tramite.carpeta.usuarioId, {
                datos: {
                  ...datos,
                  actividadComercial: { value: tipo === 'true' ? true : false }
                }
              });
            }
          }
          break;
        case 'approveAllInputs':
          await prisma.inputsValues.updateMany({
            where: {
              tramiteId: tramite.id
            },
            data: {
              estado: 'approved'
            }
          });
          break;
        default:
          break;
      }
    }
  }
}

export default tramiteActionStep;
