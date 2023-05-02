import { CedulaNotificacion } from '@prisma/client';
import { Exception } from 'handlebars';
import areas from '../data/areas';
import { cedulaNotificacion } from '../data/cedulaNotificacion';
import permisos from '../data/permisos';
import { IDatos } from '../interfaces/users.interface';
import cedulaServices, {
  CedulaNotificacionService
} from '../services/cedula.services';
import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import tramiteServices from '../services/tramite.services';
import usersServices, { UsersService } from '../services/users.services';
import { getFamily } from '../utils/buscarFamilia';
import cedulaActionStep from '../utils/cedula/cedula ActionStep';
import cedulaCheckGotoNextStep from '../utils/cedula/cedulaCheckGoToNextStep';
import { notificacionMail } from '../utils/enviarEmail';
import tramiteActionStep from '../utils/tramite/tramiteActionStep';
import tramiteCheckGotoNextStep from '../utils/tramite/tramiteCheckGotoNextStep';
import { verificarPermiso } from '../utils/verificarPermisos';
import expedienteValidators from './expediente.validators';
import tramiteValidators from './tramite.validators';
import { registroHistorial } from '../utils/registrarHistorial';
import { createCedulaNotificacionPDF } from '../utils/pdf/createCedulaNotificacionPDF';

export class CedulaNotificacionValidator {
  cedulaServices: CedulaNotificacionService;
  userServices: UsersService;

  constructor() {
    this.cedulaServices = cedulaServices;
    this.userServices = usersServices;
  }

  async getAll({
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda
  }: {
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
  }) {
    await verificarPermiso([permisos.cedulas.ver_cedulas_todas], usuarioId);

    const cedulas = await this.cedulaServices.findAll({
      pagina,
      limite,
      orden,
      columna,
      busqueda
    });

    return { ...cedulas, ...cedulaNotificacion };
  }

  async getById(usuarioId: number, id: number) {
    const cedula = await this.cedulaServices.findById(id);

    if (!cedula) {
      throw new Exception('Cédula no encontrada');
    }

    /* const areaId = cedula.empleadoAsignado?.areaId;

    if (cedula.empleadoId !== usuarioId) {
      if (!cedula.areas.some((area) => areaId === area.areaId)) {
        await verificarPermiso([permisos.cedulas.ver_cedulas_todas], usuarioId);
      } else {
        await verificarPermiso(
          [
            permisos.cedulas.ver_cedulas_area,
            permisos.cedulas.ver_cedulas_todas
          ],
          usuarioId
        );
      }
    } */

    return { ...cedula, ...cedulaNotificacion };
  }

  async byArea({
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda
  }: {
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
  }) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    await verificarPermiso([permisos.cedulas.ver_cedulas_area], usuarioId);

    if (!empleado?.areaId) {
      throw new Exception('Empleado sin área');
    }

    const cedulasDB = await this.cedulaServices.findByAreaId({
      areaId: empleado.areaId,
      limite,
      orden,
      columna,
      pagina,
      busqueda
    });

    const contarCedulas =
      await this.cedulaServices.contarTramitesPendientesByArea(
        empleado.areaId,
        busqueda
      );

    const paginasTotales = Math.ceil(contarCedulas / limite);

    const respuesta = {
      count: contarCedulas,
      cedulas: cedulasDB,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite
    };

