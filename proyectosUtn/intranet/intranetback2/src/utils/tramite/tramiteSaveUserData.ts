import prisma from '../../config/db';
import tramites from '../../data/tramites';
import { ITramite } from '../../interfaces/tramite.interface';
import { IDatos } from '../../interfaces/users.interface';
import axios from 'axios';

declare const process: {
  env: {
    CABAPROP_SERVER_URL: string;
  };
};

export const saveUserData = async (tramite: ITramite) => {
  const secciones = tramite.tipo.secciones;
  if (tramite.carpeta?.usuarioId) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: tramite.carpeta?.usuarioId },
      include: {
        matricula: {
          where: {
            estado: 'activo'
          }
        }
      }
    });

    if (usuario) {
      const oldData = usuario.datos as IDatos;
      const datos = { ...oldData } as IDatos;
      const datosCabaprop: { [key: string]: string } = {};

      for (let seccion of secciones) {
        const inputs = seccion.inputs;
        for (let input of inputs) {
          if (
            input.InputValues &&
            tramite.tipo.id === tramites.ddjjActividadComercial
          ) {
            switch (input.InputValues.inputNombre) {
              case 'nombre':
              case 'apellido':
              case 'dni':
              case 'celularParticular':
              case 'telefonoParticular':
              case 'domicilioReal':
              case 'domicilioLegal':
              case 'domicilioCasaCentral':
              case 'telefonoCasaCentral':
              case 'sucursal1':
              case 'domicilioSucursal1':
              case 'telefonoSucursal1':
              case 'sucursal2':
              case 'domicilioSucursal2':
              case 'telefonoSucursal2':
                datosCabaprop[input.InputValues.inputNombre] = input.InputValues
                  .value
                  ? input.InputValues.value
                  : '';
                break;
            }
            if (input.InputValues.value) {
              datos[input.nombre] = { value: input.InputValues.value };
            }
            if (input.InputValues.archivos?.length) {
              datos[input.nombre] = {
                archivos: input.InputValues.archivos.map(
                  (archivo) => archivo.archivoUbicacion
                )
              };
            }
          }
        }
      }

      if (tramite.tipo.id === tramites.ddjjActividadComercial) {
        const sendDatos = {
          usuario: {
            email: usuario.email,
            nombre: datosCabaprop.nombre,
            apellido: datosCabaprop.apellido,
            nombreFantasia: datosCabaprop.nombreFantasia
              ? datosCabaprop.nombreFantasia
              : '',
            celularParticular: datosCabaprop.celularParticular,
            telefonoParticular: datosCabaprop.telefonoParticular,
            telefonoComercial: datosCabaprop.telefonoComercial,
            domicilioReal: datosCabaprop.domicilioReal,
            domicilioLegal: datosCabaprop.domicilioLegal,
            dni: datosCabaprop.dni,
            matricula: usuario.matricula
          },
          sucursales: [
            {
              domicilio: datosCabaprop.domicilioCasaCentral,
              telefono: datosCabaprop.telefonoCasaCentral,
            },
            {
              domicilio: datosCabaprop.sucursal1 ? datosCabaprop.domicilioSucursal1 : '',
              telefono: datosCabaprop.telefonoSucursal1 ? datosCabaprop.telefonoSucursal1 : '',
            },
            {
              domicilio: datosCabaprop.susursal2 ? datosCabaprop.domicilioSucursal2 : '',
              telefono: datosCabaprop.telefonoSucursal2 ? datosCabaprop.telefonoSucursal2 : '',
            }
          ]
        };

        try {
          await axios.post(
            `https://${process.env.CABAPROP_SERVER_URL}/api/users/update-intranet-data`,
            sendDatos
          );
        } catch (error) {
          console.log(error);
        }
      }

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { 
          telefono: datos.celularParticular ? datos.celularParticular.value : datos.telefonoParticular ? datos.telefonoParticular.value : '',
          datos
        }
      });
    }
  }
};
