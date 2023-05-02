import { Matricula, Usuario } from '@prisma/client';
import dayjs from 'dayjs';
import prisma from '../../config/db';
import areas from '../../data/areas';
import procesoLegalesPasos from '../../data/procesoLegales';
import { IProcesoLegales } from '../../interfaces/expediente.interface';
import { IUsuario } from '../../interfaces/users.interface';
import despachoImputacionServices from '../../services/despachoImputacion.services';
import expedienteServices from '../../services/expediente.services';
import matriculaServices from '../../services/matricula.services';
import textoPdfServices from '../../services/textoPdf.services';
import tramiteServices from '../../services/tramite.services';
import usersServices from '../../services/users.services';
import usersValidator from '../../validators/users.validator';
import { idTextosPdf } from './idTextosPdf';
import tramites from '../../data/tramites';

export const denunciasPdfGenerator = async (
  procesoLegal: IProcesoLegales,
  tipoPdf?: string
) => {
  const actions = procesoLegalesPasos[procesoLegal.pasoActual].actions;

  const datos: any = {};
  let contenido: any = '';
  let denuncia: any = {};
  let matricula: Matricula | null;

  const expediente = await expedienteServices.findById(
    procesoLegal.expedienteId
  );

  if (!expediente) throw new Error('Expediente no encontrado');

  if (tipoPdf) {
    switch (tipoPdf) {
      case 'imputaciones':
        contenido = await textoPdfServices.findById(idTextosPdf.imputacion);
        if (!contenido)
          throw new Error('No se encontró el texto de imputación');
        contenido = contenido.texto;

        datos['contenido'] = contenido;
        datos['destination'] = `/public/archivos/${
          expediente.carpeta?.usuarioId
            ? expediente.carpeta.usuarioId
            : 'cucicba'
        }/expedientes/${expediente.id}/procesos-legales/${procesoLegal.id}/pdf`;

        datos['archivoNombre'] = `imputacion - ${dayjs().format(
          'YYYY-MM-DD_HH.mm.ss.SSS'
        )}.pdf`;

        datos['path'] = `/public/archivos/${
          expediente.carpeta?.usuarioId
            ? expediente.carpeta.usuarioId
            : 'cucicba'
        }/expedientes/${expediente.id}/procesos-legales/${
          procesoLegal.id
        }/pdf/${datos['archivoNombre']}`;

        datos['titulo'] = 'Imputación';

        if (procesoLegal.despachoImputacion?.id) {
          const despachoImputacion = await despachoImputacionServices.findById(
            procesoLegal.despachoImputacion?.id
          );
          if (!despachoImputacion)
            throw new Error('Despacho Imputacion no encontrado');

          const imputacionesDB = await prisma.imputacion.findMany({
            where: {
              id: {
                in: despachoImputacion.imputaciones.map(
                  (i: any) => i.imputacionId
                )
              }
            }
          });

          datos['datos'] = {
            imputaciones: imputacionesDB.map((i: any) => i.titulo),
            motivo: despachoImputacion.motivo,
            titulo: despachoImputacion.titulo
          };
        }
        break;

      default:
        break;
    }
  }

  if (actions) {
    for (const item of actions) {
      const [, tipo] = item.split('/');
      switch (tipo) {
        case 'citacionRatificacion':
          contenido = await textoPdfServices.findById(
            idTextosPdf.citacionRatificacion
          );
          if (!contenido)
            throw new Error('No se encontró el texto de citacionRatificacion');
          contenido = contenido.texto;

          datos['contenido'] = contenido;
          datos['destination'] = `/public/archivos/${
            expediente.carpeta?.usuarioId
              ? expediente.carpeta.usuarioId
              : 'cucicba'
          }/expedientes/${expediente.id}/procesos-legales/${
            procesoLegal.id
          }/pdf`;

          datos['archivoNombre'] = `citacionRatificacion - ${dayjs().format(
            'YYYY-MM-DD_HH.mm.ss.SSS'
          )}.pdf`;

          datos['path'] = `/public/archivos/${
            expediente.carpeta?.usuarioId
              ? expediente.carpeta.usuarioId
              : 'cucicba'
          }/expedientes/${expediente.id}/procesos-legales/${
            procesoLegal.id
          }/pdf/${datos['archivoNombre']}`;

          datos['titulo'] = 'Citación a Ratificación';

          denuncia = expediente.denuncia;

          if (expediente.carpeta?.usuarioId) {
            matricula = await matriculaServices.getByUserId(
              expediente.carpeta.usuarioId
            );

            datos['datos'] = {
              denunciado: `${denuncia?.nombreDenunciado} ${denuncia?.apellidoDenunciado}`,
              denunciante: `${denuncia?.nombreDenunciante} ${
                denuncia?.apellidoDenunciante
                  ? denuncia?.apellidoDenunciante
                  : ''
              }`,
              motivo: denuncia?.motivo,
              expedienteNumero: expediente.numero,
              matricula: matricula?.id
            };
          }

          break;

        case 'citacionParaDescargo':
          if (!expediente.tramitePadreId)
            throw new Error('No se encontró el tramite padre');

          const tramitePadre = await tramiteServices.findById(
            expediente.tramitePadreId
          );

          switch (tramitePadre.tipo.id) {
            case tramites.denunciaPorCucicba:
              contenido = await textoPdfServices.findById(
                idTextosPdf.descargoOficio
              );
              if (!contenido)
                throw new Error('No se encontró el texto de citación descargo');
              contenido = contenido.texto;

              datos['contenido'] = contenido;
              datos['destination'] = `/public/archivos/${
                expediente.carpeta?.usuarioId
                  ? expediente.carpeta.usuarioId
                  : 'cucicba'
              }/expedientes/${expediente.id}/procesos-legales/${
                procesoLegal.id
              }/pdf`;

              datos['archivoNombre'] = `descargoOficio - ${dayjs().format(
                'YYYY-MM-DD_HH.mm.ss.SSS'
              )}.pdf`;

              datos['path'] = `/public/archivos/${
                expediente.carpeta?.usuarioId
                  ? expediente.carpeta.usuarioId
                  : 'cucicba'
              }/expedientes/${expediente.id}/procesos-legales/${
                procesoLegal.id
              }/pdf/${datos['archivoNombre']}`;

              datos['titulo'] = 'Citación a Descargo (Oficio)';

              denuncia = expediente.denuncia;

              if (expediente.carpeta?.usuarioId) {
                matricula = await matriculaServices.getByUserId(
                  expediente.carpeta.usuarioId
                );

                datos['datos'] = {
                  denunciado: `${denuncia?.nombreDenunciado} ${denuncia?.apellidoDenunciado}`,
                  denunciante: `${denuncia?.nombreDenunciante} ${denuncia?.apellidoDenunciante}`,
                  motivo: denuncia?.motivo,
                  expedienteNumero: expediente.numero,
                  matricula: matricula?.id
                };
              }
              break;

            case tramites.denunciaMesaEntrada:
            case tramites.denunciaExterna:
            case tramites.denunciaMatriculaAOtroMatriculado:
              contenido = await textoPdfServices.findById(
                idTextosPdf.descargoParticular
              );
              if (!contenido)
                throw new Error('No se encontró el texto de imputación');
              contenido = contenido.texto;

              datos['contenido'] = contenido;
              datos['destination'] = `/public/archivos/${
                expediente.carpeta?.usuarioId
                  ? expediente.carpeta.usuarioId
                  : 'cucicba'
              }/expedientes/${expediente.id}/procesos-legales/${
                procesoLegal.id
              }/pdf`;

              datos['archivoNombre'] = `descargoParticular - ${dayjs().format(
                'YYYY-MM-DD_HH.mm.ss.SSS'
              )}.pdf`;

              datos['path'] = `/public/archivos/${
                expediente.carpeta?.usuarioId
                  ? expediente.carpeta.usuarioId
                  : 'cucicba'
              }/expedientes/${expediente.id}/procesos-legales/${
                procesoLegal.id
              }/pdf/${datos['archivoNombre']}`;

              datos['titulo'] = 'Citación a Descargo (Particular)';

              denuncia = expediente.denuncia;

              datos['datos'] = {
                denunciado: `${denuncia?.nombreDenunciado} ${denuncia?.apellidoDenunciado}`,
                denunciante:
                  tramitePadre.tipo.id === tramites.denunciaExterna
                    ? 'CUCICBA'
                    : `${denuncia?.nombreDenunciante} ${denuncia?.apellidoDenunciante}`,
                motivo: denuncia?.motivo,
                dniDenunciante: denuncia?.dniDenunciante,
                expedienteNumero: expediente.numero
              };
              break;
          }
          break;

        case 'fallo':
          datos['contenido'] = `
            <body>
            <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
              <div style="text-align: center">
                    <div style="text-align: right; margin-right: 7%; ">
                      <p> Ciudad de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }} </p>
                    </div>
                <h1> Fallos </h1>
                
                {{#each datos.fallos}}
                  <div style="margin-bottom: 20px">
                    <h1 style="font-size: 20px; margin-bottom: 10px">Titulo: <b>{{ this.titulo }}</b> </h1>
                    <p style="font-size: 16px; margin-bottom: 10px"> Tipo: <b> {{ this.tipo }} </b></p>
                    <p style="font-size: 16px; margin: 0 7% 10px 7%; text-align: justify"> Comentario:<b> {{ this.comentario }}</b> </p>
                    <hr>
                {{/each}}

            </body>
          `;
          datos['destination'] = `/public/archivos/${
            expediente.carpeta?.usuarioId
              ? expediente.carpeta.usuarioId
              : 'cucicba'
          }/expedientes/${expediente.id}/procesos-legales/${
            procesoLegal.id
          }/pdf`;

          datos['archivoNombre'] = `fallo - ${dayjs().format(
            'YYYY-MM-DD_HH.mm.ss.SSS'
          )}.pdf`;

          datos['path'] = `/public/archivos/${
            expediente.carpeta?.usuarioId
              ? expediente.carpeta.usuarioId
              : 'cucicba'
          }/expedientes/${expediente.id}/procesos-legales/${
            procesoLegal.id
          }/pdf/${datos['archivoNombre']}`;

          datos['titulo'] = 'Fallo';

          datos['datos'] = {
            fallos: procesoLegal.fallos.map((fallo: any) => {
              return {
                titulo: fallo.titulo,
                tipo: fallo.tipo,
                comentario: JSON.parse(fallo.comentario)
                  .blocks.map((block: any) => block.text)
                  .join(' ')
              };
            })
          };

          break;

        case 'resolucion':
          datos['contenido'] = `
            <body>
            <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
              <div style="text-align: center">
                    <div style="text-align: right">
                      <p> Ciudad de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }} </p>
                    </div>
                <h1>Resoluciones</h1>
                {{#each datos.resoluciones}}
                  <div style="margin-bottom: 20px">
                    <h1 style="font-size: 20px; margin-bottom: 10px">Titulo: <b>{{ this.titulo }}</b> </h1>
                    <p style="font-size: 16px; margin-bottom: 10px"> Comentario:<b> {{ this.comentario }}</b> </p>
                    <hr>
                {{/each}}

            </body>
          `;

          datos['destination'] = `/public/archivos/${
            expediente.carpeta?.usuarioId
              ? expediente.carpeta.usuarioId
              : 'cucicba'
          }/expedientes/${expediente.id}/procesos-legales/${
            procesoLegal.id
          }/pdf`;

          datos['archivoNombre'] = `resolucion - ${dayjs().format(
            'YYYY-MM-DD_HH.mm.ss.SSS'
          )}.pdf`;

          datos['path'] = `/public/archivos/${
            expediente.carpeta?.usuarioId
              ? expediente.carpeta.usuarioId
              : 'cucicba'
          }/expedientes/${expediente.id}/procesos-legales/${
            procesoLegal.id
          }/pdf/${datos['archivoNombre']}`;

          datos['titulo'] = 'Resolución';

          datos['datos'] = {
            resoluciones: procesoLegal.resoluciones.map((resolucion: any) => {
              return {
                titulo: resolucion.titulo,
                comentario: JSON.parse(resolucion.comentario)
                  .blocks.map((block: any) => block.text)
                  .join(' ')
              };
            })
          };
          break;

        case 'apelacion':
          datos['contenido'] = 'Apelación';
          datos['destination'] =
            '/public/archivos/denuncias/' + procesoLegal.id;
          datos['archivoNombre'] = `apelacion - ${dayjs().format(
            'YYYY-MM-DD_HH.mm.ss.SSS'
          )}.pdf`;

          datos['path'] = `/public/archivos/${
            expediente.carpeta?.usuarioId
              ? expediente.carpeta.usuarioId
              : 'cucicba'
          }/expedientes/${expediente.id}/procesos-legales/${
            procesoLegal.id
          }/pdf/${datos['archivoNombre']}`;

          datos['titulo'] = 'Apelación';
          break;

        case 'cedula':
          datos['contenido'] = 'Cedula';
          datos['destination'] =
            '/public/archivos/denuncias/' + procesoLegal.id;
          datos['archivoNombre'] = `cedula - ${dayjs().format(
            'YYYY-MM-DD_HH.mm.ss.SSS'
          )}.pdf`;
          datos['path'] =
            '/public/archivos/denuncias/' +
            procesoLegal.id +
            '/' +
            datos['archivoNombre'];
          datos['titulo'] = 'Cédula';
          break;

        default:
          break;
      }
    }
  }

  return datos;
};
