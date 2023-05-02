import {
  Concepto,
  EstadoFiscalizacion,
  EstadoTransaccion,
  nombreMontoPorcentaje,
  Transaccion
} from '@prisma/client';
import prisma from '../config/db';
import areas from '../data/areas';
import permisos from '../data/permisos';
import {
  IOpcionCuotas,
  ITipoTransaccion
} from '../interfaces/transacciones.interface';
import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import historialServices from '../services/historial.services';
import plazoServices from '../services/plazo.services';
import tramiteServices from '../services/tramite.services';
import transaccionServices from '../services/transaccion.services';
import Exception from '../utils/Exception';
import { notify } from '../utils/notify';
import { registroHistorial } from '../utils/registrarHistorial';
import tramiteActionStep from '../utils/tramite/tramiteActionStep';
import checkGotoNextStep from '../utils/tramite/tramiteCheckGotoNextStep';
import checkGotoPrevStep from '../utils/tramite/tramiteCheckGotoPrevStep';
import { verificarPermiso } from '../utils/verificarPermisos';
import tramiteValidators from './tramite.validators';
import fiscalizacionServices from '../services/fiscalizacion.services';
import { sendMail } from '../utils/enviarEmail';
import inputValuesFiscalizacionServices from '../services/inputValuesFiscalizacion.services';
import expedienteServices from '../services/expediente.services';
import dayjs from 'dayjs';

class TransaccionValidator {
  async getById(id: number) {
    if (!id) {
      throw new Exception('La identificación de la carpeta es requerido');
    }

    const transaccionDB = await transaccionServices.findById(id);

    if (!transaccionDB) {
      throw new Exception('Carpeta no encontrado');
    }
    return transaccionDB;
  }
  async create({
    tramiteId,
    monto,
    estado,
    tipoTransaccionNombre,
    usuarioId
  }: {
    tramiteId: number;
    monto: number;
    estado: EstadoTransaccion;
    tipoTransaccionNombre: string;
    usuarioId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El id trámite es requerido');
    }

    if (!monto) {
      throw new Exception('El monto es requerido');
    }

    if (!estado) {
      throw new Exception('El estado es requerido');
    }

    if (!tipoTransaccionNombre) {
      throw new Exception('El estado es requerido');
    }
    if (!usuarioId) {
      throw new Exception(' El id del usuario es requerido');
    }

    const transaccion = await transaccionServices.create({
      tramiteId,
      monto,
      estado,
      tipoTransaccionNombre,
      usuarioId
    });

    return transaccion;
  }

  async update(id: number, data: Partial<Transaccion>) {
    if (!id) {
      throw new Exception('El id de usuario es requerido');
    }

    if (!data) {
      throw new Exception('Los datos son requeridos');
    }

    const transaccion = await transaccionServices.findById(id);

    if (!transaccion) {
      throw new Exception('Usuario no encontrado');
    }

    const transaccionUpdated = await transaccionServices.update(id, data);
    const tramiteDB = await tramiteServices.findById(id);
    if (tramiteDB) {
      await historialServices.create(
        'Se actualizó una transacción',
        `Se realizó una actualización de una transacción`,
        id,
        tramiteDB.id
      );
    }

    return transaccionUpdated;
  }

