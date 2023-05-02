import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const confirmacionTemplate = fs.readFileSync(
  path.resolve(__dirname, '../templates/email/confirmacion.html'),
  'utf8'
);
const turnoTemplate = fs.readFileSync(
  path.resolve(__dirname, '../templates/email/turno.html'),
  'utf8'
);
const confirmacionEventoTemplate = fs.readFileSync(
  path.resolve(__dirname, '../templates/email/confirmacionEvento.html'),
  'utf8'
);
const notificacion = fs.readFileSync(
  path.resolve(__dirname, '../templates/email/notificacion.html'),
  'utf8'
);
const recuperarContraseniaTemplate = fs.readFileSync(
  path.resolve(__dirname, '../templates/email/recuperarContrasenia.html'),
  'utf8'
);

const cambioMailTemplate = fs.readFileSync(
  path.resolve(__dirname, '../templates/email/cambioMail.html'),
  'utf8'
);

const turnoProcesoLegalTemplate = fs.readFileSync(
  path.resolve(__dirname, '../templates/email/turnoProcesoLegal.html'),
  'utf8'
);

const cucicbaTemplate = fs.readFileSync(
  path.resolve(__dirname, '../templates/email/cucicbaTemplate.html'),
  'utf8'
);

export const getTemplateRecuperarMail = async (
  email: string,
  url: string,
  large_logo: any,
  logo: any
) => {
  const functionTemplate = Handlebars.compile(cambioMailTemplate);
  const html = functionTemplate({ email, url, large_logo, logo });

  return html;
};

export const getTemplateRecuperarContrasenia = async (
  email: string,
  url: string,
  logo: any,
  large_logo: any
) => {
  const functionTemplate = Handlebars.compile(recuperarContraseniaTemplate);
  const html = functionTemplate({ email, url, logo, large_logo });

  return html;
};

export const getTemplateConfirmacion = async (
  email: string,
  nombre: string,
  apellido: string,
  url: string,
  logo: any,
  large_logo: any
) => {
  const functionTemplate = Handlebars.compile(confirmacionTemplate);
  const html = functionTemplate({
    email,
    nombre,
    apellido,
    url,
    logo,
    large_logo
  });

  return html;
};

export const getTemplateTurno = async (
  nombre: string,
  tipo: string,
  inicioHora: string,
  inicioDia: string,
  logo: any,
  large_logo: any
) => {
  const functionTemplate = Handlebars.compile(turnoTemplate);
  const html = functionTemplate({
    nombre,
    tipo,
    inicioHora,
    inicioDia,
    logo,
    large_logo
  });

  return html;
};

export const getTemplapeTurnoProcesoLegal = async (
  nombre: string,
  tipo: string,
  inicioHora: string,
  inicioDia: string,
  logo: any,
  large_logo: any
) => {
  const functionTemplate = Handlebars.compile(turnoProcesoLegalTemplate);
  const html = functionTemplate({
    nombre,
    tipo,
    inicioHora,
    inicioDia,
    logo,
    large_logo
  });

  return html;
};

export const getTemplateNotificacion = async (
  title: string,
  description: string,
  logo: any,
  large_logo: any,
  other?: any
) => {
  const functionTemplate = Handlebars.compile(notificacion);
  const html = functionTemplate({
    title,
    description,
    logo,
    large_logo,
    other
  });

  return html;
};

export const getCucicbaTemplate = async ({
  title,
  text,
  logo,
  large_logo,
  other
}: {
  title: string;
  text: string;
  logo: any;
  large_logo: any;
  other?: any;
}) => {
  const functionTemplate = Handlebars.compile(cucicbaTemplate);
  const html = functionTemplate({
    title,
    text,
    logo,
    large_logo,
    other
  });

  return html;
};

export const getTemplateConfirmacionEvento = async (
  email: string,
  tipoEvento: string,
  tipoTramite: string,
  fecha: any,
  url: string,
  logo: any,
  large_logo: any
) => {
  const functionTemplate = Handlebars.compile(confirmacionEventoTemplate);
  const html = functionTemplate({
    email,
    tipoEvento,
    tipoTramite,
    url,
    fecha,
    logo,
    large_logo
  });

  return html;
};
