import dayjs from 'dayjs';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import Handlebars from 'handlebars';
import pdf from 'html-pdf';
import { pdfToPng } from 'pdf-to-png-converter';
import prisma from '../../config/db';
import meses from '../../data/meses';
import { adjuntarArchivos } from './adjuntarArchivos';
import { createPDF } from './createPDF';
import { firmaPdfGenerator } from './firmaPdf';
import getBase64ImageFromURL from './getBase64';
import { mergePdfs } from './mergePdfs';
import { denunciasPdfGenerator } from './denunciaPDF';
import { IDatos } from '../../interfaces/users.interface';
import tramiteValidators from '../../validators/tramite.validators';
import procesoLegalesServices from '../../services/procesoLegales.services';

Handlebars.registerHelper('withItem', function (object, options) {
  return options.fn(object[options.hash.key]);
});

export const create = async (id: number) => {
  const tramite = await tramiteValidators.getByIdForAction(id);

  if (!tramite) throw new Error('Tramite no encontrado');

  const contenido = `
  <body style="padding: 24px;">
    <div>

    <img src="${await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/large_logo.png`
    )}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
      
    <ul style="list-style: none">  
      {{#each tramite.tipo.secciones as |seccion|}}
        <li style="font-size: 25px">{{ seccion.titulo }}</li>

        <ul>
          {{#each seccion.inputs as |input|}}
            {{#withItem ../../pageOfInputs key=input.titulo}}
              {{#if input.InputValues.0.value}}
                <li> <b> {{ input.titulo }}: </b> {{ input.InputValues.0.value }}
              
              {{else if input.InputValues.0.archivos.length}}
                  <li> <b> {{ input.titulo }}: </b> página {{ this }}

              {{else}}
                <li> <b> {{ input.titulo }}: </b> - </li>

              {{/if}}
            {{/withItem}} 
          {{/each}}
        </ul>
      {{/each}}
    </div>
  </body>
`;

  const options: pdf.CreateOptions = {
    format: 'A4',
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

  const functionTemplate = Handlebars.compile(contenido);
  const html = functionTemplate({ tramite, pageOfInputs: {} });
  let file = await createPDF(html, options);

  let { pageOfInputs, newPdf, bufferPdfs } = await adjuntarArchivos(
    tramite,
    file
  );

  if (Object.keys(pageOfInputs).length) {
    const functionTemplate = Handlebars.compile(contenido);
    const html = functionTemplate({
      tramite,
      pageOfInputs
    });

    file = await createPDF(html, options);
    newPdf = (await mergePdfs([{ arrayBuffer: file }, ...bufferPdfs])).pdf;
  }

  const archivoNombre =
    'datos del usuario - ' + dayjs().format('YYYY-MM-DD_HH.mm.ss.SSS') + '.pdf';

  const destination =
    '/public/archivos/' +
    tramite.carpeta?.usuarioId +
    '/tramites/' +
    tramite.id;

  const path = destination + '/' + archivoNombre;

  mkdirSync('.' + destination, { recursive: true });

  writeFileSync('.' + path, newPdf);

  await prisma.archivo.create({
    data: {
      archivoNombre,
      archivoUbicacion: process.env.SERVER_URL + path,
      tramiteId: tramite.id,
      titulo: 'Documentación subida por el usuario'
    }
  });

  return;
};

//FIRMA PDF:___________________________________________________________________________________

export const firmaPdf = async (id: number) => {
  const tramite = await tramiteValidators.getByIdForAction(id);

  if (!tramite) throw new Error('Tramite no encontrado');

  const options: pdf.CreateOptions = {
    format: 'A4',
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

  const { contenido, datosTramite, archivoNombre, destination, path, titulo } =
    await firmaPdfGenerator(tramite);

  if (contenido && datosTramite && archivoNombre && destination && path) {
    const mes = meses[dayjs().month()];
    const dia = dayjs().date();
    const anio = dayjs().year();

    const logo_large = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/large_logo.png`
    );

    const functionTemplate = Handlebars.compile(contenido);
    const html = functionTemplate({ datosTramite, dia, mes, anio, logo_large });
    let file = await createPDF(html, options);

    mkdirSync('.' + destination, { recursive: true });

    writeFileSync('.' + path, file);

    await prisma.archivo.create({
      data: {
        archivoNombre,
        archivoUbicacion: process.env.SERVER_URL + path,
        tramiteId: tramite.id,
        titulo
      }
    });

    return;
  } else {
    return;
  }
};

// OBLEA PDF ______________________________________________________________
export const createObleaPDF = async (id: number) => {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id
    }
  });

  if (!usuario) throw new Error('Usuario no encontrado');

  const options: pdf.CreateOptions = {
    format: 'A4',
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
        Inmobiliaria matriculada en CUCICBA (Colegio Profesional Inmobiliario) <br>
        Adolfo Alsina 1382. CABA <br>
        Tel: 4124-6060 - www.colegioinmobiliario.org.ar <br>
      </p>
    </div>`
    }
  };

  const matricula = await prisma.matricula.findFirst({
    where: {
      estado: 'activo',
      usuarioId: usuario.id
    }
  });

  if (
    matricula &&
    existsSync(
      `./public/archivos/${usuario.id}/qrmatricula/${matricula.id}.png`
    )
  ) {
    const datos = usuario.datos as IDatos;
    const contenido = `
    <body style="-webkit-box-sizing: border-box; box-sizing: border-box; font-family: 'Lato', sans-serif">
    <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
    <div style="display: -webkit-flex; -webkit-justify-content: center">
      <div style="padding: 10px; border: 3px dashed gray; width: fit-content">
        <div style="padding: 40px; background-color: #0f213f">
          <div
            style="
              background-color: white;
              display: -webkit-flex;
              width: 100%;
            "
          >
            <div
              style="
                background-color: #1a386c;
                width: 130px;
                display: -webkit-flex;
                justify-content: center;
                -webkit-justify-content: center;
                align-items: center;
                -webkit-align-items: center;
                transform: rotate(-180deg);
                -webkit-transform: rotate(-180deg);
                height: 380px;
              "
            >
              <span
                style="
                  font-size: 150px;
                  line-height: 150px;
                  padding: 0;
                  color: #fff;
                  font-weight: 600;
                  writing-mode: vertical-rl;
                  -webkit-writing-mode: vertical-rl;
                  transform: translate(9px, 5px);
                  -webkit-transform: translate(9px, 5px);
                  
                "
                >${dayjs().format('YYYY')}</span
              >
            </div>

            <div
              style="
                display: -webkit-flex; 
                flex-direction: column;
                -webkit-flex-direction: column;
                align-items: center;
                justify-content: space-between;
                -webkit-justify-content: space-between;
                
                padding: 20px;
                
              "
            >
              <div style="width: 100%; text-align: center">
                <img src="${await getBase64ImageFromURL(
                  `${process.env.SERVER_URL}/assets/img/large_logo.png`
                )}" alt="" style="width: 250px" />
              </div>

              <div style="display: -webkit-flex; justify-content: space-between; -webkit-justify-content: space-between; align-items: center; -webkit-align-items: center">
                <div style="color: #1a386c">
                  <div>
                    <label style="font-size: 1em; font-weight: 400; width: 130px">
                      Nombre:
                    </label>
                    <label
                      style="
                        font-size: 1rem;
                        font-weight: 900;
                        width: 130px;
                        text-align: left;
                        padding-left: 10px;
                        padding-right: 10px;
                        min-width: 80px;
                        text-indent: -15px;
                      "
                    >
                      ${usuario.nombre} ${usuario.apellido}
                    </label>
                  </div>
                  <div>
                    <label style="font-size: 1em; font-weight: 400; width: 130px">
                      Matricula N°:
                    </label>
                    <label
                      style="
                        font-size: 1rem;
                        font-weight: 900;
                        width: 130px;
                        text-align: left;
                        padding-left: 10px;
                        padding-right: 10px;
                        min-width: 80px;
                      "
                    >
                      ${matricula.id}
                    </label>
                  </div>
                  <div>
                    <label style="font-size: 1em; font-weight: 400; width: 130px">
                      Dirección:
                    </label>
                    <label
                      style="
                        font-size: 1rem;
                        font-weight: 900;
                        width: 130px;
                        text-align: left;
                        padding-left: 10px;
                        padding-right: 10px;
                        min-width: 80px;
                      "
                    >
                      ${datos.domicilioComercial.value}
                    </label>
                  </div>
                  <div>
                    <label style="font-size: 1em; font-weight: 400; width: 130px">
                      Vencimiento:
                    </label>
                    <label
                      style="
                        font-size: 1rem;
                        font-weight: 900;
                        width: 130px;
                        text-align: left;
                        padding-left: 10px;
                        padding-right: 10px;
                        min-width: 80px;
                      "
                    >
                      ${dayjs(matricula.vencimiento).format('DD/MM/YYYY')}
                    </label>
                  </div>
                </div>

                
                <img src="${await getBase64ImageFromURL(
                  process.env.SERVER_URL +
                    `/public/archivos/${usuario.id}/qrmatricula/${matricula.id}.png`
                )}" alt="qr" style="width: 150px"/>
             
              </div>

              <div style="font-size: 12px; color: #1a386c; text-align: center">
                <p>
                  Inmobiliaria matriculada en CUCICBA (Colegio Profesional
                  Inmobiliario) <br />
                  Adolfo Alsina 1382. CABA <br />
                  Tel: 4124-6060 - www.colegioinmobiliario.org.ar <br />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
    `;

    const functionTemplate = Handlebars.compile(contenido);
    const html = functionTemplate({});
    let file = await createPDF(html, options);

    const archivoNombre = 'oblea-' + dayjs().format('YYYY') + '.pdf';

    const destination =
      '/public/archivos/' + usuario.id + '/oblea/' + matricula.id;

    const path = destination + '/' + archivoNombre;

    mkdirSync('.' + destination, { recursive: true });

    writeFileSync('.' + path, file);

    //_______________________________PNG:

    let obleaPDF = (await createPDF(
      `<body style="-webkit-box-sizing: border-box; box-sizing: border-box; font-family: 'Lato', sans-serif">
      <div style="display: -webkit-flex; -webkit-justify-content: center">
        <div style="padding: 160px; background-color: #0f213f;">
        <div
          style="
            background-color: white;
            display: -webkit-flex;
            width: 100%;
          "
        >
          <div
            style="
              background-color: #1a386c;
              width: 520px;
              display: -webkit-flex;
              justify-content: center;
              -webkit-justify-content: center;
              align-items: center;
              -webkit-align-items: center;
              transform: rotate(-180deg);
              -webkit-transform: rotate(-180deg);
              height: 1520px;
            "
          >
            <span
              style="
                font-size: 600px;
                line-height: 600px;
                padding: 0;
                color: #fff;
                font-weight: 600;
                writing-mode: vertical-rl;
                -webkit-writing-mode: vertical-rl;
                transform: translate(36px, 20px);
                -webkit-transform: translate(36px, 20px);
                
              "
              >${dayjs().format('YYYY')}</span
            >
          </div>

          <div
            style="
              display: -webkit-flex; 
              flex-direction: column;
              -webkit-flex-direction: column;
              align-items: center;
              justify-content: space-between;
              -webkit-justify-content: space-between;
              
              padding: 80px;
              
            "
          >
            <div style="width: 100%; text-align: center">
              <img src="${await getBase64ImageFromURL(
                `${process.env.SERVER_URL}/assets/img/large_logo.png`
              )}" alt="" style="width: 1000px" />
            </div>

            <div style="display: -webkit-flex; justify-content: space-between; -webkit-justify-content: space-between; align-items: center; -webkit-align-items: center">
              <div style="color: #1a386c">
                <div>
                  <label style="font-size: 4em; font-weight: 400; width: 520px">
                    Nombre:
                  </label>
                  <label
                    style="
                      font-size: 4rem;
                      font-weight: 900;
                      width: 520px;
                      text-align: left;
                      padding-left: 40px;
                      padding-right: 40px;
                      min-width: 320px;
                      text-indent: -60px;
                    "
                  >
                    ${usuario.nombre} ${usuario.apellido}
                  </label>
                </div>
                <div>
                  <label style="font-size: 4em; font-weight: 400; width: 520px">
                    Matricula N°:
                  </label>
                  <label
                    style="
                      font-size: 4rem;
                      font-weight: 900;
                      width: 520px;
                      text-align: left;
                      padding-left: 40px;
                      padding-right: 40px;
                      min-width: 320px;
                    "
                  >
                    ${matricula.id}
                  </label>
                </div>
                <div>
                  <label style="font-size: 4em; font-weight: 400; width: 130px">
                    Dirección:
                  </label>
                  <label
                    style="
                      font-size: 4rem;
                      font-weight: 900;
                      width: 520px;
                      text-align: left;
                      padding-left: 40px;
                      padding-right: 40px;
                      min-width: 320px;
                    "
                  >
                    ${datos.domicilioComercial.value}
                  </label>
                </div>
                <div>
                  <label style="font-size: 4em; font-weight: 400; width: 130px">
                    Vencimiento:
                  </label>
                  <label
                    style="
                      font-size: 4rem;
                      font-weight: 900;
                      width: 520px;
                      text-align: left;
                      padding-left: 40px;
                      padding-right: 40px;
                      min-width: 320px;
                    "
                  >
                    ${dayjs(matricula.vencimiento).format('DD/MM/YYYY')}
                  </label>
                </div>
              </div>

              
              <img src="${await getBase64ImageFromURL(
                process.env.SERVER_URL +
                  `/public/archivos/${usuario.id}/qrmatricula/${matricula.id}.png`
              )}" alt="qr" style="width: 600px"/>
          
            </div>

            <div style="font-size: 48px; color: #1a386c; text-align: center">
              <p>
                Inmobiliaria matriculada en CUCICBA (Colegio Profesional
                Inmobiliario) <br />
                Adolfo Alsina 1382. CABA <br />
                Tel: 4124-6060 - www.colegioinmobiliario.org.ar <br />
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </body>
      `,
      {
        border: '0',

        quality: '100',
        orientation: 'landscape',
        width: '1910px',
        height: '1402px'
      }
    )) as any;

    const filePNG = await pdfToPng(obleaPDF);

    const archivoNombrePng = 'oblea-' + dayjs().format('YYYY') + '.png';

    const destinationPng =
      '/public/archivos/' + usuario.id + '/oblea/' + matricula.id;

    const pathPng = destinationPng + '/' + archivoNombrePng;

    writeFileSync('.' + pathPng, filePNG[0].content);

    return `${destination}/${archivoNombre}`;
  }
};

export const denunciasPdf = async (id: number, tipo?: string) => {
  const procesoLegal = await procesoLegalesServices.findById(id);

  if (!procesoLegal) throw new Error('Proceso Legal no encontrado');

  const options: pdf.CreateOptions = {
    format: 'A4',
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

  const { path, destination, archivoNombre, titulo, contenido, datos } =
    await denunciasPdfGenerator(procesoLegal, tipo);

  if (path && destination && archivoNombre && titulo && contenido && datos) {
    const mes = meses[dayjs().month()];
    const dia = dayjs().date();
    const anio = dayjs().year();

    const logo_large = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/large_logo.png`
    );

    const functionTemplate = Handlebars.compile(contenido);
    const html = functionTemplate({ datos, dia, mes, anio, logo_large });
    let file = await createPDF(html, options);

    mkdirSync('.' + destination, { recursive: true });

    writeFileSync('.' + path, file);

    await prisma.archivo.create({
      data: {
        archivoNombre,
        archivoUbicacion: process.env.SERVER_URL + path,
        procesoLegalesId: procesoLegal.id,
        titulo
      }
    });

    return;
  } else {
    return;
  }
};

