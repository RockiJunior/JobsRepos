import dayjs from 'dayjs';
import { mkdirSync, writeFileSync } from 'fs';
import Handlebars from 'handlebars';
import pdf from 'html-pdf';
import prisma from '../../config/db';
import usersServices from '../../services/users.services';
import { createPDF } from './createPDF';
import getBase64ImageFromURL from './getBase64';
import tramiteValidators from '../../validators/tramite.validators';
import textoPdfServices from '../../services/textoPdf.services';
import expedienteValidators from '../../validators/expediente.validators';
import procesoLegalesServices from '../../services/procesoLegales.services';
import expedienteServices from '../../services/expediente.services';
import { idTextosPdf } from './idTextosPdf';
import cedulaServices from '../../services/cedula.services';
import meses from '../../data/meses';

// CEDULA NOTIFICACION PDF
// export const createCedulaNotificacionPDF = async (id: number) => {
//   const tramite = await tramiteValidators.getByIdForAction(id);
//   if (!tramite) throw new Error('Tramite no encontrado');
//   const contenido = `
//   <body style="padding: 24px;">
//     <div>
//     <img src="${await getBase64ImageFromURL(
//       `${process.env.SERVER_URL}/assets/img/large_logo.png`
//     )}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
//     <h1 style="text: center;">Declaración Jurada De Actividad No Comercial</h1>
//     <p>Ciudad Autónoma de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }} </p>
//     <h3> Expediente {{ datos.expedienteId }} - {{ apellido }}, {{ nombre }} C/ {{}} {{}} S/ Denuncia: </h3>
//     <p>
//       Atento el estado de autos, y en virtud del silencio del corredor en referencia al pedido de información y gestión de citación sobre el testigo, Sra Silvana Araujo, y siendo que del cotejo de constancias obrates en autos, especificamente a fs. 24, obra domicilio de {{}}, de la cual la aludida resulta ser apoderada, cúrese notificación a los fines de su citación como testigo al domicilio allí constituido, a saber <b> {{ domicilio }} </b>
//     </p>
//     <p>
//       Debiendo la aludida a comparecer <b> {{ turno }} </b> de manera personal en la Sede de CUCICBA, sita en Adolfo Alsina 1382, CABA, a fin de que brinde su testimonio - sin perjuicio de considerar oportunamente la idoneidad de su declaración (art. 362 del CCAyT de la CABA) -, todo ello bajo apercibimiento, en caso de incompetencia, de tenerlo por desistido (art. 343 del CCAyT de la CABA).
//     </p>
//     <p>
//       Se le informa a las partes que podrán, hasta 24 horas previo a celebrarse la audiencia aludida, presentar un cuestionario con preguntas, que durante el desarrollo del acto, se transladará al tesigo. Notifíquese a sus efectos, bajo la modalidad de estilo.
//     </p>
//     </div>
//   </body>`;
//   const options: pdf.CreateOptions = {
//     format: 'A4',
//     header: {
//       height: '100px',
//       contents: `
//       <div id="pageHeader" style="padding-left: 24px; padding-right: 24px">
//           <img src="${await getBase64ImageFromURL(
//             `${process.env.SERVER_URL}/assets/img/large_logo.png`
//           )}" alt="Logo" style="width: 150px; margin: 0; padding: 0; margin-right: 8px;" >
//           <br />
//           <hr />
//       </div>
//       `
//     },
//     footer: {
//       height: '80px',
//       contents: `
//       <div style="padding-left: 24px; padding-right: 24px;">
//         <p style="color: #666; margin: 0; padding-top: 12px; padding-bottom: 5px; text-align: center; font-family: sans-serif; font-size: .85em">
//             Colegio Unico de Corredores Inmobiliarios de la Ciudad de Buenos Aires
//         </p>
//         <p style="color: #666; margin: 0; padding-top: 5px; padding-bottom: 5px; text-align: center; font-family: sans-serif; font-size: .85em">
//           Impreso el día ${dayjs().format('DD/MM/YYYY HH:mm:ss A')}
//         </p>
//       </div>`
//     }
//   };
//   if (tramite.carpeta?.usuarioId) {
//     const usuario = await usersServices.findById(tramite.carpeta.usuarioId);
//     if (!usuario) throw new Error('Usuario no encontrado');
//     const datos = {
//       expedienteId: tramite.expedientePadreId,
//       nombre: usuario.nombre,
//       apellido: usuario.apellido
//     };
//     const functionTemplate = Handlebars.compile(contenido);
//     const html = functionTemplate({ datos, pageOfInputs: {} });
//     let file = await createPDF(html, options);
//     const archivoNombre =
//       'cedula - ' + dayjs().format('YYYY-MM-DD_HH.mm.ss.SSS') + '.pdf';
//     const destination =
//       '/public/archivos/' +
//       tramite.carpeta.usuarioId +
//       '/tramites/' +
//       tramite.id;
//     const path = destination + '/' + archivoNombre;
//     mkdirSync('.' + destination, { recursive: true });
//     writeFileSync('.' + path, file);
//     await prisma.archivo.create({
//       data: {
//         archivoNombre,
//         archivoUbicacion: process.env.SERVER_URL + path,
//         tramiteId: tramite.id,
//         titulo: 'Cédula de Notificacion'
//       }
//     });
//   }
//   return;
// };

