import { Documento, Usuario } from '@prisma/client';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { cedulaNotificacion } from '../data/cedulaNotificacion';
import permisos from '../data/permisos';
import { IPaso } from '../interfaces/pasos.interface';
import usersServices from '../services/users.services';
import { Confirmacion } from '../utils/enviarEmail';
import Exception from '../utils/Exception';
import { verificarPermiso } from '../utils/verificarPermisos';
import { getNumeroExpediente } from '../utils/getNumeroExpediente';
import { IDatos } from '../interfaces/users.interface';
import prisma from '../config/db';

declare const process: {
  env: {
    CRYPTO_SECRET: string;
  };
};

interface ITramiteQuery {
  id: number;
  estado: string;
  createdAt: Date;
  fechaFin: Date | null;
  tipo: {
    pasos: any[];
    titulo: string;
  };
  pasoActual: number;
  empleadoAsignado: any;
}

interface IExpedienteQuery {
  id: number;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
  fechaFin: Date | null;
  numeroLegales: string | null;
  numeroFiscalizacion: string | null;
  areas: { areaId: number; expedienteId: number }[];
  procesosLegales: { fallos: { tipo: string }[] | null }[] | null;
}

interface ITramiteResponse {
  id: number;
  estado: string;
  fechaFin: Date | null;
  createdAt: Date;
  titulo: string;
  pasoActual: {
    title: string;
    label: string;
  };
}

interface IExpedienteResponse {
  id: number;
  estado: string;
  createdAt: Date;
  numero: string;
  fechaFin: Date | null;
  areas: { areaId: number; expedienteId: number }[];
  procesosLegales: { fallos: { tipo: string }[] | null }[] | null;
}

interface ICedulaResponse {
  id: number;
  createdAt: string;
  estado: string;
  titulo: string;
  fechaRecepcion: string;
  pasoActual: {
    title: string;
    label: string;
  };
}

interface ITransaccionResponse {
  id: number;
  cuota: string;
  estado: string;
  fecha: string;
  comprobante: Documento[];
  monto: number;
  conceptos: string[];
  tramiteId: number | null;
}

interface IUsuarioGetById extends Usuario {
  tramites: ITramiteResponse[];
  expedientes: IExpedienteResponse[];
  transacciones: ITransaccionResponse[];
  cedulas: ICedulaResponse[];
}

const estadosTransaccion = {
  pending: 'pendiente',
  rejected: 'rechazada',
  approved: 'aprobada',
  sent: 'enviada',
  request: 'solicitud modificación'
};

class UsersValidator {
  async getById(id: number) {
    if (!id) {
      throw new Exception('El id de usuario es requerido');
    }

    const userDB = await usersServices.findById(id);

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }

    const newUser: IUsuarioGetById = {
      ...userDB,
      tramites: userDB.carpetas
        .reduce(
          (acc: ITramiteQuery[], carpeta) => [...acc, ...carpeta.tramites],
          []
        )
        .map((tramite: ITramiteQuery) => {
          const pasos = tramite.tipo.pasos as IPaso[];

          return {
            ...tramite,
            titulo: tramite.tipo.titulo,
            responsable: tramite.empleadoAsignado
              ? `${tramite.empleadoAsignado.usuario.nombre} ${tramite.empleadoAsignado.usuario.apellido}`
              : 'Sin Asignar',
            pasoActual: {
              label: `${tramite.pasoActual + 1} de ${
                tramite.tipo.pasos.length
              }`,
              title: pasos[tramite.pasoActual].intraTitle
            }
          };
        }),
      expedientes: userDB.carpetas
        .reduce(
          (acc: IExpedienteQuery[], carpeta) => [
            ...acc,
            ...carpeta.expedientes
          ],
          []
        )
        .map((expediente) => {
          return {
            ...expediente,
            numero: getNumeroExpediente({
              numeroLegales: expediente.numeroLegales,
              numeroFiscalizacion: expediente.numeroFiscalizacion
            })
          };
        }),
      cedulas: userDB.cedulas.map((cedula) => ({
        ...cedula,
        createdAt: dayjs(cedula.createdAt).isValid()
          ? dayjs(cedula.createdAt).format('DD/MM/YYYY HH:mm')
          : '-',
        fechaRecepcion: dayjs(cedula.fechaRecepcion).isValid()
          ? dayjs(cedula.fechaRecepcion).format('DD/MM/YYYY HH:mm')
          : '-',
        pasoActual: {
          label: `${cedula.pasoActual + 1} de ${
            cedulaNotificacion.pasos.length
          }`,
          title: cedulaNotificacion.pasos[cedula.pasoActual].intraTitle
        }
      })),
      transacciones: userDB.transacciones.map((transaccion) => ({
        id: transaccion.id,
        comprobante: transaccion.comprobante,
        conceptos: transaccion.tipoTransaccion.TipoTransaccionConcepto.map(
          (concepto) => concepto.concepto.nombre
        ),
        cuota: `${transaccion.cuotaNro} de ${transaccion.tipoCuota?.cantidad}`,
        estado: estadosTransaccion[transaccion.estado],
        fecha: dayjs(transaccion.fecha).isValid()
          ? dayjs(transaccion.fecha).format('DD/MM/YYYY HH:mm')
          : '-',
        monto: transaccion.monto,
        tramiteId: transaccion.tramiteId
      }))
    };

    const { contrasenia, ...usuario } = newUser;

