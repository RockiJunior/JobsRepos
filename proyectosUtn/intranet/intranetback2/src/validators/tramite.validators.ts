import {
  EstadoInput,
  EstadoMatricula,
  InputsValues,
  Seccion
} from '@prisma/client';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import fs from 'fs';
import prisma from '../config/db';
import areas, { areasNames } from '../data/areas';
import permisos from '../data/permisos';
import tramites from '../data/tramites';
import { IPaso } from '../interfaces/pasos.interface';
import { IInput, ITramite } from '../interfaces/tramite.interface';
import { IDatos } from '../interfaces/users.interface';
import carpetaServices from '../services/carpeta.services';
import denunciaServices from '../services/denuncia.services';
import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import inputValuesServices from '../services/inputValues.services';
import matriculaServices from '../services/matricula.services';
import plazoServices from '../services/plazo.services';
import tipoTramiteServices from '../services/tipoTramite.services';
import tramiteServices from '../services/tramite.services';
import usersServices from '../services/users.services';
import { getFamily } from '../utils/buscarFamilia';
import { checkPasoSiguiente } from '../utils/checkPasoSiguiente';
import { notificacionMail } from '../utils/enviarEmail';
import Exception from '../utils/Exception';
import { notify } from '../utils/notify';
import { registroHistorial } from '../utils/registrarHistorial';
import tramiteActionStep from '../utils/tramite/tramiteActionStep';
import rejectedActionStep from '../utils/tramite/tramiteActionStepRejected';
import checkGotoNextStep from '../utils/tramite/tramiteCheckGotoNextStep';
import { tramiteCheckHasBeforeApprove } from '../utils/tramite/tramiteCheckHasBeforeApprove';
import tramiteGoTo from '../utils/tramite/tramiteGoTo';
import { tramiteOnRequestChangesStep } from '../utils/tramite/tramiteOnRequestChangesStep';
import { verificarPermiso } from '../utils/verificarPermisos';
import { IInputsValues } from './inputValues.validator';
import notificacionValidators from './notificacion.validators';
import { tiposTramites } from '../data/seed/tipos';

dayjs.extend(isBetween);

interface ISeccionConEstadoComentarios extends Seccion {
  estado?: EstadoInput;
  comentarios?: { titulo: string; comentario: string }[];
  inputs: IInput[];
}

declare const process: {
  env: {
    CRYPTO_SECRET: string;
    SERVER_URL: string;
  };
};

const buscarPadre = ({ inputs, padre }: { inputs: any; padre: string }) => {
  const result = inputs.find((i: any) => i.nombre === padre);

  if (result) {
    return result;
  }

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    if (input.hijos) {
      const result: any = buscarPadre({ inputs: input.hijos, padre });

      if (result) {
        return result;
      }
    }
  }
};

const getAreasPasoNames = (areasId: string[]) => {
  const areasMapped = areasId.map((areaId) => areasNames[Number(areaId)]);

  const last = areasMapped.pop();
  const areasJoined = areasMapped.length
    ? `${areasMapped.join(', ')} y ${last}`
    : last;
  return {
    title: areasMapped.length
      ? `El trámite pasó por las áreas <strong>${areasJoined}</strong>`
      : `El trámite pasó por el área <strong>${areasJoined}</strong>`,
    description: areasMapped.length
      ? `El trámite fue revisado por las áreas <strong>${areasJoined}</strong> y sigue curso.`
      : `El trámite fue revisado por el área <strong>${areasJoined}</strong> y sigue curso.`
  };
};

export class TramitesValidator {
  async getAll({
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda,
    rawFilter,
    rawRango
  }: {
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
    rawFilter?: string;
    rawRango?: string;
  }) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    await verificarPermiso([permisos.tramites.ver_tramites_todos], usuarioId);

    let filterObject;
    const filters = rawFilter?.split(',');

    if (filters) {
      for (const filterRaw of filters) {
        const filter = filterRaw.split(':');

        if (filter) {
          let query;
          switch (filter[0]) {
            case 'estado':
              query = { estado: filter[1] };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            case 'tipo':
              query = {
                tipo: {
                  id: Number(filter[1])
                }
              };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            case 'area':
              query = {
                areas: {
                  some: {
                    areaId: Number(filter[1]),
                    deleted: null
                  }
                }
              };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            default:
              break;
          }
        }
      }
    }

    const filterRango = rawRango?.split(',');

    if (filterRango) {
      if (dayjs(filterRango[0]).isValid() && dayjs(filterRango[1]).isValid()) {
        const filterRangoObject = {
          createdAt: {
            gte: dayjs(filterRango[0]).startOf('day').toDate(),
            lte: dayjs(filterRango[1]).endOf('day').toDate()
          }
        };
        filterObject = {
          ...(filterObject || {}),
          ...filterRangoObject
        };
      }
    }

    const tramitesDB = await tramiteServices.findAll({
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject
    });

    const contarTramites = await tramiteServices.contarTramitesAll({
      busqueda,
      filter: filterObject
    });

    const paginasTotales = Math.ceil(contarTramites / limite);

    const newTramites = tramitesDB.map((tramite) => {
      const pasos = tramite.tipo.pasos as any as IPaso[];

      return {
        id: tramite.id,
        titulo: tramite.tipo.titulo,
        estado: tramite.estado,
        createdAt: tramite.createdAt,
        nombre: tramite.datosUsuario.nombre,
        apellido: tramite.datosUsuario.apellido,
        dni: tramite.datosUsuario.dni,
        // email: tramite.carpeta?.usuario.email,
        area: tramite.areas
          .filter((area) => !area.deleted)
          .map((item) => item.area.nombre),
        pasoActual: {
          label: `${tramite.pasoActual + 1} de ${tramite.tipo.pasos.length}`,
          title: pasos[tramite.pasoActual].intraTitle
        },
        numero: tramite.numero,
        fechaFin: tramite.fechaFin
      };
    });

    const respuesta = {
      count: contarTramites,
      tramites: newTramites,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite,
      filter: rawFilter
    };