  async comprobante({
    transaccionId,
    userId,
    filename,
    documentoId
  }: {
    transaccionId: number;
    userId: number;
    filename: string;
    documentoId?: number;
  }) {
    {
      if (!transaccionId) {
        throw new Exception('El id del input es requerido');
      }

      if (!userId) {
        throw new Exception('El id del usuario es requerido');
      }
      const transaccion = await transaccionServices.findById(transaccionId);

      if (!transaccion) {
        throw new Exception('El comprobante es requerido');
      }

      const comprobanteGuardado = await documentoServices.upsertTransaccion({
        userId,
        filename,
        transaccionId,
        documentoId
      });

      await transaccionServices.update(transaccionId, {
        estado: EstadoTransaccion.sent
      });

      if (transaccion.tramiteId) {
        const tramite = await tramiteValidators.getByIdForAction(
          transaccion.tramiteId
        );

        if (tramite) {
          if (checkGotoNextStep(tramite)) {
            await tramiteServices.update(tramite.id, {
              pasoActual: tramite.pasoActual + 1
            });

            const newTramite = await tramiteValidators.getByIdForAction(
              tramite.id
            );

            await tramiteActionStep(newTramite);
          }
        }
      }

      if (!transaccion.empleadoId) {
        const empleadoArea = await empleadoServices.findEmpleadosByArea(
          areas.finanzas
        );
        const empleado =
          empleadoArea[Math.floor(Math.random() * empleadoArea.length)];
        if (empleado) {
          transaccionServices.asignarEmpleado({
            empleadoId: empleado.usuarioId,
            transaccionId
          });

          await notify({
            tipo: 'admin_TransactionAsigned',
            tramite: {
              empleadoId: empleado.usuarioId,
              carpeta: { usuarioId: userId },
              transaccionId
            }
          });
          const transanccionTipo = await transaccionServices.findById(
            transaccionId
          );

          if (transaccion.tramiteId) {
            registroHistorial({
              titulo: 'Se subió un comprobante',
              descripcion: `Se subió un comprobante para <strong>"${transanccionTipo?.tipoTransaccion.TipoTransaccionConcepto.map(
                (concepto) => concepto.concepto.nombre
              ).join(', ')}"</strong>`,
              usuarioId: userId,
              tramiteId: transaccion.tramiteId
            });
          } else if (transaccion.fiscalizacionId) {
            //TODO: registrar en expediente
          }
        }
        if (!empleado) {
          throw new Exception('No se encontró al empleado');
        }
      } else {
        const transaccion = await transaccionServices.findById(transaccionId);

        if (transaccion && transaccion.empleadoId) {
          const empleado = await empleadoServices.findById(
            transaccion.empleadoId
          );
          if (empleado) {
            await notify({
              tipo: 'admin_AdminTransactionModify',
              tramite: {
                empleadoId: empleado.usuarioId,
                carpeta: { usuarioId: userId },
                transaccionId
              }
            });

            if (transaccion.tramiteId) {
              await registroHistorial({
                titulo: 'Se modificó un comprobante',
                descripcion: `Se modificó un comprobante para la transacción <strong>"${transaccion.tipoTransaccion.TipoTransaccionConcepto.map(
                  (concepto) => concepto.concepto.nombre
                ).join(', ')}"</strong>`,
                usuarioId: userId,
                tramiteId: transaccion.tramiteId
              });
            } else if (transaccion.fiscalizacionId) {
              //TODO: registrar en expediente
            }
          }
        }
      }

      return comprobanteGuardado;
    }
  }

