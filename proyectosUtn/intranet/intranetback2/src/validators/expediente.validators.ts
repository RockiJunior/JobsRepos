import { Exception } from 'handlebars';
import areas, { areasNames } from '../data/areas';
import permisos from '../data/permisos';
import caratulaServices from '../services/caratula.services';
import empleadoServices from '../services/empleado.services';
import expedienteServices from '../services/expediente.services';
import matriculaServices from '../services/matricula.services';
import { getFamily } from '../utils/buscarFamilia';
import {
  addNumeroFiscalizacion,
  addNumeroLegales,
  getNumeroExpediente
} from '../utils/getNumeroExpediente';
import { notifyExpediente } from '../utils/notify';
import { registroHistorial } from '../utils/registrarHistorial';
import { verificarPermiso } from '../utils/verificarPermisos';
import notificacionValidators from './notificacion.validators';
import { EstadoFiscalizacion, EstadoProcesoLegales } from '@prisma/client';
import tramiteServices from '../services/tramite.services';
import tramites from '../data/tramites';
import dayjs from 'dayjs';

const buscarPadre = (inputs: any, padre: string) => {
  const result = inputs.find((i: any) => i.nombre === padre);

  if (result) {
    return result;
  }

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    if (input.hijos) {
      const result: any = buscarPadre(input.hijos, padre);

      if (result) {
        return result;
      }
    }
  }
};

class ExpedienteValidator {
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

    await verificarPermiso(
      [permisos.expedientes.ver_expedientes_todos],
      usuarioId
    );

    let filterObject;
    const filters = rawFilter?.split(',');

