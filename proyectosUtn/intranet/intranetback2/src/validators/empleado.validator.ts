import CryptoJS from 'crypto-js';
import permisos from '../data/permisos';
import cedulaServices from '../services/cedula.services';
import empleadoService from '../services/empleado.services';
import expedienteServices from '../services/expediente.services';
import tramiteServices from '../services/tramite.services';
import usersServices from '../services/users.services';
import Exception from '../utils/Exception';
import { verificarPermiso } from '../utils/verificarPermisos';

declare const process: {
  env: {
    CRYPTO_SECRET: string;
  };
};

class EmpleadoValidator {
  async getByUserArea(id: number) {
    if (!id) {
      throw new Exception('El id de usuario es requerido');
    }
    const empleadosDB = await empleadoService.findByUserArea(id);

    if (!empleadosDB) {
      throw new Exception('Empleado no encontrado');
    }

    const arrEmpleados = empleadosDB[0].area?.empleados || 0;

    if (!arrEmpleados) {
      throw new Exception('Empleado no encontrado');
    }

    const empleados = [];

    for (let i = 0; i < arrEmpleados.length; i++) {
      const { id, nombre, apellido } = arrEmpleados[i].usuario;
      const { area, roles } = arrEmpleados[i];
      const usuario = {
        usuario: {
          id,
          nombre,
          apellido
        },
        area,
        roles,
        numeroTramites: await tramiteServices.contarTramitesByAdminId({
          empleadoId: id,
          filter: { estado: 'pendiente' }
        }),
        numeroCedulas: await cedulaServices.contarCedulasPorEmpleado(id),
        numeroExpedientes:
          await expedienteServices.contarExpedientesPorEmpleado(id)
      };

      empleados.push(usuario);
    }

    return empleados;
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
    if (!usuarioId) {
      throw new Exception('El id de usuario es requerido');
    }

    await verificarPermiso([permisos.empleados.ver_empleados], usuarioId);

    const empleadosDB = await empleadoService.getAll({
      limite,
      orden,
      columna,
      pagina,
      busqueda
    });

    const contarEmpleados = await empleadoService.contarEmpleados(busqueda);

    const paginasTotales = Math.ceil(contarEmpleados / limite);

    if (!empleadosDB) {
      throw new Exception('No hay empleados');
    }

    const arrEmpleados = empleadosDB.map((empleado) => ({
      ...empleado,
      rolesNombres: empleado.roles.map((rol) => rol.nombre),
      areaNombre: empleado.area?.nombre
    }));

    const respuesta = {
      count: contarEmpleados,
      empleados: arrEmpleados,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite
    };

    return respuesta;
  }

  async crearEmpleado({
    usuarioId,
    nombre,
    apellido,
    dni,
    email,
    contrasenia,
    roles,
    areaId
  }: {
    usuarioId: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    contrasenia: string;
    roles: number[];
    areaId: number;
  }) {
    if (!nombre) {
      throw new Exception('El nombre es requerido');
    }
    if (!apellido) {
      throw new Exception('El apellido es requerido');
    }
    if (!dni) {
      throw new Exception('El dni es requerido');
    }
    if (!email) {
      throw new Exception('El email es requerido');
    }
    if (!contrasenia) {
      throw new Exception('La contraseña es requerida');
    }

    if (!roles) {
      throw new Exception('El rol es requerido');
    }

    if (!areaId) {
      throw new Exception('El área es requerida');
    }

    await verificarPermiso([permisos.empleados.crear_empleados], usuarioId);

    const emailOrDniAlreadyExists = await usersServices.emailOrDniAlreadyExists(
      { email, dni }
    );

    if (emailOrDniAlreadyExists) {
      throw new Exception('Ya hay un usuario con ese email o dni');
    }

    const encryptPassword = CryptoJS.AES.encrypt(
      contrasenia,
      process.env.CRYPTO_SECRET
    ).toString();

    const usuario = await usersServices.create({
      nombre,
      apellido,
      dni,
      email,
      contrasenia: encryptPassword,
      verificado: true
    });

    const empleado = await empleadoService.crearEmpleado({
      usuarioId: usuario.id,
      roles,
      areaId
    });

    return empleado;
  }

  async updateEmpleado({
    empleadoId,
    nombre,
    apellido,
    dni,
    email,
    roles,
    areaId,
    usuarioId
  }: {
    empleadoId: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    roles: number[];
    areaId: number;
    usuarioId: number;
  }) {
    if (!empleadoId) {
      throw new Exception('El id es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El usuario es requerido');
    }

    const empleadoDB = await empleadoService.findById(empleadoId);

    if (!empleadoDB) {
      throw new Exception('Empleado no encontrado');
    }

    await verificarPermiso([permisos.empleados.modificar_empleados], usuarioId);

    await usersServices.update(empleadoId, {
      nombre,
      apellido,
      dni,
      email
    });

    const empleado = await empleadoService.updateEmpleado({
      id: empleadoId,
      roles,
      areaId
    });

    return empleado;
  }

  async deleteEmpleado({
    empleadoId,
    usuarioId
  }: {
    empleadoId: number;
    usuarioId: number;
  }) {
    if (!empleadoId) {
      throw new Exception('El id es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El usuario es requerido');
    }

    const empleadoDB = await empleadoService.findById(empleadoId);

    if (!empleadoDB) {
      throw new Exception('Empleado no encontrado');
    }

    await verificarPermiso([permisos.empleados.eliminar_empleados], usuarioId);

    await empleadoService.deleteEmpleado(empleadoId);

    return empleadoDB;
  }
}

export default new EmpleadoValidator();