    return usuario;
  }

  async getByEmail(email: string) {
    if (!email) {
      throw new Exception('El email es requerido');
    }
    const userDB = await usersServices.findByEmail(email);

    if (!userDB) {
      throw new Exception('Email no encontrado');
    }

    const { contrasenia, ...usuario } = userDB;

    return usuario;
  }

  async create({
    nombre,
    apellido,
    dni,
    email,
    contrasenia
  }: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    contrasenia: string;
  }) {
    if (!nombre) {
      throw new Exception('El nombre es requerido');
    }

    if (!apellido) {
      throw new Exception('El apellido es requerido');
    }

    if (!dni) {
      throw new Exception('El DNI es requerido');
    }

    if (!contrasenia) {
      throw new Exception('La contraseña es requerida');
    }

    if (!email) {
      throw new Exception('El email es requerido');
    }

    const emailExists = await usersServices.emailOrDniAlreadyExists({
      email,
      dni
    });
    if (emailExists) throw new Exception('El email o dni ya existen');

    const encryptPassword = CryptoJS.AES.encrypt(
      contrasenia,
      process.env.CRYPTO_SECRET
    ).toString();

    const usuario = await usersServices.create({
      nombre,
      apellido,
      dni,
      email,
      contrasenia: encryptPassword
    });

    await Confirmacion(email, nombre, apellido);

    return usuario;
  }

  async update(id: number, data: Partial<Usuario>) {
    if (!id) {
      throw new Exception('El id de usuario es requerido');
    }

    if (!data) {
      throw new Exception('Los datos son requeridos');
    }

    const user = await usersServices.findById(id);

    if (!user) {
      throw new Exception('Usuario no encontrado');
    }

    const datos = data.datos as IDatos;

    if (datos.dni.value) {
      const dniExists = await prisma.usuario.findUnique({
        where: {
          dni: datos.dni.value
        }
      });
      if (dniExists && dniExists.id !== id) {
        throw new Exception('El dni ya existe');
      }
    }

    data.dni = datos.dni.value;
    data.nombre = datos.nombre.value;
    data.apellido = datos.apellido.value;

    const userUpdated = await usersServices.update(id, data);

    return userUpdated;
  }

  async delete(id: number) {
    if (!id) {
      throw new Exception('El id de usuario es requerido');
    }
    const user = await usersServices.findById(id);
    if (!user) {
      throw new Exception('Usuario no encontrado');
    }
    const userDelete = await usersServices.delete(id);
    return userDelete;
  }

  async verifyByEmail(email: string) {
    if (!email) {
      throw new Exception('El email del usuario es requerido');
    }

    const verify = await usersServices.verifyByEmail(email);

    if (!verify) {
      throw new Exception('No verificado');
    }

    return verify;
  }

  async getMatriculados({
    pagina,
    limite,
    orden,
    columna,
    busqueda,
    usuarioId
  }: {
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
    usuarioId?: number;
  }) {
    const usuarios = await usersServices.findMatriculados({
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      usuarioId
    });

    const contarMatriculados = await usersServices.contarMatriculados(busqueda);

    const paginasTotales = Math.ceil(contarMatriculados / limite);

    const respuesta = {
      count: contarMatriculados,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite,
      usuarios
    };

    return respuesta;
  }

  async getUsuariosConCarpeta({
    usuarioId,
    pagina,
    limite,
    orden,
    columna,
    busqueda,
    rawFilter
  }: {
    usuarioId: number;
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
    rawFilter?: string;
  }) {
    if (!usuarioId) {
      throw new Exception('El id de usuario es requerido');
    }

    await verificarPermiso(
      [permisos.usuarios.ver_usuarios],
      usuarioId,
      'ver usuarios'
    );

    const filters = rawFilter?.split(',');
    let filterObject;

    if (filters) {
      for (const filterRaw of filters) {
        const filter = filterRaw?.split(':');

        if (filter) {
          switch (filter[0]) {
            case 'tipo_usuario':
              let queryTipoUsuario;
              if (filter[1] === 'matriculados') {
                queryTipoUsuario = {
                  matricula: {
                    every: {
                      estado: {
                        not: 'baja'
                      }
                    }
                  },
                  nroUltimaMatricula: { not: null }
                };
              } else {
                queryTipoUsuario = {
                  OR: [
                    {
                      matricula: {
                        every: {
                          estado: 'baja'
                        }
                      }
                    },
                    {
                      nroUltimaMatricula: null
                    }
                  ]
                };
              }

              filterObject = {
                ...(filterObject || {}),
                ...queryTipoUsuario
              };

              break;

            case 'estado_matricula':
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

    const usuariosDB = await usersServices.findUsuariosConCarpeta({
      limite,
      orden,
      columna,
      pagina,
      busqueda,
      filter: filterObject
    });

    let usuarios: any[] = [];

    if (filters?.find((f) => f.split(':')[0] === 'estado_matricula')) {
      usuarios = usuariosDB.filter((u) => {
        const estadoMatricula = u.matricula[0]?.estado;
        const estadoFiltro = filters
          ?.find((f) => f.split(':')[0] === 'estado_matricula')
          ?.split(':')[1];
        return estadoMatricula === estadoFiltro;
      });
    } else {
      usuarios = usuariosDB;
    }

    const contarUsuariosConCarpeta = usuariosDB.length;

    const paginasTotales = Math.ceil(contarUsuariosConCarpeta / limite);

    const respuesta = {
      count: contarUsuariosConCarpeta,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite,
      usuarios: usuarios.map((u) => {
        const datos = u.datos as IDatos;

        return {
          ...u,
          estadoMatricula: u.matricula[0] ? u.matricula[0].estado : null,
          telefono:
            datos.celularParticular?.value ||
            datos.telefonoParticular?.value ||
            '-'
        };
      })
    };

    return respuesta;
  }
}

export default new UsersValidator();
