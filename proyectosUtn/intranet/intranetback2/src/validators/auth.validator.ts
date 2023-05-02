import usersServices from '../services/users.services';
import Exception from '../utils/Exception';
import CryptoJS from 'crypto-js';
import {
  createTokenEmpleado,
  createTokenUsuario,
  createTokenUsuarioCabaprop
} from '../utils/jwt';
import {
  Confirmacion,
  RecuperarContrasenia,
  SolicitudCambioMail
} from '../utils/enviarEmail';

declare const process: {
  env: {
    CRYPTO_SECRET: string;
  };
};

class UsersValidator {
  async login(email: string, password: string) {
    if (!email) {
      throw new Exception('El email es requerido');
    }

    if (!password) {
      throw new Exception('La contraseña es requerida');
    }

    const userDB = await usersServices.findByEmail(email);

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }

    if (!userDB.verificado) {
      throw new Exception('Usuario no verificado');
    }

    const decryptPassword = CryptoJS.AES.decrypt(
      userDB.contrasenia,
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8);

    if (decryptPassword !== password) {
      throw new Exception('Contraseña incorrecta');
    }

    const token = createTokenUsuario(userDB);

    const { contrasenia: pwd, ...user } = userDB as any;

    return { user, token };
  }

  async loginCabaprop(email: string, password: string) {
    if (!email) {
      throw new Exception('El email es requerido');
    }

    if (!password) {
      throw new Exception('La contraseña es requerida');
    }

    const userDB = await usersServices.findByEmailCabaprop(email);

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }

    if (!userDB.verificado) {
      throw new Exception('Usuario no verificado');
    }

    const decryptPassword = CryptoJS.AES.decrypt(
      userDB.contrasenia,
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8);

    if (decryptPassword !== password) {
      throw new Exception('Contraseña incorrecta');
    }

    const datosDB = userDB.datos as { [key: string]: any };

    if (userDB.matricula.length === 0) {
      throw new Error('No posee matricula');
    }

    if (!datosDB?.actividadComercial?.value) {
      throw new Exception('No posee actividad comercial');
    }

    // nombre,
    // apellido,
    // telefonoParticular,
    // celularParticular,
    // domicilioReal, // en donde alquila
    // domicilioLegal, // => el que figura en documento
    // domicilioCasaCentral,
    // domicilioSucursal1, // sucursal
    // domicilioSucursal2, // sucursal

    const sucursales = [
      {
        domicilio: datosDB.domicilioCasaCentral.value,
        telefono: datosDB.telefonoCasaCentral.value
      }
    ];

    if (datosDB.domicilioSucursal1?.value) {
      sucursales.push({
        domicilio: datosDB.domicilioSucursal1.value,
        telefono: datosDB.telefonoSucursal1.value
      });
    }
    if (datosDB.domicilioSucursal2?.value) {
      sucursales.push({
        domicilio: datosDB.domicilioSucursal2.value,
        telefono: datosDB.telefonoSucursal2.value
      });
    }
    const user = {
      usuario: {
        id: userDB.id,
        email: userDB.email,
        nombre: datosDB.nombre.value,
        apellido: datosDB.apellido.value,
        nombreFantasia: datosDB.nombreFantasia
          ? datosDB.nombreFantasia.value
          : '',
        celularParticular: datosDB.celularParticular.value,
        telefonoParticular: datosDB.telefonoParticular.value,
        telefonoComercial: datosDB.telefonoComercial.value,
        domicilioReal: datosDB.domicilioReal.value,
        domicilioLegal: datosDB.domicilioLegal.value,
        dni: datosDB.dni.value,
        matricula: userDB.matricula.find((m: any) => m.estado === 'activo')
      },
      sucursales
    };

    const response = createTokenUsuarioCabaprop(user);

    return { response, status: 200 };
  }

  async loginEmpleado(email: string, password: string) {
    if (!email) {
      throw new Exception('El email es requerido');
    }

    if (!password) {
      throw new Exception('La contraseña es requerida');
    }

    const userDB = await usersServices.findByEmail(email);

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }
    if (!userDB.empleado) {
      throw new Exception('Empleado no encontrado');
    }

    const decryptPassword = CryptoJS.AES.decrypt(
      userDB.contrasenia,
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8);

    if (decryptPassword !== password) {
      throw new Exception('Contraseña incorrecta');
    }

    const token = createTokenEmpleado(userDB);

    const { contrasenia: pwd, ...user } = userDB as any;

    if (user.empleado?.roles?.length) {
      const permisos: number[] = [];
      user.empleado.roles.forEach((rol: any) => {
        rol.PermisoRol.forEach((permiso: any) => {
          if (!permisos.includes(permiso.permiso.id)) {
            permisos.push(permiso.permiso.id);
          }
        });
      });

      delete user.empleado.roles;
      user.empleado.permisos = permisos;
    }

    return { user, token };
  }

  async checkLogged(userId: number) {
    if (!userId) {
      throw new Exception('El id de usuario es requerido');
    }

    const userDB = await usersServices.findById(userId);

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }

    const { contrasenia, ...user } = userDB as any;

    if (user.empleado?.roles?.length) {
      const permisos: number[] = [];
      user.empleado.roles.forEach((rol: any) => {
        rol.PermisoRol.forEach((permiso: any) => {
          if (!permisos.includes(permiso.permiso.id)) {
            permisos.push(permiso.permiso.id);
          }
        });
      });

      delete user.empleado.roles;
      user.empleado.permisos = permisos;
    }

    return user;
  }

  async reenviarMail(email: string) {
    if (!email) {
      throw new Exception('El email es requerido');
    }

    const userDB = await usersServices.findByEmail(email);

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }

    if (userDB.verificado) {
      throw new Exception('Usuario ya verificado');
    }

    await Confirmacion(email, userDB.nombre, userDB.apellido);

    return;
  }

  async recuperarContrasenia(email: string, intranet: boolean) {
    if (!email) {
      throw new Exception('El email es requerido');
    }

    const userDB = await usersServices.findByEmail(email);

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }

    await RecuperarContrasenia(email, intranet);

    return;
  }

  async restablecerContrasenia(encryptedEmail: string, password: string) {
    if (!encryptedEmail) {
      throw new Exception('El email es requerido');
    }

    if (!password) {
      throw new Exception('La contraseña es requerida');
    }

    const bytes = CryptoJS.AES.decrypt(
      encryptedEmail
        .replaceAll('xMl3Jk', '+')
        .replaceAll('Por21Ld', '/')
        .replaceAll('Ml32', '='),
      process.env.CRYPTO_SECRET
    );

    const email = bytes.toString(CryptoJS.enc.Utf8);

    const userDB = await usersServices.findByEmail(email);

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }

    const encryptPassword = CryptoJS.AES.encrypt(
      password,
      process.env.CRYPTO_SECRET
    ).toString();

    await usersServices.update(userDB.id, { contrasenia: encryptPassword });

    return;
  }

  async solicitudCambioMail(email: string, password: string, usuarioId: number) {
    if (!email) {
      throw new Exception('El email es requerido');
    }

    if (!password) {
      throw new Exception('La contraseña es requerida');
    }

    const emailExist = await usersServices.findByEmail(email);

    if (emailExist) {
      throw new Exception('El email ya existe');
    }

    const userDB = await usersServices.findById(usuarioId)

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }

    const decryptPassword = CryptoJS.AES.decrypt(
      userDB.contrasenia,
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8);

    if (decryptPassword !== password) {
      throw new Exception('Contraseña incorrecta');
    }

    await SolicitudCambioMail(email, usuarioId);

    return;
  }

  async restablecerMail({
    email,
    usuarioId
  }: {
    email: string;
    usuarioId: number;
  }) {
    if (!email) {
      throw new Exception('El email es requerido');
    }
    
    if (!usuarioId) {
      throw new Exception('El nuevo email es requerido');
    }

    const userDB = await usersServices.findById(usuarioId)

    if (!userDB) {
      throw new Exception('Usuario no encontrado');
    }

    const userDB2 = await usersServices.findByEmail(email);

    if (userDB2) {
      throw new Exception('El email ya se encuentra registrado');
    }

    await usersServices.update(userDB.id, { email: email });

    return;
  }
}

export default new UsersValidator();