// Create Caratula _____________________________________________________________

export const createCaratula = async ({
  titulo,
  denunciante,
  denunciado,
  expedienteId,
  fecha
}: {
  titulo: string;
  denunciante: string;
  denunciado: string;
  expedienteId: number;
  fecha: Date;
}) => {
  const contenido = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Caratula</title>
    </head>
    <body style="display: -webkit-flex; -webkit-justify-content: center; -webkit-align-items: center">
      <div
        style="
          border: 1px solid black;
          padding: 50px;
          height: 1000px;
          width: 650px;
          display: webkit-flex;
          -webkit-flex-direction: column;
          -webkit-justify-content: space-between;
          -webkit-align-items: center;
          -webkit-vertical-align: middle;
          text-align: center;
        "
      >
        <div style="text-align: center; -webkit-text-align: center; width: 600px">
          <img src="{{ logo }}" alt="Logo CUCICBA" />
          <p style="font-size: 2em; font-weight: 800">
            Colegio Único de Corredores Inmobiliarios de la Ciudad de Buenos Aires
          </p>
        </div>

        <div style="font-size: 1.5em">
          <h1>{{ titulo }}</h1> 
        </div>
  
        <div style="text-align: left; font-size: 1.5em">
          <h2>Denunciante: {{ denunciante }}</h2>
          <h2>Denunciado: {{ denunciado }}</h2>
        </div>

        <div style="text-align:left; font-size: 1.5em">
          <h2><u>Expediente Nro:</u> {{ expedienteId }}</h2>
        </div>

        <div>
          <h2 style="text-align: left; font-size: 1.5em;">
            <u>Fecha de Inicio:</u> {{ fecha }}
          </h2>
        </div>
  
      </div>
    </body>
  </html> 
  `;

  const logo = await getBase64ImageFromURL(
    `${process.env.SERVER_URL}/assets/img/large_logo.png`
  );
  const functionTemplate = Handlebars.compile(contenido);
  const html = functionTemplate({
    titulo,
    denunciado,
    denunciante,
    expedienteId,
    logo,
    fecha: dayjs(fecha).format('DD/MM/YYYY')
  });
  let file = await createPDF(html, { format: 'A4' });

  const destination = '/public/archivos/denuncias/' + expedienteId;
  const archivoNombre = `caratula - ${dayjs().format(
    'YYYY-MM-DD_HH.mm.ss.SSS'
  )}.pdf`;
  const path =
    '/public/archivos/denuncias/' + expedienteId + '/' + archivoNombre;
  const tituloDocumento = `Caratula Expediente - ${expedienteId} `;

  mkdirSync('.' + destination, { recursive: true });

  writeFileSync('.' + path, file);

  await prisma.archivo.create({
    data: {
      archivoNombre,
      archivoUbicacion: process.env.SERVER_URL + path,
      expedienteId,
      titulo: tituloDocumento
    }
  });

  return;
};