    return respuesta;
  }

  async getSinAsignar({
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda
  }: {
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
  }) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const usuario = await this.userServices.findById(usuarioId);

    if (!usuario?.empleado?.areaId) {
      throw new Exception('Usuario no encontrado');
    }

    const areaId = usuario.empleado.areaId;

    if (areaId !== areas.inspeccion) {
      throw new Exception('No tiene permisos para ver esta información');
    }

    const cedulasDB = await this.cedulaServices.findSinAsignar({
      limite,
      orden,
      columna,
      pagina,
      busqueda
    });

    const contarCedulas = await this.cedulaServices.contarTotalCedulas(
      busqueda
    );
    const paginasTotales = Math.ceil(contarCedulas / limite);

    const newCedulas: {
      id: number;
      nombre: string;
      apellido: string;
      dni: string;
      email: string;
      telefono: string | undefined;
      domicilio: string | undefined;
      createdAt: Date;
    }[] = cedulasDB.map((cedula) => {
      const datos = cedula.usuario.datos as IDatos;

      return {
        id: cedula.id,
        nombre: cedula.usuario.nombre,
        apellido: cedula.usuario.apellido,
        dni: cedula.usuario.dni,
        email: cedula.usuario.email,
        telefono: datos.telefonoParticular.value,
        domicilio: datos.domicilioReal.value,
        createdAt: cedula.createdAt
      };
    });

    const respuesta = {
      count: contarCedulas,
      cedulas: newCedulas,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite
    };

    return respuesta;
  }

  async create({
    titulo,
    motivo,
    usuarioId,
    tipo,
    empleadoId,
    fiscalizacionId,
    procesoLegalesId,
    tramiteId,
    expedienteId,
    fechaRecepcion,
    pasoCreacion
  }: {
    titulo: string;
    motivo: string;
    usuarioId: number;
    tipo: string;
    empleadoId?: number;
    fiscalizacionId?: number;
    procesoLegalesId?: number;
    tramiteId?: number;
    expedienteId?: number;
    fechaRecepcion?: Date;
    pasoCreacion?: number;
  }) {
    if (!titulo) {
      throw new Exception('El titulo de la cédula es requerido');
    }
    if (!motivo) {
      throw new Exception('La descripcion de la cédula es requerida');
    }
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const ultimaCedula = await this.cedulaServices.ultimaCedula();
    const usuario = await usersServices.findById(usuarioId);
    if (!usuario) {
      throw new Exception('Usuario no encontrado');
    }
    const cedula = await this.cedulaServices.create({
      numero: (ultimaCedula?.numero || 0) + 1,
      titulo,
      motivo,
      usuarioId,
      estado: usuario.recepcionCedula,
      empleadoId,
      fiscalizacionId,
      procesoLegalesId,
      tramiteId,
      expedienteId,
      fechaRecepcion,
      pasoCreacion
    });

    if (tipo === 'mail' && tramiteId) {
      const tramiteDB = await tramiteValidators.getByIdForAction(tramiteId);
      await notificacionMail({
        type: 'cedula',
        tramite: tramiteDB,
        condition: tipo
      });
    } else if (tipo === 'mail' && procesoLegalesId) {
      const expedienteDB = await expedienteValidators.getByIdForActions(
        procesoLegalesId
      );
      await notificacionMail({
        type: 'cedula',
        tramite: expedienteDB,
        condition: tipo
      });
    }

    if (tramiteId) {
      const tramite = await tramiteValidators.getByIdForAction(tramiteId);

      if (!tramite) {
        throw new Exception('El trámite no existe');
      }

      if (tramiteCheckGotoNextStep(tramite)) {
        await tramiteServices.update(tramiteId, {
          pasoActual: tramite.pasoActual + 1
        });

        const newTramite = await tramiteValidators.getByIdForAction(tramiteId);

        await tramiteActionStep(newTramite);
      }
      
      await createCedulaNotificacionPDF({
        tramiteId,
        cedulaId: cedula.id
      })
    }

    if(expedienteId) {
      await createCedulaNotificacionPDF({
        expedienteId,
        cedulaId: cedula.id
      })
    }

    if(procesoLegalesId) {
      
      await createCedulaNotificacionPDF({
        procesoLegalId: procesoLegalesId,
        cedulaId: cedula.id
      })
      // await registroHistorial({
      //   titulo: 'Se envió la cédula de notificación',
      //   descripcion: `Se ha enviado la cédula de notificación ${cedula.numero} para el expediente ${cedula.expedienteId}`,
      //   usuarioId,
      //   expedienteId: expedienteId,
      // })

      // await registroHistorial({
      //   titulo: 'Se envió la cédula de notificación',
      //   descripcion: `Se ha enviado la cédula de notificación ${cedula.numero} para el expediente ${cedula.expedienteId}`,
      //   usuarioId,
      //   expedienteId: expedienteId,
      //   procesoLegalId: procesoLegalesId,
      // })
    }

    return cedula;
  }

  async update(
    usuarioId: number,
    cedulaId: number,
    data: Partial<CedulaNotificacion>
  ) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    if (!cedulaId) {
      throw new Exception('El id de la cédula es requerido');
    }

    const cedula = await this.cedulaServices.update(cedulaId, data);

    return cedula;
  }

  async pasoSiguiente(cedulaId: number) {
    if (!cedulaId) {
      throw new Exception('El id de la cédula es requerido');
    }

    const cedula = await this.cedulaServices.findById(cedulaId);

    if (!cedula) {
      throw new Exception('Cédula no encontrada');
    }

    const newCedula = await this.cedulaServices.update(cedulaId, {
      pasoActual: cedula.pasoActual + 1
    });

    const cedulaDB = await cedulaServices.findById(cedula.id);

    cedulaActionStep(cedulaDB);

    return newCedula;
  }

  async getByEmpleadoId({
    empleadoId,
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda
  }: {
    empleadoId: number;
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
  }) {
    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }
    const empleado1 = await empleadoServices.findById(empleadoId);

    if (!empleado1?.areaId) {
      throw new Exception('Empleado sin área');
    }

    if (!empleado1?.cedulas) {
      throw new Exception('Empleado sin trámites');
    }

    const empleado2 = await empleadoServices.findById(usuarioId);

    if (!empleado2?.areaId) {
      throw new Exception('Empleado sin área');
    }
    if (empleado1.areaId !== empleado2.areaId) {
      throw new Exception('Las áreas no coinciden');
    }

    const cedulas = await this.cedulaServices.findByEmpleadoId({
      empleadoId,
      limite,
      orden,
      columna,
      pagina,
      busqueda
    });

    const contarCedulas = await this.cedulaServices.contarTotalCedulas(
      busqueda
    );
    const paginasTotales = Math.ceil(contarCedulas / limite);

    const respuesta = {
      count: contarCedulas,
      cedulas,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite
    };

    return respuesta;
  }

  async asignarEmpleado({
    cedulaId,
    empleadoId,
    usuarioId
  }: {
    cedulaId: number;
    empleadoId: number;
    usuarioId: number;
  }) {
    if (!cedulaId) {
      throw new Exception('El id de la cédula es requerido');
    }

    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    await verificarPermiso([permisos.area.asignar_empleados], usuarioId);

    const empleado = await this.userServices.findById(empleadoId);

    const jefe = await this.userServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('No se encontró el usuario');
    }

    if (!jefe) {
      throw new Exception('No se encontró el jefe');
    }

    const cedula = await this.cedulaServices.findById(cedulaId);

    if (!cedula) {
      throw new Exception('No se encontró la cédula');
    }

    if (cedula.empleadoId) {
      throw new Exception('La cédula ya tiene un empleado asignado');
    }

    await this.cedulaServices.update(cedulaId, {
      empleadoId
    });

    const newCedula = await cedulaServices.findById(cedulaId);

    // if (newCedula) {
    //   if (cedulaCheckGotoNextStep(newCedula)) {
    //     await this.cedulaServices.update(cedulaId, {
    //       pasoActual: cedula.pasoActual + 1
    //     });

    //     const newActions = await cedulaServices.findById(cedulaId);

    //     cedulaActionStep(newActions);
    //   }
    // }

    return newCedula;
  }

  async desasignarEmpleado(cedulaId: number, usuarioId: number) {
    if (!cedulaId) {
      throw new Exception('El id de la cédula es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const cedula = await this.cedulaServices.findById(cedulaId);

    if (!cedula) {
      throw new Exception('No se encontró la cédula');
    }

    if (!cedula.empleadoId) {
      throw new Exception('La cédula no tiene un empleado asignado');
    }

    if (cedula.empleadoId !== usuarioId) {
      throw new Exception('No tiene permisos para desasignar el empleado');
    }

    await this.cedulaServices.update(cedulaId, {
      empleadoId: null
    });

    return cedula;
  }

  async buscarFamilia(cedulaId: number) {
    return await getFamily(cedulaId, 'cedula');
  }

  async documento({
    cedulaId,
    usuarioId,
    filename,
    cedulaUserId,
    documentoId
  }: {
    cedulaId: number;
    usuarioId: number;
    filename: string;
    cedulaUserId: number;
    documentoId?: number;
  }) {
    if (!cedulaId) {
      throw new Exception('El id del informe es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const documentoGuardado = await documentoServices.upsertCedula({
      cedulaId,
      filename,
      cedulaUserId,
      documentoId
    });

    return documentoGuardado;
  }
}

export default new CedulaNotificacionValidator();