  async aprobarRechazarTransac({
    id,
    estado,
    comentario
  }: {
    id: number;
    estado: EstadoTransaccion;
    comentario?: string;
  }) {
    if (!id) {
      throw new Exception('El id de la transacción es requerido');
    }
    const transanccionTipo = await transaccionServices.findById(id);
    const transaccion = await transaccionServices.update(id, {
      estado,
      comentario
    });

    if (transaccion && transaccion.empleadoId) {
      if (transaccion.estado === 'approved') {
        if (transaccion.tramiteId) {
          await registroHistorial({
            titulo: 'Se aprobó la transacción',
            descripcion: `Se ha aprobado tu transacción <strong>"${transanccionTipo?.tipoTransaccion.TipoTransaccionConcepto.map(
              (concepto) => concepto.concepto.nombre
            ).join(', ')}"</strong>`,
            usuarioId: transaccion.empleadoId,
            tramiteId: transaccion.tramiteId
          });
        } else if (transaccion.fiscalizacionId) {
          const fiscalizacion = await fiscalizacionServices.findById(
            transaccion.fiscalizacionId
          );

          if (fiscalizacion && fiscalizacion.declaracionJurada) {
            await fiscalizacionServices.update({
              id: fiscalizacion.id,
              data: {
                estado: 'finalizada'
              }
            });

            await expedienteServices.update({
              id: fiscalizacion.expedienteId,
              data: {
                estado: 'pendiente'
              }
            });
          }

          //TODO: registrar en expediente
        }
      } else if (transaccion.estado === 'request') {
        if (transaccion.usuarioId) {
          await notify({
            tipo: 'user_UserTransactionModify',
            tramite: {
              carpeta: { usuarioId: transaccion.usuarioId },
              transaccionId: transaccion.id
            }
          });
        }

        if (transaccion.tramiteId) {
          await registroHistorial({
            titulo: 'Se solicitó modificación del comprobante',
            descripcion: `Modificación del comprobante en la transacción <strong>${transanccionTipo?.tipoTransaccion.TipoTransaccionConcepto.map(
              (concepto) => concepto.concepto.nombre
            ).join(', ')}</strong>`,
            usuarioId: transaccion.empleadoId,
            tramiteId: transaccion.tramiteId
          });
        } else if (transaccion.fiscalizacionId) {
          //TODO: registrar en expediente
        }
      }
    }

    if (transaccion.tramiteId) {
      const tramite = await tramiteValidators.getByIdForAction(
        transaccion.tramiteId
      );
      if (tramite) {
        if (checkGotoPrevStep(tramite)) {
          await tramiteServices.update(tramite.id, {
            pasoActual: tramite.pasoActual - 1
          });

          const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);

          if (plazo) {
            await plazoServices.finish(plazo.id);
          }
        } else if (checkGotoNextStep(tramite)) {
          await tramiteServices.update(tramite.id, {
            pasoActual: tramite.pasoActual + 1
          });

          const newTramite = await tramiteValidators.getByIdForAction(
            tramite.id
          );
          await tramiteActionStep(newTramite);

          const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);
          if (plazo) {
            await plazoServices.finish(plazo.id);
          }
        }
      }
    }

    return transaccion;
  }

  async transaccionByEmpleado({
    empleadoId,
    limite,
    pagina,
    busqueda,
    orden,
    columna
  }: {
    empleadoId: number;
    limite: number;
    pagina: number;
    busqueda: string;
    orden: string;
    columna: string;
  }) {
    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    await verificarPermiso(
      [permisos.transacciones.ver_transacciones],
      empleadoId
    );

    const transaccionesPending =
      await transaccionServices.transaccionByEmpleadoPending({
        empleadoId,
        busqueda
      });

    const transaccionesSnet =
      await transaccionServices.transaccionByEmpleadoSent({
        empleadoId,
        busqueda
      });

    const transacciones = [...transaccionesPending, ...transaccionesSnet].sort(
      (a: any, b: any) => {
        if (
          columna === 'nombre' ||
          columna === 'apellido' ||
          columna === 'dni' ||
          columna === 'email'
        ) {
          // orderBy = {
          //   usuario: {
          //     [columna]: orden
          //   }
          // };
          const userA = a.usuario ? a.usuario[columna] : '';
          const userB = b.usuario ? b.usuario[columna] : '';

          if (orden === 'asc') {
            return userA.localeCompare(userB);
          } else {
            return userB.localeCompare(userA);
          }
        } else if (columna === 'fecha') {
          const fechaA = dayjs(a.fecha);
          const fechaB = dayjs(b.fecha);
          if(orden === 'asc') {
            return fechaA.diff(b.fecha, 'minute');
          } else {
            return fechaB.diff(fechaA, 'minute');
          }
          
        } else {
          if (orden === 'asc') {
            if (
              typeof a[columna] === 'number' &&
              typeof b[columna] === 'number'
            ) {
              return a[columna] - b[columna];
            } else {
              return a[columna].localeCompare(b[columna]);
            }
          } else {
            if (
              typeof a[columna] === 'number' &&
              typeof b[columna] === 'number'
            ) {
              return b[columna] - a[columna];
            } else {
              return b[columna].localeCompare(a[columna]);
            }
          }
        }
      }
    );

    const skip = (pagina - 1) * limite;
    const take = limite;

    const transaccionesPaginadas = transacciones.slice(
      skip,
      skip + take > transacciones.length ? transacciones.length : skip + take
    );

    const contarTransacciones = transacciones.length;

    // const transaccionesDB = await transaccionServices.transaccionByEmpleado({
    //   empleadoId,
    //   limite,
    //   pagina,
    //   busqueda,
    //   orden,
    //   columna
    // })
    // console.log(transaccionesDB.length);

    const paginasTotales = Math.ceil(contarTransacciones / limite);

    const newTransacciones = transaccionesPaginadas.map((t) => {
      return {
        id: t.id,
        nombre:
          t.usuario?.nombre ||
          t.fiscalizacion?.expediente.denuncia?.nombreDenunciado,
        apellido:
          t.usuario?.apellido ||
          t.fiscalizacion?.expediente.denuncia?.apellidoDenunciado,
        dni:
          t.usuario?.dni || t.fiscalizacion?.expediente.denuncia?.dniDenunciado,
        email: t.usuario?.email || '-',
        monto: t.monto,
        fecha: t.fecha
      };
    });

    const respuesta = {
      count: contarTransacciones,
      transacciones: newTransacciones,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite
    };

    return respuesta;
  }

  async elegirCuotas({
    transaccionId,
    opcionCuotasId,
    usuarioId
  }: {
    transaccionId: number;
    opcionCuotasId: number;
    usuarioId: number;
  }) {
    if (!transaccionId) {
      throw new Exception('El id de la transacción es requerido');
    }
    if (!opcionCuotasId) {
      throw new Exception('El id de la opción de cuotas es requerido');
    }
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const transaccion = await transaccionServices.findById(transaccionId);

    if (!transaccion) {
      throw new Exception('No se encontró la transacción');
    }

    if (transaccion.usuarioId !== usuarioId) {
      throw new Exception(
        'No se puede modificar una transacción de otro usuario'
      );
    }

    const opcionCuotas = transaccion.tipoTransaccion.opcionesCuotas.find(
      (opcion) => opcion.id === opcionCuotasId
    ) as IOpcionCuotas | undefined;

    if (!opcionCuotas) {
      throw new Exception('No se encontró la opción de cuotas');
    }

    const newTransaction = await transaccionServices.update(transaccionId, {
      opcionCuotasId,
      monto: transaccion.montoDinamico
        ? Number(
            (
              (transaccion.montoDinamico +
                (transaccion.montoDinamico * opcionCuotas.interes) / 100) /
              opcionCuotas.cantidad
            ).toFixed(0)
          )
        : opcionCuotas.cuotas[0].monto, //siempre se elige la primera cuota
      cuotaNro: 1
    });

    return newTransaction;
  }

  async getAll({
    empleadoId,
    limite,
    pagina,
    busqueda,
    orden,
    columna
  }: {
    empleadoId: number;
    limite: number;
    pagina: number;
    busqueda: string;
    orden: string;
    columna: string;
  }) {
    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    await verificarPermiso(
      [permisos.transacciones.ver_transacciones_todas],
      empleadoId
    );

    const transacciones = await transaccionServices.findAll({
      limite,
      pagina,
      busqueda,
      orden,
      columna
    });

    const contarTransacciones =
      await transaccionServices.contarTotalTransaccionesAll(busqueda);
    const paginasTotales = Math.ceil(contarTransacciones / limite);

    const newTransacciones = transacciones.map((t) => ({
      id: t.id,
      nombre:
        t.usuario?.nombre ||
        t.fiscalizacion?.expediente.denuncia?.nombreDenunciado,
      apellido:
        t.usuario?.apellido ||
        t.fiscalizacion?.expediente.denuncia?.apellidoDenunciado,
      dni:
        t.usuario?.dni || t.fiscalizacion?.expediente.denuncia?.dniDenunciado,
      email: t.usuario?.email || '-',
      monto: t.monto,
      fecha: t.fecha,
      empleado: `${t.empleado?.usuario.apellido}, ${t.empleado?.usuario.nombre}`
    }));

    const respuesta = {
      count: contarTransacciones,
      transacciones: newTransacciones,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite
    };

    return respuesta;
  }

  async getTypes() {
    const tiposTransaccion = await prisma.tipoTransaccion.findMany({
      include: {
        TipoTransaccionConcepto: {
          include: {
            concepto: true
          }
        },
        opcionesCuotas: true
      }
    });

    return tiposTransaccion;
  }

  async crearTransaccionFiscalizacion({
    fiscalizacionId,
    conceptosId,
    conceptoInfraccionNoMatriculadoId
  }: {
    fiscalizacionId: number;
    conceptosId: number[];
    conceptoInfraccionNoMatriculadoId?: number;
  }) {
    if (!fiscalizacionId) {
      throw new Exception('El id de la fiscalización es requerido');
    }

    const fiscalizacion = await fiscalizacionServices.findById(fiscalizacionId);

    if (!fiscalizacion) {
      throw new Exception('No se encontró la fiscalización');
    }

    const fullConceptos = conceptoInfraccionNoMatriculadoId
      ? [...conceptosId, conceptoInfraccionNoMatriculadoId]
      : [...conceptosId];

    const conceptosToCreate = fullConceptos.reduce(
      (acc: { id: number; cantidad: number }[], concepto) => {
        const conceptoExistente = acc.find((c) => c.id === concepto);
        if (conceptoExistente) {
          conceptoExistente.cantidad += 1;
        } else {
          acc.push({ id: concepto, cantidad: 1 });
        }
        return acc;
      },
      []
    );

    const tipoTransaciones = await prisma.tipoTransaccion.findMany({
      where: {
        TipoTransaccionConcepto: {
          every: {
            conceptoId: { in: conceptosToCreate.map((c) => c.id) }
          }
        }
      },
      include: {
        TipoTransaccionConcepto: {
          include: {
            concepto: true
          }
        },
        opcionesCuotas: true
      }
    });

    let tipoTransaccion;

    for (const tipoT of tipoTransaciones) {
      if (tipoT.TipoTransaccionConcepto.length === conceptosToCreate.length) {
        const conceptos = tipoT.TipoTransaccionConcepto.map((t) => ({
          id: t.conceptoId,
          cantidad: t.cantidad
        }));

        const conceptosIguales = conceptos.every((c) => {
          const concepto = conceptosToCreate.find((c2) => c2.id === c.id);
          return concepto && concepto.cantidad === c.cantidad;
        });

        if (conceptosIguales) {
          tipoTransaccion = tipoT;
          break;
        }
      }
    }

    const ultimaTransaccion = await prisma.tipoTransaccion.findFirst({
      where: {
        nombre: {
          contains: 'fiscalizacion_'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let numeroFiscalizazion = 1;
    if (ultimaTransaccion) {
      numeroFiscalizazion = Number(ultimaTransaccion.nombre.split('_')[1]) + 1;
    }

    if (!tipoTransaccion) {
      const tipoTransaccionDB = await prisma.tipoTransaccion.create({
        data: {
          nombre: `fiscalizacion_${numeroFiscalizazion}`,
          opcionesCuotas: {
            create: [{ cantidad: 1, monto: 0, cuotas: [{ id: 1, monto: 0 }] }]
          }
        },
        include: {
          opcionesCuotas: true
        }
      });

      const conceptos = conceptosToCreate.map((c) => ({
        conceptoId: c.id,
        cantidad: c.cantidad,
        tipoTransaccionNombre: tipoTransaccionDB.nombre
      }));

      await prisma.tipoTransaccionConcepto.createMany({
        data: conceptos
      });

      tipoTransaccion = await prisma.tipoTransaccion.findUnique({
        where: {
          nombre: tipoTransaccionDB.nombre
        },
        include: {
          TipoTransaccionConcepto: {
            include: {
              concepto: true
            }
          },
          opcionesCuotas: true
        }
      });
    }

    if (!tipoTransaccion) {
      throw new Exception('No se pudo crear la transacción');
    }

    const config = await prisma.configuracion.findFirst();

    if (!config) {
      throw new Exception('No se encontró la configuración de los aranceles');
    }

    if (!config.matriculaAnual || !config.sueldoVitalMovil) {
      throw new Exception('No se encontró la configuración de los aranceles');
    }

    const tipoTransaccionParaTs = tipoTransaccion;
    const mappedConceptos = fullConceptos.map((cId) => {
      const concepto = tipoTransaccionParaTs.TipoTransaccionConcepto.find(
        (t) => t.conceptoId === cId
      );
      if (!concepto) {
        throw new Exception('No se encontró el concepto');
      }
      return {
        nombre: concepto.concepto.nombre,
        porcentaje: concepto.concepto.porcentaje,
        nombreMontoPorcentaje: concepto.concepto.nombreMontoPorcentaje
      };
    });

    const conceptos = mappedConceptos.map((c) => ({
      nombre: c.nombre,
      porcentaje: c.porcentaje,
      nombreMontoPorcentaje: c.nombreMontoPorcentaje,
      monto:
        (config[c.nombreMontoPorcentaje as nombreMontoPorcentaje] *
          (c.porcentaje || 0)) /
        100
    }));

    const monto = conceptos.reduce((acc, c) => {
      return acc + c.monto;
    }, 0);
    if (fiscalizacion.estado === EstadoFiscalizacion.pendiente) {
      const transaccionFiscalizacion = await prisma.transaccion.create({
        data: {
          monto,
          tipoTransaccion: {
            connect: {
              nombre: tipoTransaccion.nombre
            }
          },
          fiscalizacion: {
            connect: {
              id: fiscalizacionId
            }
          },
          info: {
            conceptos
          },
          tipoCuota: {
            connect: {
              id: tipoTransaccion.opcionesCuotas[0].id
            }
          }
        }
      });
      if (transaccionFiscalizacion) {
        await registroHistorial({
          titulo: `Se ha creado una transacción ante el Área de Fiscalizción`,
          descripcion: `Transacción Nro. <strong>${transaccionFiscalizacion.id}</strong> por un monto de <strong>$ ${transaccionFiscalizacion.monto}</strong>`,
          expedienteId: fiscalizacion.expedienteId
        });

        await registroHistorial({
          titulo: `Se ha creado una transacción ante el Área de Fiscalizción`,
          descripcion: `Transacción Nro. <strong>${transaccionFiscalizacion.id}</strong> por un monto de <strong>$ ${transaccionFiscalizacion.monto}</strong>`,
          expedienteId: fiscalizacion.expedienteId,
          fiscalizacionId: fiscalizacion.id
        });
      }

      const empleadoArea = await empleadoServices.findEmpleadosByArea(
        areas.finanzas
      );
      const empleado =
        empleadoArea[Math.floor(Math.random() * empleadoArea.length)];
      if (empleado) {
        transaccionServices.asignarEmpleado({
          empleadoId: empleado.usuarioId,
          transaccionId: transaccionFiscalizacion.id
        });
      }

      // Enviar Mail
      const inputMatriculadoId =
        await prisma.inputsValueFiscalizacion.findUnique({
          where: {
            fiscalizacionId_inputNombre: {
              fiscalizacionId: Number(fiscalizacionId),
              inputNombre: 'matriculado'
            }
          }
        });

      if (inputMatriculadoId?.value) {
        const id = Number(inputMatriculadoId.value);
        const matriculado = await prisma.usuario.findUnique({
          where: {
            id
          }
        });

        if (!matriculado) {
          throw new Exception('No se encontró el matriculado');
        }

        await sendMail({
          email: matriculado.email,
          title: 'Se te generó una transacción de fiscalización',
          text: `Se te generó una transacción de fiscalización.`
        });
      }

      return transaccionFiscalizacion;
    } else {
      throw new Exception(
        ` No se puede crear la transacción porque la Fiscalización se encuentra ${fiscalizacion.estado}`
      );
    }
  }

  async getConceptosFiscalizacion() {
    const conceptos = await prisma.concepto.findMany({
      where: {
        tipo: 'fiscalizacion'
      }
    });

    const conceptosObj: { [key: string]: Omit<Concepto, 'padre' | 'tipo'>[] } =
      {};

    const conceptosPadresTitles: {
      [key: string]: { nombre: string; tipo: string };
    } = {
      arancelesFiscalizacionMatriculado: {
        nombre:
          'Aranceles de fiscalización de matriculado (Porcentual Salario Mínimo Vital y Móvil)',
        tipo: 'matriculado'
      },
      arancelesInfraccionMatriculado: {
        nombre:
          'Aranceles de infracción de matriculado (Porcentual Salario Mínimo Vital y Móvil)',
        tipo: 'matriculado'
      },
      arancelesFiscalizacionNoMatriculado: {
        nombre:
          'Aranceles de fiscalización de no matriculado (Porcentual Salario Mínimo Vital y Móvil)',
        tipo: 'noMatriculado'
      },
      arancelesInfraccionNoMatriculado: {
        nombre:
          'Aranceles de infracción de no matriculado (Porcentual Cuota Anual)',
        tipo: 'oculto'
      }
    };

    const conceptosOrdernados = [
      'arancelesFiscalizacionMatriculado',
      'arancelesInfraccionMatriculado',
      'arancelesFiscalizacionNoMatriculado',
      'arancelesInfraccionNoMatriculado'
    ];

    conceptos.forEach((c) => {
      if (!c.padre) return;
      const padre = conceptosObj[c.padre];

      const { padre: unused, tipo, ...concepto } = c;

      if (padre) {
        padre.push(concepto);
      } else {
        conceptosObj[c.padre] = [concepto];
      }
    });

    return conceptosOrdernados.map((key) => ({
      nombre: conceptosPadresTitles[key].nombre,
      tipo: conceptosPadresTitles[key].tipo,
      conceptos: [
        ...conceptosObj[key].filter((c) => c.id === 37),
        ...conceptosObj[key]
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
          .filter((c) => c.id !== 37)
      ]
    }));
  }

  async delete(id: number) {
    if (!id) {
      throw new Exception('El id es requerido');
    }

    const transaccion = await transaccionServices.delete(id);

    return transaccion;
  }
}

export default new TransaccionValidator();