export const createCedulaNotificacionPDF = async ({
  tramiteId,
  expedienteId,
  procesoLegalId,
  fiscalizacionId,
  cedulaId
}: {
  tramiteId?: number;
  expedienteId?: number;
  procesoLegalId?: number;
  fiscalizacionId?: number;
  cedulaId: number;
}) => {
  let contenido: any = await textoPdfServices.findById(idTextosPdf.cedula);
  if (!contenido) throw new Error('No se encontró el texto de imputación');
  contenido = contenido.texto;

  const options: pdf.CreateOptions = {
    format: 'Legal',
    header: {
      height: '100px',
      contents: `
      <div id="pageHeader" style="padding-left: 24px; padding-right: 24px">
          <img src="${await getBase64ImageFromURL(
            `${process.env.SERVER_URL}/assets/img/large_logo.png`
          )}" alt="Logo" style="width: 150px; margin: 0; padding: 0; margin-right: 8px;" >
          <br />
          <hr />  
      </div>
      `
    },
    footer: {
      height: '80px',
      contents: `
      <div style="padding-left: 24px; padding-right: 24px;">
        <p style="color: #666; margin: 0; padding-top: 12px; padding-bottom: 5px; text-align: center; font-family: sans-serif; font-size: .85em">
            Colegio Unico de Corredores Inmobiliarios de la Ciudad de Buenos Aires         
        </p>
        <p style="color: #666; margin: 0; padding-top: 5px; padding-bottom: 5px; text-align: center; font-family: sans-serif; font-size: .85em">
          Impreso el día ${dayjs().format('DD/MM/YYYY HH:mm:ss A')}
        </p>
      </div>`
    }
  };

  const cedulaDB = await cedulaServices.findById(cedulaId);

  if (!cedulaDB) {
    throw new Error('Cédula no encontrada');
  }

  let datos: { [key: string]: string | null | undefined | number } = {};
  let usuarioId: number | undefined;

  if (tramiteId) {
    const tramite = await tramiteValidators.getByIdForAction(tramiteId);
    if (tramite.carpeta?.usuarioId) {
      const usuario = await usersServices.findById(tramite.carpeta.usuarioId);
      if (!usuario) throw new Error('Usuario no encontrado');

      const datosUser = usuario.datos as any;

      datos = {
        cedulaNumero: cedulaDB.numero,
        usuarioNombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
        cuil: datosUser.cuitCuil.value,
        cedulaDescripcion: JSON.parse(cedulaDB.motivo)
          .blocks.map((block: any) => block.text)
          .join(' ')
      };

      usuarioId = usuario.id;
    }
  }

  if (expedienteId) {
    const expediente = await expedienteValidators.getByIdForActions(
      expedienteId
    );
    if (expediente.carpeta?.usuarioId) {
      const usuario = await usersServices.findById(
        expediente.carpeta.usuarioId
      );
      if (!usuario) throw new Error('Usuario no encontrado');

      const datosUser = usuario.datos as any;

      datos = {
        cedulaNumero: cedulaDB.numero,
        usuarioNombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
        cuil: datosUser.cuitCuil.value,
        cedulaDescripcion: JSON.parse(cedulaDB.motivo)
          .blocks.map((block: any) => block.text)
          .join(' ')
      };

      usuarioId = usuario.id;
    }
  }
  if (fiscalizacionId) {
    const fiscalizacion = await procesoLegalesServices.findById(
      fiscalizacionId
    );
    if (!fiscalizacion) {
      throw new Error('Fiscalización no encontrada');
    }
    const expediente = await expedienteServices.findById(
      fiscalizacion?.expedienteId
    );
    if (expediente.carpeta?.usuarioId) {
      const usuario = await usersServices.findById(
        expediente.carpeta.usuarioId
      );
      if (!usuario) throw new Error('Usuario no encontrado');

      const datos = {
        fiscalizacionId: fiscalizacion.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido
      };

      usuarioId = usuario.id;
    }
  }
  if (procesoLegalId) {
    const procesoLegal = await procesoLegalesServices.findById(procesoLegalId);
    if (!procesoLegal) {
      throw new Error('Proceso legal no encontrado');
    }

    const expediente = await expedienteServices.findById(
      procesoLegal?.expedienteId
    );
    if (expediente.carpeta?.usuarioId) {
      const usuario = await usersServices.findById(
        expediente.carpeta.usuarioId
      );
      if (!usuario) throw new Error('Usuario no encontrado');

      const datosUser = usuario.datos as any;

      datos = {
        cedulaNumero: cedulaDB.numero,
        usuarioNombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
        cuil: datosUser.cuitCuil.value,
        cedulaDescripcion: JSON.parse(cedulaDB.motivo)
          .blocks.map((block: any) => block.text)
          .join(' ')
      };
      usuarioId = usuario.id;
    }
  }

  if (datos && usuarioId) {
    const mes = meses[dayjs().month()];
    const dia = dayjs().date();
    const anio = dayjs().year();

    const logo = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/large_logo.png`
    );

    const logo_large = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/large_logo.png`
    );

    const functionTemplate = Handlebars.compile(contenido);
    const html = functionTemplate({
      datos,
      logo,
      logo_large,
      dia,
      mes,
      anio
    });
    let file = await createPDF(html, options);

    const archivoNombre =
      'cedula - ' + dayjs().format('YYYY-MM-DD_HH.mm.ss.SSS') + '.pdf';

    const destination = '/public/archivos/' + usuarioId + '/cedulas';

    const path = destination + '/' + archivoNombre;

    mkdirSync('.' + destination, { recursive: true });

    writeFileSync('.' + path, file);

    await prisma.archivo.create({
      data: {
        archivoNombre,
        archivoUbicacion: process.env.SERVER_URL + path,
        tramiteId: tramiteId,
        expedienteId: expedienteId,
        fiscalizacionId: fiscalizacionId,
        procesoLegalesId: procesoLegalId,
        titulo: 'Cédula de Notificacion'
      }
    });
  }

  return;
};
