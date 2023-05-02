import { EstadoMatricula, InputsValues } from '@prisma/client';
import dayjs from 'dayjs';
import prisma from '../../config/db';
import tramites from '../../data/tramites';
import { ITramite } from '../../interfaces/tramite.interface';
import matriculaServices from '../../services/matricula.services';
import textoPdfServices from '../../services/textoPdf.services';
import { idTextosPdf } from './idTextosPdf';

export const firmaPdfGenerator = async (tramite: ITramite) => {
  let contenido: any = '';
  let datosNecesarios: String[] = [];
  // let datosTramite: { [prop: string]: string | null } = {};
  let datosTramite: any = {};
  let destination: string = '';
  let archivoNombre: string = '';
  let path: string = '';
  let titulo: string = '';
  let datosInputValues: InputsValues[] | undefined;

  switch (tramite.tipo.id) {
    case tramites.ddjjNoActividadComercial:
      contenido = await textoPdfServices.findById(
        idTextosPdf.noActividadComercial
      );
      if (!contenido)
        throw new Error('No se encontró el texto para la firma del pdf');
      contenido = contenido.texto;

      datosTramite = {};

      datosInputValues = await prisma.inputsValues.findMany({
        where: {
          inputNombre: {
            in: [
              'nombre',
              'apellido',
              'dni',

              'domicilioLegal',
              'codigoPostalLegal',
              'numeroMatricula',
              'tomoMatricula',
              'folioMatricula'
            ]
          },
          tramiteId: tramite.id
        }
      });

      for (const dato of datosInputValues) {
        datosTramite[dato.inputNombre] = dato.value;
      }

      archivoNombre =
        'ddjjNoActividad - ' +
        dayjs().format('YYYY-MM-DD_HH.mm.ss.SSS') +
        '.pdf';

      destination =
        '/public/archivos/' +
        tramite.carpeta?.usuarioId +
        '/tramites/' +
        tramite.id;

      path = destination + '/' + archivoNombre;
      titulo = 'Declaración Jurada De Actividad No Comercial';

      break;

    case tramites.ddjjActividadComercial:
      contenido = await textoPdfServices.findById(
        idTextosPdf.actividadComercial
      );
      if (!contenido)
        throw new Error('No se encontró el texto para la firma del pdf');
      contenido = contenido.texto;

      datosNecesarios = [
        'nombre',
        'apellido',
        'dni',

        'domicilioLegal',
        'codigoPostalLegal',
        'domicilioReal',
        'codigoPostalReal',
        'numeroMatricula',
        'tomoMatricula',
        'folioMatricula',

        'cuitCuil',
        'nombreFantasia',
        'emailComercial',
        'telefonoComercial',
        'domicilioComercial',
        'codigoPostalComercial',

        'domicilioCasaCentral',
        'telefonoCasaCentral',

        'domicilioSucursal1',
        'telefonoSucursal1',
        'domicilioSucursal2',
        'telefonoSucursal2',

        'sociedad',
        'nombreSociedad',
        'marcaRegistrada',
        'marcaRegistradaNombre',
        'porcentajeSociedad',

        'desafectacionSociedad',
        'desafectacionSociedadNombre'
      ];

      datosTramite = {};

      datosInputValues = await prisma.inputsValues.findMany({
        where: {
          inputNombre: {
            in: [
              'nombre',
              'apellido',
              'dni',

              'domicilioLegal',
              'codigoPostalLegal',
              'domicilioReal',
              'codigoPostalReal',
              'numeroMatricula',
              'tomoMatricula',
              'folioMatricula',

              'cuitCuil',
              'nombreFantasia',
              'emailComercial',
              'telefonoComercial',
              'domicilioComercial',
              'codigoPostalComercial',

              'domicilioCasaCentral',
              'telefonoCasaCentral',

              'domicilioSucursal1',
              'telefonoSucursal1',
              'domicilioSucursal2',
              'telefonoSucursal2',

              'sociedad',
              'nombreSociedad',
              'marcaRegistrada',
              'marcaRegistradaNombre',
              'porcentajeSociedad',

              'desafectacionSociedad',
              'desafectacionSociedadNombre',
              'marcaRegistradaCesion',
              'facturaElectronica',
              'marcaRegistradaRegistroInpi'
            ]
          },
          tramiteId: tramite.id
        }
      });

      for (const dato of datosInputValues) {
        datosTramite[dato.inputNombre] = dato.value;
      }

      datosTramite = {
        ...datosTramite,
        isFacturaProfesional: datosTramite.hasOwnProperty('facturaElectronica'),
        isCopiaCesion: datosTramite.hasOwnProperty('marcaRegistradaCesion'),
        isCopiaInpi: datosTramite.hasOwnProperty('marcaRegistradaRegistroInpi')
      };

      archivoNombre =
        'ddjjActividad - ' + dayjs().format('YYYY-MM-DD_HH.mm.ss.SSS') + '.pdf';

      destination =
        '/public/archivos/' +
        tramite.carpeta?.usuarioId +
        '/tramites/' +
        tramite.id;

      path = destination + '/' + archivoNombre;
      titulo = 'Declaración Jurada De Actividad Comercial';

      break;

    case tramites.ddjjBajaProfesionalYBaja:
      contenido = await textoPdfServices.findById(
        idTextosPdf.bajaMatriculaProfesional
      );
      if (!contenido)
        throw new Error('No se encontró el texto para la firma del pdf');
      contenido = contenido.texto;

      datosTramite = {};

      datosInputValues = await prisma.inputsValues.findMany({
        where: {
          inputNombre: {
            in: [
              'nombre',
              'apellido',
              'dni',
              'mailParticular',
              'telefonoParticular',

              'domicilioReal',
              'domicilioLegal',
              'codigoPostalLegal',
              'numeroMatricula',
              'tomoMatricula',
              'folioMatricula',
              'legajoMatricula'
            ]
          },
          tramiteId: tramite.id
        }
      });

      for (const dato of datosInputValues) {
        datosTramite[dato.inputNombre] = dato.value;
      }

      archivoNombre =
        'ddjjBajaMatriculaProfesional - ' +
        dayjs().format('YYYY-MM-DD_HH.mm.ss.SSS') +
        '.pdf';

      destination =
        '/public/archivos/' +
        tramite.carpeta?.usuarioId +
        '/tramites/' +
        tramite.id;

      path = destination + '/' + archivoNombre;

      break;

    case tramites.solicitudLicenciaPasividadEmpleado:
    case tramites.solicitudLicenciaPasividadUsuario:
      contenido = await textoPdfServices.findById(
        idTextosPdf.solicitudLicenciaPasividad
      );
      if (!contenido)
        throw new Error('No se encontró el texto para la firma del pdf');
      contenido = contenido.texto;

      datosInputValues = await prisma.inputsValues.findMany({
        where: {
          inputNombre: {
            in: [
              'nombre',
              'apellido',
              'dni',
              'mailParticular',
              'telefonoParticular',

              'domicilioReal',
              'domicilioLegal',
              'codigoPostalLegal',
              'numeroMatricula',
              'tomoMatricula',
              'folioMatricula',
              'legajoMatricula',
              'MotivoSolicitud'
            ]
          },
          tramiteId: tramite.id
        }
      });

      datosTramite = {};

      for (const dato of datosInputValues) {
        datosTramite[dato.inputNombre] = dato.value;
      }

      archivoNombre =
        'ddjjSolicitudLicenciaPasividad - ' +
        dayjs().format('YYYY-MM-DD_HH.mm.ss.SSS') +
        '.pdf';

      destination =
        '/public/archivos/' +
        tramite.carpeta?.usuarioId +
        '/tramites/' +
        tramite.id;

      path = destination + '/' + archivoNombre;

      break;

    case tramites.altaMatriculacionCesantia:
      contenido = await textoPdfServices.findById(
        idTextosPdf.altaMatriculacionCesantia
      );
      if (!contenido)
        throw new Error('No se encontró el texto para la firma del pdf');
      contenido = contenido.texto;

      datosNecesarios = [
        'nombre',
        'apellido',
        'dni',
        'mailParticular',
        'telefonoParticular',

        'domicilioReal',
        'domicilioLegal',
        'codigoPostalLegal',
        'numeroMatricula',
        'tomoMatricula',
        'folioMatricula',
        'legajoMatricula',
        'MotivoSolicitud'
      ];

      datosInputValues = await prisma.inputsValues.findMany({
        where: {
          inputNombre: {
            in: [
              'nombre',
              'apellido',
              'dni',
              'mailParticular',
              'telefonoParticular',

              'domicilioReal',
              'domicilioLegal',
              'codigoPostalLegal',
              'numeroMatricula',
              'tomoMatricula',
              'folioMatricula',
              'legajoMatricula',
              'MotivoSolicitud'
            ]
          },
          tramiteId: tramite.id
        }
      });

      datosTramite = {};

      for (const dato of datosInputValues) {
        datosTramite[dato.inputNombre] = dato.value;
      }

      if (tramite.carpeta) {
        const matricula = await matriculaServices.getByUserIdAndEstado({
          usuarioId: tramite.carpeta.usuarioId,
          estado: EstadoMatricula.baja
        });
        datosTramite.fechaAprobado = dayjs(matricula?.fecha).format(
          'DD/MM/YYYY'
        );
      }

      archivoNombre =
        'ddjjSolicitudLicenciaPasividad - ' +
        dayjs().format('YYYY-MM-DD_HH.mm.ss.SSS') +
        '.pdf';

      destination =
        '/public/archivos/' +
        tramite.carpeta?.usuarioId +
        '/tramites/' +
        tramite.id;

      path = destination + '/' + archivoNombre;

      break;

    default:
      break;
  }

  return {
    contenido,
    datosTramite,
    archivoNombre,
    destination,
    path,
    titulo
  };
};