    return respuesta;
  }

  async getById(id: number) {
    if (!id) {
      throw new Exception('El id del Trámite es requerido');
    }

    const tramiteDB = await tramiteServices.findById(id);

    if (!tramiteDB) {
      throw new Exception('Trámite no encontrado');
    }

    tramiteDB.tipo.secciones = tramiteDB.tipo.secciones.filter(
      (s) => s.tipo === tramiteDB.tipoSeccion || !s.tipo || s.tipo === 'interno'
    );

    for (const seccionSinEsTadoComentarios of tramiteDB.tipo.secciones) {
      const seccion =
        seccionSinEsTadoComentarios as ISeccionConEstadoComentarios;

      let flag: EstadoInput = EstadoInput.pending;
      let approvedCount = 0;
      let noRequeridoCount = 0;

      const seccionObservations = [];

      let newSeccionInputs = [...seccion.inputs];

      for (const input of seccion.inputs) {
        const requerido = input.requerido as [];

        if (input.padre) {
          const padre = buscarPadre({
            inputs: newSeccionInputs,
            padre: input.padre
          }) as any;

          if (padre) {
            padre.hijos = padre.hijos ? [...padre.hijos, input] : [input];
          }

          newSeccionInputs = newSeccionInputs.filter(
            (i) => i.nombre !== input.nombre
          );
        }

        if (input.InputValues) {
          const inputStatus = input.InputValues.estado;

          if (input.InputValues.comentario) {
            seccionObservations.push({
              titulo: input.titulo,
              comentario: input.InputValues.comentario
            });
          }

          if (inputStatus === 'rejected') {
            flag = EstadoInput.rejected;
            break;
          }

          if (inputStatus === 'request') {
            flag = 'request';
          }

          if (inputStatus === 'sent' && flag !== 'request') {
            flag = 'sent';
          }

          if (inputStatus === 'approved') {
            approvedCount++;
          }
        } else {
          if (requerido.some((r) => r === false)) {
            noRequeridoCount++;
          }

          input.InputValues = undefined as any;
        }

        if (
          approvedCount + noRequeridoCount === seccion.inputs.length &&
          approvedCount > 0
        ) {
          flag = EstadoInput.approved;
        }
        seccion.estado = flag;
      }
      seccion.comentarios = seccionObservations;
      seccion.inputs = newSeccionInputs;
    }

    return tramiteDB;
  }

  async getByIdForAction(id: number): Promise<ITramite> {
    if (!id) {
      throw new Exception('El id del trámite es requerido');
    }

    const tramite = await tramiteServices.findById(id);

    if (!tramite) {
      throw new Exception('El trámite no existe');
    }

    const newTramite: ITramite = {
      ...tramite,
      tipo: {
        ...tramite.tipo,
        secciones: tramite.tipo.secciones.map((seccion) => ({
          ...seccion,
          tipo: seccion.tipo as string | undefined
        })),
        pasos: tramite.tipo.pasos as any as IPaso[],
        puedeIniciar: tramite.tipo.puedeIniciar,
        descripcion: tramite.tipo.descripcion
      }
    };
    return newTramite;
  }

  async create({
    usuarioSolicitanteId,
    tipoId,
    userId,
    empleadoId
  }: {
    usuarioSolicitanteId: number;
    tipoId: number;
    userId: number;
    empleadoId?: number;
  }) {
    if (!tipoId) {
      throw new Exception('El tipo de trámite es requerido');
    }

    if (!userId) {
      throw new Exception('El usuario es requerido');
    }

    if (!usuarioSolicitanteId) {
      throw new Exception('El usuario solicitante es requerido');
    }

    let carpetaActiva = await carpetaServices.findCarpetaActiva(userId);

    if (!carpetaActiva) {
      carpetaActiva = await carpetaServices.create({
        descripcion: 'Carpeta de Trámites',
        usuarioId: userId
      });
    }

    const tipoTramite = await tipoTramiteServices.findById(tipoId);

    const tramiteActivo =
      await tramiteServices.findTramitePendienteByTipoAndUser({
        tipoId,
        usuarioId: userId
      });

    if (tramiteActivo && tipoTramite?.tipo !== 'denuncia') {
      throw new Exception(
        `Ya existe un trámite activo de ${tramiteActivo.tipo.titulo} para este matriculado`
      );
    }

    const usuario = await usersServices.findById(carpetaActiva.usuarioId);

    const usuarioSolicitante = await usersServices.findById(
      usuarioSolicitanteId
    );

    if (!usuarioSolicitante) {
      throw new Exception('El usuario solicitante no existe');
    }

    if (!usuario) {
      throw new Exception('El usuario no existe');
    }

    const expiracion = undefined;

    if (!tipoTramite) {
      throw new Exception('El tipo trámite no existe');
    }
    const matriculaActiva = await matriculaServices.getByUserId(usuario.id);
    const ultimaMatricula = await matriculaServices.ultimaMatricula(usuario.id);

    if (
      tipoTramite.id === tramites.certificadoMatriculaVigente ||
      tipoTramite.id === tramites.solicitudUserSistFidelitas ||
      tipoTramite.id === tramites.certificadoFirmaCotizaciones
    ) {
      const datos = usuario.datos as IDatos;
      if (!datos?.actividadComercial) {
        throw new Exception(
          'El trámite no se puede iniciar si no se encuentra aprobado el trámite de Declaración Jurada de Actividad Comercial.'
        );
      }
    }

    if (tipoTramite.id === tramites.altaMatriculacionCesantia) {
      if (ultimaMatricula?.estado !== EstadoMatricula.cesante) {
        throw new Exception(
          'No podés realizar el trámite de Alta de Matrícula porque no contás con Matrícula en Estado Cesante.'
        );
      }
    }

    if (tipoTramite.id === tramites.solicitudLicenciaPasividadUsuario) {
      const toDay = dayjs();
      const anio = toDay.year();
      const tramitePendiente =
        await tramiteServices.findTramitePendienteByTipoAndUser({
          tipoId: tramites.solicitudLicenciaPasividadEmpleado,
          usuarioId: usuario.id
        });
      if (tramitePendiente) {
        throw new Exception(
          'Ya existe un trámite de solicitud de Licencia por Pasividad pendiente para este matriculado.'
        );
      }
      if (!toDay.isBetween(`${anio}-01-01`, `${anio}-03-31`)) {
        throw new Exception(
          'El trámite de solicitud de Licencia por Pasividad no se puede iniciar fuera del periodo estipulado.'
        );
      }

      if (matriculaActiva) {
        const fechaMatriculacion = toDay.diff(matriculaActiva.fecha, 'year');

        if (fechaMatriculacion < 1) {
          throw new Exception(
            'El trámite de solicitud de Licencia por Pasividad no se puede iniciar si la matrícula es menor a un año.'
          );
        }
      }
    }

    if (tipoTramite.id === tramites.solicitudLicenciaPasividadEmpleado) {
      const toDay = dayjs();
      const tramitePendiente =
        await tramiteServices.findTramitePendienteByTipoAndUser({
          tipoId: tramites.solicitudLicenciaPasividadUsuario,
          usuarioId: usuario.id
        });
      if (tramitePendiente) {
        throw new Exception(
          'Ya existe un trámite de solicitud de Licencia por Pasividad pendiente para este matriculado.'
        );
      }
      if (matriculaActiva) {
        const fechaMatriculacion = toDay.diff(matriculaActiva.fecha, 'year');

        if (fechaMatriculacion < 1) {
          throw new Exception(
            'El tramite de solicitud de licencia por pasividad no se puede iniciar si la matrícula es menor a un año.'
          );
        }
      }
    }

    if (tipoTramite.id === tramites.seguroCaucion) {
      if (!usuarioSolicitante.empleado) {
        const toDay = dayjs();
        const anio = toDay.year();
        if (!toDay.isBetween(`${anio}-01-01`, `${anio}-02-28`)) {
          throw new Exception(
            'El Seguro de Caución no se puede presentar fuera del periodo estipulado, se lo adhirio automáticamente a la fianza del Colegio.'
          );
        }
      }
      if (!matriculaActiva) {
        throw new Exception(
          'El trámite Seguro de Caución no se puede presentar si no se encuentra matriculado.'
        );
      }
    }

    if (tipoTramite.id === tramites.subsidioPorFallecimiento) {
      console.log('entro aca');

      if (usuarioSolicitante.empleado) {
        const toDay = dayjs();
        console.log('que fecha soy', toDay);

        const tramite = await tramiteServices.findTramitePendienteByTipoAndUser(
          { tipoId, usuarioId: usuario.id }
        );
        if (tramite) {
          throw new Exception(
            'Ya existe un trámite de solicitud de subsidio por fallecimiento pendiente para este matriculado.'
          );
        }
        const tramiteAprobado =
          await tramiteServices.findTramiteAprobadoByTipoAndUser({
            tipoId,
            usuarioId: usuario.id
          });
        if (tramiteAprobado) {
          throw new Exception(
            'Ya existe un trámite de solicitud de subsidio por fallecimiento aprobado para este matriculado.'
          );
        }
        const matriculaParaFalle =
          await matriculaServices.getByUserIdNoBajaNiPendiente(usuario.id);
        if (matriculaParaFalle) {
          const fechaMatriculacion = toDay.diff(
            matriculaParaFalle.fecha,
            'year'
          );
          console.log(fechaMatriculacion);

          if (fechaMatriculacion < 1) {
            throw new Exception(
              'El trámite de solicitud de subsidio por fallecimiento no se puede iniciar si la matrícula es menor a un año.'
            );
          }
        } else {
          throw new Exception(
            'El trámite de solicitud de subsidio por fallecimiento no se puede iniciar si la matrícula esta inactiva.'
          );
        }
      } else {
        throw new Exception(
          'El trámite de solicitud de subsidio por fallecimiento solo lo puede iniciar un empleado.'
        );
      }
    }

    if (tipoTramite.id === tramites.bajaProfesionalPorFallecimiento) {
      if (!matriculaActiva) {
        throw new Exception(
          'La matrícula debe estar activa para realizar la baja profesional por fallecimiento.'
        );
      }
    }

    if (tipoTramite.id === tramites.altaMatriculacionCesantia) {
      if (matriculaActiva) {
        throw new Exception(
          'No puedes realizar este trámite, contás con matrícula activa.'
        );
      }
    }

    const ultimoTramite = await prisma.tramite.findFirst({
      orderBy: {
        numero: 'desc'
      }
    });

    const datosUsuario = await prisma.datosUsuario.create({
      data: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni
      }
    });

    const tramite = await tramiteServices.create({
      tipoId,
      areaId: tipoTramite.areaId,
      numero: ultimoTramite ? ultimoTramite.numero + 1 : 1,
      datosUsuarioId: datosUsuario.id,
      carpetaId: carpetaActiva.id,
      expiracion,
      empleadoId
    });

    await registroHistorial({
      titulo: `Se creó un trámite`,
      descripcion: `El usuario creó e inicio un trámite`,
      usuarioId: usuarioSolicitanteId,
      tramiteId: tramite.id
    });

    if (tramite) {
      if (
        (tramite.tipoId === tramites.denunciaPorCucicba ||
          tramite.tipoId === tramites.denunciaCucicbaFiscalizacion) &&
        tramite.carpetaId
      ) {
        await prisma.tramite.update({
          where: {
            id: tramite.id
          },
          data: {
            tipoSeccion: 'esMatriculado'
          }
        });
      }

      const tramiteDB = await this.getByIdForAction(tramite.id);
      if (tramiteDB) {
        const { secciones } = tramiteDB.tipo;
        const datos = usuario.datos as IDatos;

        const matricula = await prisma.matricula.findFirst({
          where: {
            usuarioId: userId,
            estado: { in: ['activo', 'activo_sin_actividad'] }
          }
        });

        for (const seccion of secciones) {
          const { inputs } = seccion;
          for (const input of inputs) {
            switch (input.nombre) {
              case 'numeroMatricula':
                if (matricula) {
                  await inputValuesServices.upsert(
                    {
                      tramiteId: tramiteDB.id,
                      inputNombre: input.nombre,
                      value: `${matricula.id}`,
                      estado: EstadoInput.pending,
                      comentario: null
                    },
                    false
                  );
                }
                break;

              case 'libroMatricula':
                if (matricula) {
                  await inputValuesServices.upsert(
                    {
                      tramiteId: tramiteDB.id,
                      inputNombre: input.nombre,
                      value: `${matricula.libro}`,
                      estado: EstadoInput.pending,
                      comentario: null
                    },
                    false
                  );
                }
                break;

              case 'tomoMatricula':
                if (matricula) {
                  await inputValuesServices.upsert(
                    {
                      tramiteId: tramiteDB.id,
                      inputNombre: input.nombre,
                      value: `${matricula.tomo}`,
                      estado: EstadoInput.pending,
                      comentario: null
                    },
                    false
                  );
                }
                break;

              case 'folioMatricula':
                if (matricula) {
                  await inputValuesServices.upsert(
                    {
                      tramiteId: tramiteDB.id,
                      inputNombre: input.nombre,
                      value: `${matricula.folio}`,
                      estado: EstadoInput.pending,
                      comentario: null
                    },
                    false
                  );
                }
                break;

              default:
                if (datos[input.nombre]?.value) {
                  const value = datos[input.nombre].value;

                  if (value) {
                    await inputValuesServices.upsert(
                      {
                        tramiteId: tramiteDB.id,
                        inputNombre: input.nombre,
                        value: value,
                        estado: EstadoInput.pending,
                        comentario: null
                      },
                      false
                    );
                  }
                } else if (datos[input.nombre]?.archivos?.length) {
                  const archivos = datos[input.nombre].archivos;
                  if (archivos) {
                    try {
                      for (const archivo of archivos) {
                        const oldPath = archivo.replace(
                          process.env.SERVER_URL,
                          '.'
                        );

                        const destination = `./public/archivos/${userId}/tramites/${tramite.id}/`;

                        const newPath = `./public/archivos/${userId}/tramites/${
                          tramite.id
                        }/${input.nombre}-${dayjs().format(
                          'YYYY-MM-DD_HH.mm.ss.SSS'
                        )}${oldPath.substring(oldPath.lastIndexOf('.'))}`;

                        fs.mkdirSync(destination, { recursive: true });

                        fs.copyFileSync(oldPath, newPath);

                        await inputValuesServices.upsert(
                          {
                            tramiteId: tramiteDB.id,
                            inputNombre: input.nombre,
                            value: null,
                            estado: EstadoInput.pending,
                            comentario: null
                          },
                          false
                        );

                        await documentoServices.createInput({
                          userId,
                          filename: newPath.substring(
                            newPath.lastIndexOf('/') + 1
                          ),
                          inputNombre: input.nombre,
                          tramiteId: tramiteDB.id
                        });
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }
                break;
            }
          }
        }
        const tramiteAction = await this.getByIdForAction(tramiteDB.id);
        await tramiteActionStep(tramiteAction);
      }
    }

    return tramite;
  }

  async getTramitesByUserId({
    id,
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda,
    rawFilter
  }: {
    id: number;
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
    rawFilter?: string;
  }) {
    if (!id) {
      throw new Exception('El id del usuario es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    if (usuarioId !== id) {
      throw new Exception('No tiene permisos para realizar esta acción');
    }

    const filter = rawFilter?.split(':');
    let filterObject;

    if (filter) {
      filterObject = { [filter[0]]: filter[1] };
    }

    const tramitesDB = await tramiteServices.findByUserId({
      usuarioId: id,
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject
    });

    const contarTramites = await tramiteServices.contarTramitesByUserId({
      usuarioId: id,
      busqueda,
      filter: filterObject
    });

    const paginasTotales = Math.ceil(contarTramites / limite);

    const newTramites = tramitesDB.map((tramite) => ({
      id: tramite.id,
      titulo: tramite.tipo.titulo,
      estado: tramite.estado,
      createdAt: tramite.createdAt,
      fechaFin: tramite.fechaFin
    }));
    const respuesta = {
      count: contarTramites,
      tramites: newTramites,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite,
      filter: rawFilter
    };

    return respuesta;
  }

  async getByAdminId({
    id,
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda,
    rawFilter,
    rawRango
  }: {
    id: number;
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
    rawFilter?: string;
    rawRango?: string;
  }) {
    if (!id) {
      throw new Exception('El id del administrador es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const empleado1 = await empleadoServices.findById(id);

    if (!empleado1?.areaId) {
      throw new Exception('Empleado sin área');
    }

    if (!empleado1?.tramites) {
      throw new Exception('Empleado sin tramites');
    }

    const empleado2 = await empleadoServices.findById(usuarioId);

    if (!empleado2?.areaId) {
      throw new Exception('Empleado sin área');
    }
    if (empleado1.areaId !== empleado2.areaId) {
      throw new Exception('Las areas no coinciden');
    }

    let filterObject;
    const filters = rawFilter?.split(',');

    if (filters) {
      for (const filterRaw of filters) {
        const filter = filterRaw.split(':');

        if (filter) {
          let query;
          switch (filter[0]) {
            case 'estado':
              query = { estado: filter[1] };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            case 'tipo':
              query = {
                tipo: {
                  id: Number(filter[1])
                }
              };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            default:
              break;
          }
        }
      }
    }

    const filterRango = rawRango?.split(',');

    if (filterRango) {
      if (dayjs(filterRango[0]).isValid() && dayjs(filterRango[1]).isValid()) {
        const filterRangoObject = {
          createdAt: {
            gte: dayjs(filterRango[0]).startOf('day').toDate(),
            lte: dayjs(filterRango[1]).endOf('day').toDate()
          }
        };
        filterObject = {
          ...(filterObject || {}),
          ...filterRangoObject
        };
      }
    }

    const tramitesDB = await tramiteServices.findByAdminId({
      id,
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject
    });

    const contarTramites = await tramiteServices.contarTramitesByAdminId({
      empleadoId: id,
      busqueda,
      filter: filterObject
    });

    const paginasTotales = Math.ceil(contarTramites / limite);

    const newTramites = tramitesDB.map((tramite) => {
      const pasos = tramite.tipo.pasos as any as IPaso[];

      return {
        id: tramite.id,
        titulo: tramite.tipo.titulo,
        estado: tramite.estado,
        createdAt: tramite.createdAt,
        nombre: tramite.datosUsuario.nombre,
        apellido: tramite.datosUsuario.apellido,
        dni: tramite.datosUsuario.dni,
        email: tramite.carpeta?.usuario.email,
        area: tramite.areas
          .filter((area) => !area.deleted)
          .map((item) => item.area.nombre),
        pasoActual: {
          label: `${
            tramite.estado === 'aprobado'
              ? tramite.tipo.pasos.length
              : tramite.pasoActual + 1
          } de ${tramite.tipo.pasos.length}`,
          title: pasos[tramite.pasoActual].intraTitle
        },
        numero: tramite.numero,
        fechaFin: tramite.fechaFin
      };
    });

    const respuesta = {
      count: contarTramites,
      tramites: newTramites,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite,
      filter: rawFilter,
      rango: rawRango
    };

    return respuesta;
  }

  async byArea({
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda,
    areaId,
    rawFilter,
    rawRango
  }: {
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
    areaId?: number;
    rawFilter?: string;
    rawRango?: string;
  }) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado?.areaId) {
      throw new Exception('El empleado no tiene área asignada');
    }

    if (areaId) {
      await verificarPermiso([permisos.tramites.ver_tramites_todos], usuarioId);
    } else {
      await verificarPermiso([permisos.tramites.ver_tramites_area], usuarioId);
    }

    let filterObject;
    const filters = rawFilter?.split(',');

    if (filters) {
      for (const filterRaw of filters) {
        const filter = filterRaw.split(':');

        if (filter) {
          let query;
          switch (filter[0]) {
            case 'estado':
              query = { estado: filter[1] };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            case 'tipo':
              query = {
                tipo: {
                  id: Number(filter[1])
                }
              };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            default:
              break;
          }
        }
      }
    }

    const filterRango = rawRango?.split(',');

    if (filterRango) {
      if (dayjs(filterRango[0]).isValid() && dayjs(filterRango[1]).isValid()) {
        const filterRangoObject = {
          createdAt: {
            gte: dayjs(filterRango[0]).startOf('day').toDate(),
            lte: dayjs(filterRango[1]).endOf('day').toDate()
          }
        };
        filterObject = {
          ...(filterObject || {}),
          ...filterRangoObject
        };
      }
    }

    const tramitesDB = await tramiteServices.findByAreaId({
      areaId: areaId || empleado.areaId,
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject
    });

    const contarTramites = await tramiteServices.contarTramitesPendientesByArea(
      { areaId: areaId || empleado.areaId, busqueda, filter: filterObject }
    );

    const paginasTotales = Math.ceil(contarTramites / limite);

    const newTramites = tramitesDB.map((tramite) => {
      const pasos = tramite.tipo.pasos as any as IPaso[];

      return {
        id: tramite.id,
        titulo: tramite.tipo.titulo,
        estado: tramite.estado,
        createdAt: tramite.createdAt,
        nombre: tramite.datosUsuario.nombre,
        apellido: tramite.datosUsuario.apellido,
        dni: tramite.datosUsuario.dni,
        area: tramite.areas
          .filter((area) => !area.deleted)
          .map((item) => item.area.nombre),
        pasoActual: {
          label: `${
            tramite.estado === 'aprobado'
              ? tramite.tipo.pasos.length
              : tramite.pasoActual + 1
          } de ${tramite.tipo.pasos.length}`,
          title: pasos[tramite.pasoActual].intraTitle
        },
        responsable: tramite.empleadoAsignado?.usuario
          ? `${tramite.empleadoAsignado?.usuario.nombre} ${tramite.empleadoAsignado?.usuario.apellido}`
          : 'Sin Asignar',
        numero: tramite.numero,
        fechaFin: tramite.fechaFin
      };
    });

    const respuesta = {
      count: contarTramites,
      tramites: newTramites,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite,
      filter: rawFilter,
      rango: rawRango
    };

    return respuesta;
  }

  async getUltimoTramiteByUserByTipo({
    userId,
    tipoTramiteId
  }: {
    userId: number;
    tipoTramiteId: number;
  }) {
    if (!userId) {
      throw new Exception('El id del usuario es requerido');
    }
    if (!tipoTramiteId) {
      throw new Exception('El id del tipo de trámite es requerido');
    }

    const carpetaActiva = await carpetaServices.findCarpetaActiva(userId);

    if (!carpetaActiva) {
      return;
    }
    const tramiteDB = await tramiteServices.findUltimoTramiteByUserByTipo({
      carpetaId: carpetaActiva.id,
      tipoId: tipoTramiteId
    });
    return tramiteDB;
  }

  async getByIdParaEmpleado({
    id,
    usuarioId
  }: {
    id: number;
    usuarioId: number;
  }) {
    if (!id) {
      throw new Exception('El id del trámite es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const usuario = await usersServices.findById(usuarioId);

    if (!usuario?.empleado?.areaId) {
      throw new Exception('Usuario no encontrado');
    }

    const { areaId } = usuario.empleado;

    const tramiteDB = await tramiteServices.findById(id);

    if (!tramiteDB) {
      throw new Exception('Trámite no encontrado');
    }

    if (
      !tramiteDB.areas.some((area) => areaId === area.areaId) &&
      tramiteDB.empleadoId !== usuarioId &&
      !usuario.empleado.roles?.some((permiso) =>
        permiso.PermisoRol.some(
          (permisoRol) =>
            permisoRol.permisoId === permisos.tramites.ver_tramites_todos
        )
      )
    ) {
      if (
        tramiteDB.tipo.tipo === 'denuncia' &&
        usuario.empleado.areaId !== areas.fiscalizacion &&
        usuario.empleado.areaId !== areas.legales
      ) {
        throw new Exception('No tenés permisos');
      }
    }

    tramiteDB.tipo.secciones = tramiteDB.tipo.secciones.filter(
      (s) => s.tipo === tramiteDB.tipoSeccion || !s.tipo
    );

    for (const seccionSinEstadoComentarios of tramiteDB.tipo.secciones) {
      const seccion =
        seccionSinEstadoComentarios as ISeccionConEstadoComentarios;

      let flag: EstadoInput = EstadoInput.pending;
      let approvedCount = 0;
      let noRequeridoCount = 0;

      const seccionObservations = [];

      let newSeccionInputs = [...seccion.inputs];

      for (const input of seccion.inputs) {
        const requerido = input.requerido as [];

        if (input.padre) {
          const padre = newSeccionInputs.find(
            (i) => i.nombre === input.padre
          ) as any;

          if (padre) {
            padre.hijos = padre.hijos ? [...padre.hijos, input] : [input];
          }

          newSeccionInputs = newSeccionInputs.filter(
            (i) => i.nombre !== input.nombre
          );
        }

        if (input.InputValues) {
          const inputStatus = input.InputValues.estado;

          if (input.InputValues.comentario) {
            seccionObservations.push({
              titulo: input.titulo,
              comentario: input.InputValues.comentario
            });
          }

          if (inputStatus === 'rejected') {
            flag = EstadoInput.rejected;
            break;
          }

          if (inputStatus === 'request') {
            flag = 'request';
          }

          if (inputStatus === 'sent' && flag !== 'request') {
            flag = 'sent';
          }

          if (inputStatus === 'approved') {
            approvedCount++;
          }

          input.InputValues = input.InputValues;
        } else {
          if (requerido.some((r) => r === false)) {
            noRequeridoCount++;
          }

          input.InputValues = undefined as any;
        }

        if (
          approvedCount + noRequeridoCount === seccion.inputs.length &&
          approvedCount > 0
        ) {
          flag = EstadoInput.approved;
        }
        seccion.estado = flag;
      }
      seccion.comentarios = seccionObservations;
      seccion.inputs = newSeccionInputs;
    }

    return tramiteDB;
  }

  async getSinAsignarPorArea({
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda,
    rawFilter,
    rawRango
  }: {
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
    rawFilter?: string;
    rawRango?: string;
  }) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado?.areaId) {
      throw new Exception('Usuario no encontrado');
    }

    const areaId = empleado.areaId;

    let filterObject;
    const filters = rawFilter?.split(',');

    if (filters) {
      for (const filterRaw of filters) {
        const filter = filterRaw.split(':');

        if (filter) {
          let query;
          switch (filter[0]) {
            case 'estado':
              query = { estado: filter[1] };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            case 'tipo':
              query = {
                tipo: {
                  id: Number(filter[1])
                }
              };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            default:
              break;
          }
        }
      }
    }

    const filterRango = rawRango?.split(',');

    if (filterRango) {
      if (dayjs(filterRango[0]).isValid() && dayjs(filterRango[1]).isValid()) {
        const filterRangoObject = {
          createdAt: {
            gte: dayjs(filterRango[0]).startOf('day').toDate(),
            lte: dayjs(filterRango[1]).endOf('day').toDate()
          }
        };
        filterObject = {
          ...(filterObject || {}),
          ...filterRangoObject
        };
      }
    }

    const tramitesDB = await tramiteServices.findSinAsignarPorArea({
      areaId,
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject
    });

    const tramites = tramitesDB.map((tramite) => {
      const pasos = tramite.tipo.pasos as any as IPaso[];
      return {
        id: tramite.id,
        nombre: tramite.datosUsuario.nombre,
        apellido: tramite.datosUsuario.apellido,
        dni: tramite.datosUsuario.dni,
        tipo: tramite.tipo.titulo,
        area: tramite.areas.map((item) => item.area.nombre),
        pasoActual: {
          label: `${tramite.pasoActual + 1} de ${tramite.tipo.pasos.length}`,
          title: pasos[tramite.pasoActual].intraTitle
        },
        estado: tramite.estado,
        createdAt: tramite.createdAt,
        numero: tramite.numero
      };
    });

    const contarTramites =
      await tramiteServices.contarTotalTramitesSinAsignarPorArea({
        areaId,
        busqueda,
        filter: filterObject
      });
    const paginasTotales = Math.ceil(contarTramites / limite);

    const respuesta = {
      count: contarTramites,
      tramites,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite,
      filter: rawFilter,
      rango: rawRango
    };

    return respuesta;
  }

  async asignarMatriculador({
    encargadoId,
    tramiteId,
    usuarioId
  }: {
    encargadoId: number;
    tramiteId: number;
    usuarioId: number;
  }) {
    const empleado = await empleadoServices.findById(usuarioId);

    await verificarPermiso([permisos.area.asignar_empleados], usuarioId);

    if (!encargadoId) {
      throw new Exception('El id del encargado es requerido');
    }

    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    const usuario = await usersServices.findById(encargadoId);

    const jefe = await usersServices.findById(usuarioId);

    if (!usuario) {
      throw new Exception('No se encontró el usuario');
    }

    if (!jefe) {
      throw new Exception('No se encontró el jefe');
    }

    const tramiteDB = await tramiteServices.findById(tramiteId);

    if (!tramiteDB) {
      throw new Exception('El trámite no se encontró');
    }

    const asignarMatriculador = await tramiteServices.asignarMatriculador({
      encargadoId,
      tramiteId
    });

    await notificacionValidators.notificarEmpleado({
      jefeId: jefe.id,
      encargadoId,
      tramiteId,

      esJefe: true
    });

    const newTramite = await this.getByIdForAction(tramiteDB.id);

    if (newTramite) {
      if (checkGotoNextStep(newTramite)) {
        await tramiteServices.update(newTramite.id, {
          pasoActual: newTramite.pasoActual + 1
        });

        const newActions = await this.getByIdForAction(newTramite.id);

        await tramiteActionStep(newActions);
      }
    }

    return asignarMatriculador;
  }

  async desasignarMatriculador({
    tramiteId,
    usuarioId
  }: {
    tramiteId: number;
    usuarioId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const usuario = await usersServices.findById(usuarioId);

    if (!usuario) {
      throw new Exception('Usuario no encontrado');
    }

    /* verificarRol([2], usuario as IUsuario); */

    const tramiteDB = await tramiteServices.findById(tramiteId);

    if (!tramiteDB) {
      throw new Exception('El trámite no se encontró');
    }

    if (tramiteDB.empleadoId !== usuarioId) {
      throw new Exception('No tienes permisos');
    }

    const desasignar = await tramiteServices.desasignarMatriculador(tramiteId);
    for (const area of tramiteDB.areas) {
      const jefeDeArea = await empleadoServices.findJefeDeArea(area.areaId);
      if (jefeDeArea) {
        for (const jefe of jefeDeArea) {
          await notificacionValidators.notificarEmpleado({
            jefeId: jefe.usuarioId,
            encargadoId: usuarioId,
            tramiteId,
            esJefe: false
          });
        }
      }
    }

    return desasignar;
  }

  async pasoAnterior({
    tramiteId,
    userId
  }: {
    tramiteId: number;
    userId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    if (!userId) {
      throw new Exception('El userId es requerido');
    }
    const tramite = await tramiteServices.findById(tramiteId);

    if (!tramite) {
      throw new Exception('El  trámite no existe');
    }

    const pasoActualTramite = tramite.tipo.pasos[
      tramite.pasoActual
    ] as any as IPaso;

    // usuarioid -> areaId
    // pasoAcutal -> actions

    // Solo podria ir para atras si alguna action es:
    // canGoPrevStep/{areaId}  ej."canGoPrevStep/1"
    // appointment/{areaId}    ej."appointment/1"

    // si alguno concuerda con el areaId del usuario entra al if
    // si no hay coincidencia tira error

    const empleadoDB = await empleadoServices.findById(userId);

    if (!empleadoDB) {
      throw new Exception('El empleado no existe');
    }

    if (
      pasoActualTramite.actions &&
      (pasoActualTramite.actions.includes(
        `canGoPrevStep/${empleadoDB?.areaId}`
      ) ||
        pasoActualTramite.actions.includes(`appointment/${empleadoDB?.areaId}`))
    ) {
      await tramiteServices.update(tramite.id, {
        pasoActual: tramite.pasoActual - 1
      });

      const tramiteDB = await this.getByIdForAction(tramite.id);

      if (!tramiteDB) {
        throw new Exception('El trámite no existe');
      }
      await tramiteActionStep(tramiteDB);
      if (
        tramiteDB.tipo.pasos[tramiteDB.pasoActual].actions?.some((action) =>
          action.includes('ppointment')
        )
      ) {
        const ultimoTurno = tramiteDB.turno[0];
        await prisma.turno.update({
          where: {
            id: ultimoTurno.id
          },
          data: {
            estado: 'pending'
          }
        });
      }

      const { pasos } = tramiteDB.tipo;

      await registroHistorial({
        titulo: `Se ha retrocedido un paso`,
        descripcion: `Se ha pasado del paso <strong>${
          pasos[tramite.pasoActual].intraTitle
        }</strong> al paso <strong>${
          pasos[tramiteDB.pasoActual].intraTitle
        }</strong>`,
        usuarioId: userId,
        tramiteId: tramite.id
      });

      const newTramite = await tramiteServices.findById(tramiteId);
      if (!newTramite) throw new Exception('El trámite no existe');

      await notify({ tipo: 'area_returnTramite', tramite: newTramite });
    } else {
      throw new Exception('No tenés permisos para ir al paso anterior');
    }

    return tramite;
  }

  async pasoSiguiente({
    tramiteId,
    usuarioId
  }: {
    tramiteId: number;
    usuarioId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El tramiteid es requerido');
    }
    const tramite = await tramiteServices.findById(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no existe');
    }

    const tramiteDB = await this.getByIdForAction(tramite.id);

    await checkPasoSiguiente(tramiteDB, usuarioId);

    await tramiteServices.update(tramite.id, {
      pasoActual: tramite.pasoActual + 1
    });

    const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);
    if (plazo) {
      await plazoServices.finish(plazo.id);
    }

    const newTramite = await this.getByIdForAction(tramiteId);
    await tramiteActionStep(newTramite);

    return tramite;
  }

  async gotoPaso({
    tramiteId,
    paso,
    usuarioId
  }: {
    tramiteId: number;
    paso: number;
    usuarioId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El tramiteid es requerido');
    }

    if (!paso) {
      throw new Exception('El paso es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El usuarioId es requerido');
    }

    const tramite = await tramiteServices.findById(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no existe');
    }

    const pasoActual = tramite.tipo.pasos[tramite.pasoActual] as any as IPaso;

    if (
      pasoActual.actions &&
      !pasoActual.actions.includes(`canApproveTramite/${paso}`)
    ) {
      throw new Exception('No tenés permisos para realizar esta acción');
    }

    await tramiteServices.update(tramite.id, {
      pasoActual: paso
    });

    const tramiteDB = await this.getByIdForAction(tramite.id);

    if (!tramiteDB) {
      throw new Exception('El trámite no existe');
    }

    await tramiteActionStep(tramiteDB);

    return tramite;
  }

  async aprobarPorArea({
    tramiteId,
    usuarioId
  }: {
    tramiteId: number;
    usuarioId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const tramite = await tramiteServices.findById(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no se encontró');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no se encontró');
    }

    const { area } = empleado;
    const paso = tramite.tipo.pasos[tramite.pasoActual] as any as IPaso;

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

    const pasoAreas = paso.actions
      .filter((a) => a.includes('sendTo'))
      .map((a) => a.split('/')[1]);

    const tramiteCheck = await this.getByIdForAction(tramiteId);

    await tramiteCheckHasBeforeApprove(tramiteCheck);

    await prisma.areaToTramite.update({
      where: {
        areaId_tramiteId: {
          areaId: area.id,
          tramiteId: tramite.id
        }
      },
      data: {
        status: 'approved'
      }
    });

    const tramiteDB = await this.getById(tramiteId);
    const tramiteAction = await this.getByIdForAction(tramiteId);

    if (!tramiteDB) {
      throw new Exception('El trámite no se encontró');
    }

    if (checkGotoNextStep(tramiteAction)) {
      await tramiteServices.update(tramiteId, {
        pasoActual: tramiteDB.pasoActual + 1
      });

      const areasPasoNames = getAreasPasoNames(pasoAreas);

      await registroHistorial({
        titulo: areasPasoNames.title,
        descripcion: areasPasoNames.description,
        usuarioId: empleado.usuarioId,
        tramiteId
      });

      const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);
      if (plazo) {
        await plazoServices.finish(plazo.id);
      }

      const newTramite = await this.getByIdForAction(tramiteId);

      await tramiteActionStep(newTramite);

      const tramitecontransaccion = await this.getById(tramiteId);

      return tramitecontransaccion;
    }
    await tramiteGoTo(tramiteAction);

    return tramiteDB;
  }

  async rechazarPorArea({
    tramiteId,
    usuarioId
  }: {
    tramiteId: number;
    usuarioId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const tramite = await tramiteServices.findById(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no se encontró');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no se encontró');
    }

    const { area } = empleado;
    const paso = tramite.tipo.pasos[tramite.pasoActual] as any as IPaso;

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

    await prisma.areaToTramite.update({
      where: {
        areaId_tramiteId: {
          areaId: area.id,
          tramiteId: tramite.id
        }
      },
      data: {
        status: 'rejected'
      }
    });

    const tramiteDB = await this.getById(tramiteId);

    if (!tramiteDB) {
      throw new Exception('El trámite no se encontró');
    }

    const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);
    if (plazo) {
      await plazoServices.finish(plazo.id);
    }

    const tramiteAction = await this.getByIdForAction(tramiteId);
    await rejectedActionStep(tramiteAction);

    return tramiteDB;
  }

  async solicitarModificacionPorArea({
    tramiteId,
    usuarioId
  }: {
    tramiteId: number;
    usuarioId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const tramite = await tramiteServices.findById(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no se encontró');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no se encontró');
    }

    const { area } = empleado;
    const paso = tramite.tipo.pasos[tramite.pasoActual] as any as IPaso;

    if (!paso) {
      throw new Exception('El trámite no se encuentra en un paso');
    }

    if (!area) {
      throw new Exception('El empleado no tiene área asignada');
    }

    if (!paso.actions) {
      throw new Exception('El paso no tiene acciones');
    }

    if (!paso.actions.some((a) => a.includes('canRequestChanges'))) {
      throw new Exception('El paso no tiene acciones de solicitud de cambios');
    }

    const pasoAreas = paso.actions
      .filter((a) => a.includes('sendTo'))
      .map((a) => a.split('/')[1]);

    if (!pasoAreas.includes(`${area.id}`)) {
      throw new Exception('El trámite no se encuentra en el área');
    }

    await prisma.areaToTramite.update({
      where: {
        areaId_tramiteId: {
          areaId: area.id,
          tramiteId: tramite.id
        }
      },
      data: {
        deleted: new Date()
      }
    });

    const tramiteDB = await this.getById(tramiteId);

    if (!tramiteDB) {
      throw new Exception('El trámite no se encontró');
    }

    const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);
    if (plazo) {
      await plazoServices.finish(plazo.id);
    }
    const tramiteAction = await this.getByIdForAction(tramiteId);
    await tramiteOnRequestChangesStep(tramiteAction);

    return tramiteDB;
  }

  async rechazarTramite({
    tramiteId,
    usuarioId
  }: {
    tramiteId: number;
    usuarioId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const tramite = await tramiteServices.findById(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no se encontró');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no se encontró');
    }

    const { area } = empleado;

    if (!area) {
      throw new Exception('El empleado no tiene área asignada');
    }

    if (area.nombre !== 'Legales') {
      throw new Exception('No tienes permisos para rechazar el trámite');
    }

    const tramiteDB = await tramiteServices.rechazarTramite(tramiteId);

    return tramiteDB;
  }

  async cancelarTramite({
    tramiteId,
    usuarioId
  }: {
    tramiteId: number;
    usuarioId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const tramite = await tramiteServices.findById(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no se encontró');
    }

    const usuario = await usersServices.findById(usuarioId);

    if (!usuario) {
      throw new Exception('El usuario no se encontró');
    }

    if (
      usuario.id !== tramite.carpeta?.usuarioId &&
      usuario.empleado?.area?.id !== tramite.tipo.areaId
    ) {
      throw new Exception('No tienes permisos para cancelar el trámite');
    }

    const tramiteDB = await tramiteServices.cancelarTramite(tramiteId);

    await tramiteServices.deleteAllAreas(tramiteId);

    return tramiteDB;
  }

  async buscarFamilia(tramiteId: number) {
    return await getFamily(tramiteId, 'tramite');
  }

  async createSinUsuario({
    usuarioSolicitante,
    tipoId,
    empleadoId
  }: {
    usuarioSolicitante: number;
    tipoId: number;
    empleadoId?: number;
  }) {
    if (!tipoId) {
      throw new Exception('El id del tipo es requerido');
    }

    if (!usuarioSolicitante) {
      throw new Exception('El id del usuario es requerido');
    }

    const expiracion = undefined;

    const ultimoTramite = await prisma.tramite.findFirst({
      orderBy: {
        numero: 'desc'
      }
    });

    const numero = ultimoTramite ? ultimoTramite.numero + 1 : 1;
    const tipoTramite = await tipoTramiteServices.findById(tipoId);

    if (!tipoTramite) {
      throw new Exception('El tipo de trámite no se encontró');
    }

    const datosUsuarioDB = await prisma.datosUsuario.create({
      data: {
        nombre: '',
        apellido: '',
        dni: ''
      }
    });

    const tramite = await tramiteServices.createSinUsuario({
      tipoId,
      areaId: tipoTramite.areaId,
      numero,
      datosUsuarioId: datosUsuarioDB.id,
      expiracion,
      empleadoId
    });

    await registroHistorial({
      titulo: `Se creó un trámite`,
      descripcion: `Mesa de entrada creó e inicio un trámite`,
      usuarioId: usuarioSolicitante,
      tramiteId: tramite.id
    });

    if (tramite) {
      const tramiteDB = await this.getByIdForAction(tramite.id);

      if (tramiteDB) {
        await tramiteActionStep(tramiteDB);
      }
    }

    return tramite;
  }

  async getSinUsuario({
    usuarioid,
    pagina,
    limite,
    orden,
    columna,
    busqueda
  }: {
    usuarioid: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
  }) {
    const tramites = await tramiteServices.findAllSinUsuario({
      pagina,
      limite,
      orden,
      columna,
      busqueda
    });

    return tramites;
  }

  async crearTramiteConInputsExterno({
    tipo,
    arrInputs
  }: {
    tipo: number;
    arrInputs: IInputsValues[];
  }) {
    if (!tipo) {
      throw new Exception('El tipo de trámite es requerido');
    }
    if (!arrInputs) {
      throw new Exception('Los inputs son requeridos');
    }

    const tipoTramite = await tipoTramiteServices.findById(tipo);
    if (!tipoTramite) {
      throw new Exception('El tipo de trámite no se encontró');
    }

    if (tipoTramite.puedeIniciar !== 'externo') {
      throw new Exception(
        'Este tipo de trámite no puede ser iniciado por un usuario externo'
      );
    }

    const expiracion = undefined;
    const ultimoTramite = await prisma.tramite.findFirst({
      orderBy: {
        numero: 'desc'
      }
    });

    const datosUsuario: { [key: string]: string | null } = {};

    for (const input of arrInputs) {
      if (input.inputNombre === 'nombre') {
        datosUsuario['nombre'] = input.value;
      }

      if (input.inputNombre === 'apellido') {
        datosUsuario['apellido'] = input.value;
      }

      if (input.inputNombre === 'dni') {
        datosUsuario['dni'] = input.value;
      }
    }

    const datosUsuarioDB = await prisma.datosUsuario.create({
      data: {
        ...datosUsuario
      }
    });

    const tramite = await tramiteServices.create({
      tipoId: tipo,
      areaId: tipoTramite.areaId,
      numero: ultimoTramite ? ultimoTramite.numero + 1 : 1,
      datosUsuarioId: datosUsuarioDB.id,
      expiracion
    });

    for (const input of arrInputs) {
      await inputValuesServices.upsert(
        { ...input, tramiteId: tramite.id },
        false
      );

      if (input.inputNombre === 'matriculadoDenunciado') {
        const info = tramite.info as any;
        await tramiteServices.update(tramite.id, {
          info: {
            ...info,
            denunciado: Number(input.value)
          }
        });
      }
    }

    const tramiteDB = await this.getByIdForAction(tramite.id);

    if (tramiteDB) {
      await tramiteActionStep(tramiteDB);
    }

    await notificacionMail({
      type: 'linkTramiteExterno',
      tramite: tramiteDB,
      condition: 'mail'
    });

    return tramite;
  }

  async getTramiteExterno(encriptacion: string) {
    if (!encriptacion) {
      throw new Exception('La encriptación es requerida');
    }
    const decrypteTramite = CryptoJS.AES.decrypt(
      encriptacion
        .replaceAll('xMl3Jk', '+')
        .replaceAll('Por21Ld', '/')
        .replaceAll('Ml32', '='),
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8);

    const tramiteDB = await tramiteServices.findByIdExterno(
      Number(decrypteTramite)
    );

    if (!tramiteDB) {
      throw new Exception('trámite no encontrado');
    }

    if (tramiteDB.tipo.puedeIniciar !== 'externo') {
      throw new Exception('No tienes permiso para realizar esta acción');
    }

    tramiteDB.tipo.secciones = tramiteDB.tipo.secciones.filter(
      (s) => s.tipo === tramiteDB.tipoSeccion || !s.tipo || s.tipo === 'interno'
    );

    for (let i = 0; i < tramiteDB.tipo.secciones.length; i++) {
      const seccion = tramiteDB.tipo.secciones[
        i
      ] as ISeccionConEstadoComentarios;

      let flag: EstadoInput = EstadoInput.pending;
      let approvedCount = 0;
      let noRequeridoCount = 0;

      const seccionObservations = [];

      let newSeccionInputs = [...seccion.inputs];

      for (let j = 0; j < seccion.inputs.length; j++) {
        const input = seccion.inputs[j];
        const requerido = input.requerido as [];

        if (input.padre) {
          const padre = buscarPadre({
            inputs: newSeccionInputs,
            padre: input.padre
          }) as any;

          if (padre) {
            padre.hijos = padre.hijos ? [...padre.hijos, input] : [input];
          }

          newSeccionInputs = newSeccionInputs.filter(
            (i) => i.nombre !== input.nombre
          );
        }

        if (input.InputValues) {
          const inputStatus = input.InputValues.estado;

          if (input.InputValues.comentario) {
            seccionObservations.push({
              titulo: input.titulo,
              comentario: input.InputValues.comentario
            });
          }

          if (inputStatus === 'rejected') {
            flag = EstadoInput.rejected;
            break;
          }

          if (inputStatus === 'request') {
            flag = 'request';
          }

          if (inputStatus === 'sent' && flag !== 'request') {
            flag = 'sent';
          }

          if (inputStatus === 'approved') {
            approvedCount++;
          }

          input.InputValues = input.InputValues;
        } else {
          if (requerido.some((r) => r === false)) {
            noRequeridoCount++;
          }

          input.InputValues = undefined as any;
        }

        if (
          approvedCount + noRequeridoCount === seccion.inputs.length &&
          approvedCount > 0
        ) {
          flag = EstadoInput.approved;
        }
        seccion.estado = flag;
      }
      seccion.comentarios = seccionObservations;
      seccion.inputs = newSeccionInputs;
    }

    return tramiteDB;
  }
}

export default new TramitesValidator();