    if (filters) {
      for (const filterRaw of filters) {
        const filter = filterRaw?.split(':');

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

            case 'tipo_fallo':
              query = {
                procesosLegales: {
                  some: {
                    fallos: {
                      some: {
                        tipo: filter[1]
                      }
                    }
                  }
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
              filterObject = {
                ...(filterObject || {}),
                [filter[0]]: filter[1]
              };
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

    const expedientesDB = await expedienteServices.findAll({
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject
    });

    const contarExpediente = await expedienteServices.contarAll({
      busqueda,
      filter: filterObject
    });

    const paginasTotales = Math.ceil(contarExpediente / limite);

    const respuesta = {
      count: contarExpediente,
      expedientes: expedientesDB.map((e) => ({
        ...e,
        numero: getNumeroExpediente({
          numeroLegales: e.numeroLegales,
          numeroFiscalizacion: e.numeroFiscalizacion
        }),
        nombre: e.denuncia.nombreDenunciado || '-',
        apellido: e.denuncia.apellidoDenunciado || '-',
        dni: e.denuncia.dniDenunciado || '-',
        responsable:
          e.empleadosAsignados.map(
            (n) => `${n.usuario.nombre} ${n.usuario.apellido}`
          ) || '-',
        createdAt: e.createdAt,
        fechaFin: e.fechaFin,
        area: e.areas
          .filter((area) => !area.deleted)
          .map((item) => item.area.nombre)
      })),
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

  async create({
    areaId,
    carpetaId,
    tramitePadreId,
    expedientePadreId,
    info,
    denunciaId,
    isDenuncia
  }: {
    areaId: number;
    carpetaId?: number;
    tramitePadreId?: number;
    expedientePadreId?: number;
    info?: { [key: string]: any };
    denunciaId: number;
    isDenuncia: boolean;
  }) {
    if (!areaId) {
      throw new Exception('El id del área es requerido');
    }

    const ultimoExpedienteLegales =
      await expedienteServices.ultimoExpedienteLegales();
    const ultimoExpedienteFiscalizacion =
      await expedienteServices.ultimoExpedienteFiscalizacion();

    const expediente = await expedienteServices.create({
      numeroLegales:
        areaId === areas.legales
          ? ultimoExpedienteLegales?.numeroLegales
            ? addNumeroLegales(ultimoExpedienteLegales.numeroLegales)
            : 'L-1'
          : undefined,
      numeroFiscalizacion:
        areaId === areas.fiscalizacion
          ? ultimoExpedienteFiscalizacion?.numeroFiscalizacion
            ? addNumeroFiscalizacion(
                ultimoExpedienteFiscalizacion.numeroFiscalizacion
              )
            : 'F-1'
          : undefined,

      areaId,
      carpetaId,
      tramitePadreId,
      expedientePadreId,
      info,
      denunciaId: denunciaId,
      isDenuncia
    });

    await registroHistorial({
      titulo: `Se creó el expediente Nro ${
        areasNames[areaId] === 'Legales'
          ? `${expediente.numeroLegales}`
          : `${expediente.numeroFiscalizacion}`
      }`,
      descripcion: `Se creó un expediente en el área de <strong>${
        areasNames[areaId]
      }</strong> con el número ${
        areasNames[areaId] === 'Legales'
          ? `${expediente.numeroLegales}`
          : `${expediente.numeroFiscalizacion}`
      }`,
      expedienteId: expediente.id
    });

    const expteDB = await expedienteServices.findById(expediente.id);
    let titulo: string = '';
    if (expteDB.tramitePadreId) {
      const tramiteDB = await tramiteServices.findById(expteDB.tramitePadreId);
      if (expteDB.denuncia) {
        if (tramiteDB.tipo.tipo === 'denuncia') {
          if (
            tramiteDB.tipo.id === tramites.denunciaPorCucicba ||
            tramiteDB.tipo.id === tramites.denunciaCucicbaFiscalizacion
          ) {
            titulo = `CUCICBA C/ ${expteDB.denuncia.nombreDenunciado} ${expteDB.denuncia.apellidoDenunciado} S/ PRESUNTA INFRACCIÓN`;
          } else if (tramiteDB.carpeta?.usuarioId) {
            titulo = `${expteDB.denuncia.nombreDenunciante} ${expteDB.denuncia.apellidoDenunciante} C/ ${expteDB.denuncia.nombreDenunciado} ${expteDB.denuncia.apellidoDenunciado} S/ DENUNCIA`;
          } else {
            titulo = `CUCICBA C/ ${expteDB.denuncia.nombreDenunciado} ${expteDB.denuncia.apellidoDenunciado} S/ DENUNCIA`;
          }
        }

        await caratulaServices.create({
          titulo,
          denunciante: `${expteDB.denuncia.nombreDenunciante} ${expteDB.denuncia.apellidoDenunciante}`,
          denunciado: `${expteDB.denuncia.nombreDenunciado} ${expteDB.denuncia.apellidoDenunciado}`,
          expedienteId: expediente.id
        });
      }
    }

    return expediente;
  }

  async getById({ usuarioId, id }: { usuarioId: number; id: number }) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    if (!id) {
      throw new Exception('El id del Expediente es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);
    const areaId = empleado?.areaId;

    const expedienteDB = await expedienteServices.findById(id);

    if (!expedienteDB) {
      throw new Exception('Expediente no encontrado');
    }

    if (
      !expedienteDB.empleadosAsignados.some((i) => i.usuarioId !== usuarioId)
    ) {
      if (!expedienteDB.areas.some((area) => areaId === area.areaId)) {
        await verificarPermiso(
          [permisos.expedientes.ver_expedientes_todos],
          usuarioId
        );
      } else {
        await verificarPermiso(
          [
            [
              permisos.expedientes.ver_expedientes_area,
              permisos.expedientes.ver_expedientes_todos
            ]
          ],

          usuarioId
        );
      }
    }

    for (const fiscalizacion of expedienteDB.fiscalizaciones) {
      for (const seccionSinEsTadoComentarios of fiscalizacion.tipo.secciones) {
        const seccion = seccionSinEsTadoComentarios;

        let newSeccionInputs = [...seccion.inputs];

        for (const input of seccion.inputs) {
          if (input.padre) {
            const padre = buscarPadre(newSeccionInputs, input.padre) as any;

            if (padre) {
              padre.hijos = padre.hijos ? [...padre.hijos, input] : [input];
            }

            newSeccionInputs = newSeccionInputs.filter(
              (i) => i.nombre !== input.nombre
            );
          }
        }

        seccion.inputs = newSeccionInputs;
      }
    }

    return expedienteDB;
  }

  async getByIdForActions(id: number) {
    if (!id) {
      throw new Exception('El id del Expediente es requerido');
    }

    const expedienteDB = await expedienteServices.findById(id);

    if (!expedienteDB) {
      throw new Exception('Expediente no encontrado');
    }

    return expedienteDB;
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
      throw new Exception('Empleado sin trámites');
    }

    const empleado2 = await empleadoServices.findById(usuarioId);

    if (!empleado2?.areaId) {
      throw new Exception('Empleado sin área');
    }
    if (empleado1.areaId !== empleado2.areaId) {
      throw new Exception('Las áreas no coinciden');
    }
    let filterObject;
    const filters = rawFilter?.split(',');

    if (filters) {
      for (const filterRaw of filters) {
        const filter = filterRaw?.split(':');

        if (filter) {
          switch (filter[0]) {
            case 'tipo_fallo':
              const query = {
                procesosLegales: {
                  some: {
                    fallos: {
                      some: {
                        tipo: filter[1]
                      }
                    }
                  }
                }
              };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            default:
              filterObject = {
                ...(filterObject || {}),
                [filter[0]]: filter[1]
              };
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

    const expedientesDB = await expedienteServices.findByAdminId({
      empleadoId: id,
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject
    });

    const count = await expedienteServices.contarExpedientesByAdminId({
      empleadoId: id,
      busqueda,
      filter: filterObject
    });
    const paginasTotales = Math.ceil(count / limite);

    const respuesta = {
      count,
      expedientes: expedientesDB.map((e) => ({
        ...e,
        numero: getNumeroExpediente({
          numeroLegales: e.numeroLegales,
          numeroFiscalizacion: e.numeroFiscalizacion
        }),
        nombre: e.denuncia.nombreDenunciado || '-',
        apellido: e.denuncia.apellidoDenunciado || '-',
        dni: e.denuncia.dniDenunciado || '-',
        createdAt: e.createdAt,
        fechaFin: e.fechaFin
      })),
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

    await verificarPermiso(
      [permisos.expedientes.ver_expedientes_area],
      Number(empleado?.usuarioId)
    );

    if (!empleado?.areaId) {
      throw new Exception('Empleado sin área');
    }

    let filterObject;
    const filters = rawFilter?.split(',');

    if (filters) {
      for (const filterRaw of filters) {
        const filter = filterRaw?.split(':');

        if (filter) {
          switch (filter[0]) {
            case 'tipo_fallo':
              const query = {
                procesosLegales: {
                  some: {
                    fallos: {
                      some: {
                        tipo: filter[1]
                      }
                    }
                  }
                }
              };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            default:
              filterObject = {
                ...(filterObject || {}),
                [filter[0]]: filter[1]
              };
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

    const expedientesDB = await expedienteServices.findByAreaId({
      areaId: empleado.areaId,
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject,
      isFiscalizacion: empleado.areaId === areas.fiscalizacion
    });

    const contarExpediente = await expedienteServices.contarExpedienteByArea({
      areaId: empleado.areaId,
      busqueda,
      filter: filterObject
    });

    const paginasTotales = Math.ceil(contarExpediente / limite);

    const respuesta = {
      count: contarExpediente,
      expedientes: expedientesDB.map((e) => ({
        ...e,
        numero: getNumeroExpediente({
          numeroLegales: e.numeroLegales,
          numeroFiscalizacion: e.numeroFiscalizacion
        }),
        nombre: e.denuncia.nombreDenunciado || '-',
        apellido: e.denuncia.apellidoDenunciado || '-',
        dni: e.denuncia.dniDenunciado || '-',
        responsable:
          e.empleadosAsignados.map(
            (n) => `${n.usuario.nombre} ${n.usuario.apellido}`
          ) || '-',
        createdAt: e.createdAt,
        fechaFin: e.fechaFin
      })),
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

  async buscarFamilia(expedienteId: number) {
    return await getFamily(expedienteId, 'expediente');
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
    rawFilter: string;
    rawRango: string;
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
        const filter = filterRaw?.split(':');

        if (filter) {
          switch (filter[0]) {
            case 'tipo_fallo':
              const query = {
                procesosLegales: {
                  some: {
                    fallos: {
                      some: {
                        tipo: filter[1]
                      }
                    }
                  }
                }
              };

              filterObject = {
                ...(filterObject || {}),
                ...query
              };
              break;

            default:
              filterObject = {
                ...(filterObject || {}),
                [filter[0]]: filter[1]
              };
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

    const expedientes = await expedienteServices.findSinAsignarPorArea({
      areaId,
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject
    });

    const count = await expedienteServices.contarTotalSinAsignar({
      areaId,
      busqueda,
      filter: filterObject
    });

    const paginasTotales = Math.ceil(count / limite);

    const respuesta = {
      count,
      expedientes: expedientes.map((e) => ({
        ...e,
        numero: getNumeroExpediente({
          numeroLegales: e.numeroLegales,
          numeroFiscalizacion: e.numeroFiscalizacion
        }),
        nombre: e.denuncia.nombreDenunciado || '-',
        apellido: e.denuncia.apellidoDenunciado || '-',
        dni: e.denuncia.dniDenunciado || '-'
      })),
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

  async asignarEmpleado({
    encargadoId,
    expedienteId,
    usuarioId
  }: {
    encargadoId: number;
    expedienteId: number;
    usuarioId: number;
  }) {
    if (!encargadoId) {
      throw new Exception('El id del encargado es requerido');
    }

    if (!expedienteId) {
      throw new Exception('El id del Expediente es requerido');
    }

    const empleado = await empleadoServices.findById(encargadoId);

    const jefe = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('No se encontró el usuario');
    }

    if (!jefe) {
      throw new Exception('No se encontró el jefe');
    }

    await verificarPermiso([permisos.area.asignar_empleados], usuarioId);

    const expedienteDB = await expedienteServices.findById(expedienteId);

    if (!expedienteDB) {
      throw new Exception('El expediente no se encontró');
    }

    const asignarEmpleado = await expedienteServices.asignarEmpleado({
      empleadoId: encargadoId,
      expedienteId
    });

    await notificacionValidators.notificarEmpleadoExpediente({
      jefeId: jefe.usuarioId,
      encargadoId,
      expedienteId,
      esJefe: true
    });

    return asignarEmpleado;
  }

  async desasignarEmpleado({
    expedienteId,
    usuarioId
  }: {
    expedienteId: number;
    usuarioId: number;
  }) {
    if (!expedienteId) {
      throw new Exception('El id del expediente es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const usuario = await empleadoServices.findById(usuarioId);

    if (!usuario) {
      throw new Exception('Usuario no encontrado');
    }

    const expedienteDB = await expedienteServices.findById(expedienteId);

    if (!expedienteDB) {
      throw new Exception('El expediente no se encontró');
    }

    if (
      !expedienteDB.empleadosAsignados.some((e) => e.usuarioId === usuarioId)
    ) {
      throw new Exception('No tienes permisos');
    }

    const desasignar = await expedienteServices.desasignarEmpleado({
      empleadoId: usuarioId,
      expedienteId
    });

    for (const area of expedienteDB.areas) {
      const jefeDeArea = await empleadoServices.findJefeDeArea(area.areaId);
      if (jefeDeArea) {
        for (const jefe of jefeDeArea) {
          await notificacionValidators.notificarEmpleadoExpediente({
            jefeId: jefe.usuarioId,
            encargadoId: usuarioId,
            expedienteId,
            esJefe: false
          });
        }
      }
    }

    return desasignar;
  }

  async cambiarArea({
    usuarioId,
    expedienteId,
    areaId
  }: {
    usuarioId: number;
    expedienteId: number;
    areaId: number;
  }) {
    if (!expedienteId) {
      throw new Exception('El id del expediente es requerido');
    }
    if (!areaId) {
      throw new Exception('El id del area es requerido');
    }
    const expediente = await expedienteServices.findById(expedienteId);
    if (!expediente) {
      throw new Exception('El expediente no se encontró');
    }

    let descripcion = '';

    if (
      (expediente.carpeta?.usuarioId && areaId === areas.legales) ||
      areaId !== areas.legales
    ) {
      const cambioArea = await expedienteServices.cambiarArea({
        expedienteId,
        areaId
      });
      if (areaId === areas.legales && !expediente.numeroLegales) {
        const ultimoExpedienteLegales =
          await expedienteServices.ultimoExpedienteLegales();
        const expedienteDB = await expedienteServices.update({
          id: expedienteId,
          data: {
            numeroLegales: ultimoExpedienteLegales?.numeroLegales
              ? addNumeroLegales(ultimoExpedienteLegales.numeroLegales)
              : 'L-1'
          }
        });
        descripcion = `Se envió el expediente al área de Legales y se le asignó el número ${expedienteDB.numeroLegales}`;
      } else if (
        areaId === areas.fiscalizacion &&
        !expediente.numeroFiscalizacion
      ) {
        const ultimoExpedienteFiscalizacion =
          await expedienteServices.ultimoExpedienteFiscalizacion();
        const expedienteDB = await expedienteServices.update({
          id: expedienteId,
          data: {
            numeroFiscalizacion:
              ultimoExpedienteFiscalizacion?.numeroFiscalizacion
                ? addNumeroFiscalizacion(
                    ultimoExpedienteFiscalizacion.numeroFiscalizacion
                  )
                : 'F-1'
          }
        });
        descripcion = `Se envió el expediente al área de Fiscalización y se le asignó el número F-${expedienteDB.numeroFiscalizacion}`;
      }

      const expedienteDB = await this.getByIdForActions(expedienteId);

      await notifyExpediente({
        tipo: 'cambiarArea_area',
        expediente: expedienteDB
      });

      await registroHistorial({
        titulo: `Se envió el expediente al área de <strong>${areasNames[areaId]}</strong>`,
        descripcion,
        usuarioId,
        expedienteId
      });

      return cambioArea;
    } else {
      throw new Exception(
        'No se puede enviar al Área de Legales, porque el usuario no es matriculado'
      );
    }
  }

  async finalizarExpediente({
    expedienteId,
    usuarioId
  }: {
    expedienteId: number;
    usuarioId: number;
  }) {
    if (!expedienteId) {
      throw new Exception('El id del expediente es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const expediente = await expedienteServices.findById(expedienteId);

    if (!expediente) {
      throw new Exception('El expediente no se encontró');
    }

    if (
      expediente.fiscalizaciones.some(
        (f) => f.estado === EstadoFiscalizacion.pendiente
      ) ||
      expediente.procesosLegales.some(
        (p) => p.estado !== EstadoProcesoLegales.finalizado
      )
    ) {
      throw new Exception(
        'No se puede finalizar el expediente, porque tiene fiscalizaciones o procesos legales pendientes'
      );
    }
    return expedienteServices.finalizarExpediente(expedienteId);
  }
}

export default new ExpedienteValidator();
