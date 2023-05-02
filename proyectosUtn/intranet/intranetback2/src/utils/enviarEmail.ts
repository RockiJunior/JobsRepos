import { createTransport } from 'nodemailer';
import usersServices from '../services/users.services';
import {
  getTemplateConfirmacion,
  getTemplateConfirmacionEvento,
  getTemplateNotificacion,
  getTemplateRecuperarContrasenia,
  getTemplateTurno,
  getTemplapeTurnoProcesoLegal,
  getCucicbaTemplate,
  getTemplateRecuperarMail
} from './getTemplateEmail';
import dayjs from 'dayjs';
import CryptoJS from 'crypto-js';
import getBase64ImageFromURL from './pdf/getBase64';
import matriculaServices from '../services/matricula.services';
import tramites from '../data/tramites';
import tramiteServices from '../services/tramite.services';
import { IInputValue, ITramite } from '../interfaces/tramite.interface';
import {
  IExpediente,
  IProcesoLegales
} from '../interfaces/expediente.interface';
import { IDatos } from '../interfaces/users.interface';
import prisma from '../config/db';
import { InputsValues } from '@prisma/client';
import path from 'path';
import procesoLegalesServices from '../services/procesoLegales.services';
import expedienteServices from '../services/expediente.services';
import denunciaServices from '../services/denuncia.services';

declare const process: {
  env: {
    CRYPTO_SECRET: string;
    MAIL_USER: string;
    MAIL_PASS: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_SECURITY: string;
    PORTAL_URL: string;
    INTRANET_URL: string;
    SERVER_URL: string;
  };
};

const mailConfig = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secureConnection: process.env.MAIL_SECURITY === 'true' ? true : false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
};

export const ProbarMail = async () => {
  const mailTransporter = createTransport(mailConfig);

  const mailDetails = {
    from: 'info@colegioinmobiliario.org.ar',
    to: 'luanklett@gmail.com',
    subject: 'Verificacion de cuenta',
    text: 'Confirmar email'
  };

  await mailTransporter.sendMail(mailDetails);
};

export const SolicitudCambioMail = async (email: string, usuarioId: number) => {
  const mailTransporter = createTransport(mailConfig);

  const encryptUserId = CryptoJS.AES.encrypt(
    usuarioId.toString(),
    process.env.CRYPTO_SECRET
  )
    .toString()
    .replaceAll('+', 'xMl3Jk')
    .replaceAll('/', 'Por21Ld')
    .replaceAll('=', 'Ml32');

  const encryptMail = CryptoJS.AES.encrypt(email, process.env.CRYPTO_SECRET)
    .toString()
    .replaceAll('+', 'xMl3Jk')
    .replaceAll('/', 'Por21Ld')
    .replaceAll('=', 'Ml32');

  const url = `${process.env.PORTAL_URL}/confirmar-cambio-mail/${encryptUserId}/${encryptMail}`;

  const large_logo = await getBase64ImageFromURL(
    `${process.env.SERVER_URL}/assets/img/large_logo.png`
  );
  const logo = await getBase64ImageFromURL(
    `${process.env.SERVER_URL}/assets/img/logo.png`
  );

  const mailDetails = {
    from: 'info@colegioinmobiliario.org.ar',
    to: email,
    subject: 'Restablecer Email',
    text: 'Restablecer Email',
    html: await getTemplateRecuperarMail(email, url, large_logo, logo)
  };

  await mailTransporter.sendMail(mailDetails);

  return;
};

export const RecuperarContrasenia = async (
  email: string,
  intranet: boolean
) => {
  const mailTransporter = createTransport(mailConfig);

  const encryptEmail = CryptoJS.AES.encrypt(email, process.env.CRYPTO_SECRET)
    .toString()
    .replaceAll('+', 'xMl3Jk')
    .replaceAll('/', 'Por21Ld')
    .replaceAll('=', 'Ml32');

  const url = `${
    intranet ? process.env.INTRANET_URL : process.env.PORTAL_URL
  }/recuperar-contrasenia/${encryptEmail}`;

  const large_logo = await getBase64ImageFromURL(
    `${process.env.SERVER_URL}/assets/img/large_logo.png`
  );
  const logo = await getBase64ImageFromURL(
    `${process.env.SERVER_URL}/assets/img/logo.png`
  );

  const mailDetails = {
    from: 'info@colegioinmobiliario.org.ar',
    to: email,
    subject: 'Recuperar Contraseña',
    text: 'Recuperar Contraseña',
    html: await getTemplateRecuperarContrasenia(email, url, logo, large_logo)
  };

  mailTransporter.sendMail(mailDetails);
};

export const Confirmacion = async (
  email: string,
  nombre: string,
  apellido: string
) => {
  try {
    const mailTransporter = createTransport(mailConfig);

    const encryptEmail = CryptoJS.AES.encrypt(email, process.env.CRYPTO_SECRET)
      .toString()
      .replaceAll('+', 'xMl3Jk')
      .replaceAll('/', 'Por21Ld')
      .replaceAll('=', 'Ml32');

    const url = `${process.env.PORTAL_URL}/validar-email/${encryptEmail}`;

    const large_logo = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/large_logo.png`
    );
    const logo = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/logo.png`
    );

    const mailDetails = {
      from: 'info@colegioinmobiliario.org.ar',
      to: email,
      subject: 'Verificacion de cuenta',
      text: 'Confirmar email',
      html: await getTemplateConfirmacion(
        email,
        nombre,
        apellido,
        url,
        logo,
        large_logo
      )
    };

    mailTransporter.sendMail(mailDetails);
  } catch (error) {
    console.log(error);
  }
};

export const detallesTurno = async ({
  usuarioId,
  tramiteId,
  procesoLegalesId,
  inicio
}: {
  usuarioId: number;
  tramiteId?: number;
  procesoLegalesId?: number;
  inicio: Date;
}) => {
  try {
    const mailTransporter = createTransport(mailConfig);

    const user = await usersServices.findById(usuarioId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const inicioHora = dayjs(inicio).format('HH:mm');
    const inicioDia = dayjs(inicio).format('DD-MM-YYYY');

    const large_logo = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/large_logo.png`
    );
    const logo = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/logo.png`
    );

    let email: string | undefined | null = '';
    let userId: string | number | undefined = '';
    let nombre: string | undefined | null;
    let apellido: string | undefined | null;
    let datos: InputsValues[] | undefined;
    let tipo: string | undefined;
    let html: string | undefined;

    function instanceOfITramite(object: any): object is ITramite {
      return 'secciones' in object.tipo;
    }
    if (tramiteId) {
      const tramite = await tramiteServices.findById(tramiteId);

      if (!tramite) {
        throw new Error('Tramite no encontrado');
      }
      if (instanceOfITramite(tramite)) {
        datos = await prisma.inputsValues.findMany({
          where: {
            tramiteId: tramite.id,
            inputNombre: {
              in: [
                'mailParticularSolicitante',
                'nombreSolicitante',
                'apellidoSolicitante'
              ]
            }
          }
        });
      }

      if (datos?.length === 0 && instanceOfITramite(tramite)) {
        datos = await prisma.inputsValues.findMany({
          where: {
            tramiteId: tramite.id,
            inputNombre: {
              in: ['mailParticular', 'nombre', 'apellido']
            }
          }
        });
      }

      if (datos) {
        datos.forEach((dato) => {
          if (
            dato.inputNombre === 'mailParticularSolicitante' ||
            dato.inputNombre === 'mailParticular'
          ) {
            email = dato.value;
          }
          if (
            dato.inputNombre === 'nombreSolicitante' ||
            dato.inputNombre === 'nombre'
          ) {
            nombre = dato.value;
          }
          if (
            dato.inputNombre === 'apellidoSolicitante' ||
            dato.inputNombre === 'apellido'
          ) {
            apellido = dato.value;
          }
        });
      }
      tipo = tramite.tipo.titulo;
      html = await getTemplateTurno(
        `${nombre} ${apellido}`,
        tipo,
        inicioHora,
        inicioDia,
        logo,
        large_logo
      );
    } else if (procesoLegalesId) {
      const procesoLegal = await procesoLegalesServices.findById(
        procesoLegalesId
      );
      if (!procesoLegal) {
        throw new Error('Proceso Legal no encontrado');
      }
      const expediente = await expedienteServices.findById(
        procesoLegal.expedienteId
      );
      if (!expediente) {
        throw new Error('Expediente no encontrado');
      }

      const info = expediente.denuncia?.info as {
        [key: string]: { [key: string]: string };
      };

      if (info) {
        console.log(info);
        console.log(expediente.denuncia);
        if (info.contacto) {
          email = info.contacto.mailDenunciante;
          nombre = info.contacto.nombreDenunciante;
          apellido = info.contacto.apellidoDenunciante;
          tipo = 'ratificar tu denuncia';
          html = await getTemplapeTurnoProcesoLegal(
            `${nombre} ${apellido}`,
            tipo,
            inicioHora,
            inicioDia,
            logo,
            large_logo
          );
        } else {
          console.log(info);
        }
      }
    }

    if (!email) throw new Error('Email no encontrado');

    const mailDetails = {
      from: 'info@colegioinmobiliario.org.ar',
      to: email,
      subject: 'Detalles del Turno',
      text: 'Confirmar email',
      html
    };

    mailTransporter.sendMail(mailDetails);
  } catch (error) {
    console.log(error);
  }
};

export const ConfirmacionEvento = async ({
  tramiteId,
  tipoEvento,
  tipoTramite,
  fecha
}: {
  tramiteId: number;
  tipoEvento: string;
  tipoTramite: string;
  fecha: Date;
}) => {
  try {
    const mailTransporter = createTransport(mailConfig);

    const tramiteDB = await tramiteServices.findById(tramiteId);

    if (!tramiteDB) {
      return;
    }

    // const datosMailParaMail: string[] = ['mailParticular'];
    // const datosMail: { [key: string]: string | null } = {};

    // for (const dato of datosMailParaMail) {
    //   for (const seccion of tramiteDB.tipo.secciones) {
    //     for (const input of seccion.inputs) {
    //       if (input.nombre === dato) {
    //         const inputValue = input.InputValues as IInputValue;

    //         datosMail[input.nombre] = inputValue.value;
    //       }
    //     }
    //   }
    // }

    // if (!datosMail.mailParticular) return;

    const inputValueEmail = await prisma.inputsValues.findUnique({
      where: {
        tramiteId_inputNombre: {
          inputNombre: 'mailParticular',
          tramiteId: tramiteId
        }
      }
    });

    const email = inputValueEmail?.value;

    if (!email) return;

    const date = {
      inicioHora: dayjs(fecha).format('HH:mm'),
      inicioDia: dayjs(fecha).format('DD-MM-YYYY')
    };

    const large_logo = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/large_logo.png`
    );
    const logo = await getBase64ImageFromURL(
      `${process.env.SERVER_URL}/assets/img/logo.png`
    );

    const mailDetails = {
      from: 'info@colegioinmobiliario.org.ar',
      to: email,
      subject: 'Asistencia a Evento',
      text: 'Confirmar Asistencia',
      html: await getTemplateConfirmacionEvento(
        email,
        tipoEvento,
        tipoTramite,
        date,
        `${process.env.PORTAL_URL}/eventos`,
        logo,
        large_logo
      )
    };

    mailTransporter.sendMail(mailDetails);
  } catch (error) {
    console.log(error);
  }
};

// const getDatoTramite = (
//   datosNecesarios: string[],
//   tramite: ITramite
// ): IDatos => {
//   const datos: IDatos = {};

//   for (const dato of datosNecesarios) {
//     for (const seccion of tramite.tipo.secciones) {
//       for (const input of seccion.inputs) {
//         if (input.nombre === dato) {
//           if (input.InputValues?.value) {
//             datos[input.nombre] = { value: input.InputValues.value };
//           }
//         }
//       }
//     }
//   }

//   return datos;
// };

// const getDatoExpediente = (
//   datosNecesarios: string[],
//   expediente: IExpediente
// ): IDatos => {
//   const datos: IDatos = {};

//   if (expediente.carpeta) {
//     datos['mailParticular'] = { value: expediente.carpeta.usuario.email };
//   }

//   for (const dato of datosNecesarios) {
//     for (const seccion of expediente.fiscalizaciones[
//       expediente.fiscalizaciones.length - 1
//     ].tipo.secciones) {
//       for (const input of seccion.inputs) {
//         if (input.nombre === dato) {
//           if (input.inputValueFiscalizacion?.value) {
//             datos[input.nombre] = {
//               value: input.inputValueFiscalizacion.value
//             };
//           }
//         }
//       }
//     }
//   }

//   return datos;
// };

export const sendMail = async ({
  email,
  title,
  text,
  other
}: {
  email: string;
  title: string;
  text: string;
  other?: any;
}) => {
  const mailTransporter = createTransport(mailConfig);

  const logo = await getBase64ImageFromURL(
    `${process.env.SERVER_URL}/assets/img/logo.png`
  );
  const large_logo = await getBase64ImageFromURL(
    `${process.env.SERVER_URL}/assets/img/large_logo.png`
  );

  const mailDetails = {
    from: 'info@colegioinmobiliario.org.ar',
    to: email,
    subject: title,
    html: await getCucicbaTemplate({
      large_logo,
      logo,
      text,
      title
    })
  };

  mailTransporter.sendMail(mailDetails);

  return;
};

export const notificacionMail = async ({
  type,
  tramite,
  condition
}: {
  type: string;
  tramite: ITramite | IExpediente | IProcesoLegales;
  condition: string;
}) => {
  function instanceOfITramite(object: any): object is ITramite {
    return 'tipo' in object.tipo;
  }
  function instanceOfIExpediente(object: any): object is IExpediente {
    return 'fiscalizaciones' in object;
  }

  try {
    let canSendMail = true;
    let other = {};

    if (condition) {
      switch (condition) {
        case 'withEmployee':
          if (instanceOfITramite(tramite) && !tramite.empleadoId) {
            canSendMail = false;
          } else if (
            instanceOfIExpediente(tramite) &&
            !tramite.empleadosAsignados.length
          ) {
            canSendMail = false;
          }
          break;

        case 'approveTramite':
          if (instanceOfITramite(tramite)) {
            if (tramite.tipo.id === tramites.bajaProfesionalPorFallecimiento) {
              canSendMail = false;
            }
          }

          break;

        case 'mail':
          canSendMail = true;
          break;

        case 'mailDoble':
          canSendMail = true;
          break;

        default:
          canSendMail = false;
          break;
      }
    }

    if (canSendMail) {
      let description = '';
      let title = '';
      let email: string | string[] | undefined | null;
      let userId: number | undefined | null;
      let attachments: Object[] = [];

      // function instanceOfITramite(object: any): object is ITramite {
      //   return 'secciones' in object.tipo;
      // }

      // function instanceOfIExpediente(object: any): object is IExpediente {
      //   return 'carpeta' in object;
      // }

      // if (instanceOfITramite(tramite)) {
      //   email = getDatoTramite(['mailParticularSolicitante'], tramite)
      //     ?.mailParticularSolicitante?.value;
      // } else if (instanceOfIExpediente(tramite)) {
      //   if (condition === 'mailDoble') {
      //     email = getDatoExpediente(['mailParticular', ''], tramite)
      //       ?.mailParticular?.value;
      //   } else {
      //     email = getDatoExpediente(['mailParticular'], tramite)
      //       ?.mailParticularSolicitante?.value;
      //   }
      // }

      // if (!email && tramite.carpeta) {
      //   const user = await usersServices.findById(tramite.carpeta.usuarioId);
      //   email = user?.email;
      //   userId = user?.id;
      // } else if (
      //   instanceOfITramite(tramite) &&
      //   tramite.tipo.id === tramites.presentacionesReclamos
      // ) {
      //   email = getDatoTramite(['mailParticular'], tramite)?.mailParticular
      //     ?.value;
      // }

      if (type === 'mailDoble') {
        if (instanceOfIExpediente(tramite)) {
          const inputValueEmail = await prisma.inputsValues.findMany({
            where: {
              inputNombre: {
                in: ['mailParticularSolicitante', 'mailParticular']
              }
            }
          });

          email = inputValueEmail.map((input) =>
            input.value ? input.value : ''
          );
        }
      } else {
        if (instanceOfITramite(tramite)) {
          const inputValueEmail = await prisma.inputsValues.findUnique({
            where: {
              tramiteId_inputNombre: {
                inputNombre: 'mailParticularSolicitante',
                tramiteId: tramite.id
              }
            }
          });
          email = inputValueEmail?.value;
        }

        if (instanceOfIExpediente(tramite)) {
          const expedienteEmail = tramite.carpeta?.usuario.email;
          email = expedienteEmail;
        }

        if (!email && instanceOfITramite(tramite)) {
          const inputValueEmail = await prisma.inputsValues.findUnique({
            where: {
              tramiteId_inputNombre: {
                inputNombre: 'mailParticular',
                tramiteId: tramite.id
              }
            }
          });
          email = inputValueEmail?.value;
        }
      }

      if (!email) throw new Error('Email no encontrado');

      switch (type) {
        case 'requestChange':
          if (instanceOfITramite(tramite)) {
            title = 'Solicitud de modificacion';
            description = `Estimado usuario: Se solicita que modifiques los datos de tu tramite de ${tramite.tipo.titulo}.`;
            other = {
              button: true,
              buttonText: 'Ver Tramite',
              buttonLink: `${process.env.PORTAL_URL}/tramites/${tramite.id}`
            };
          }
          break;

        case 'reprogramarTurno':
          if (instanceOfITramite(tramite)) {
            title = 'Solicitud de reprogramación de turno';
            description = `Estimado/a usuario: Se solicita que reprogrames el turno de tu tramite de ${tramite.tipo.titulo}. Puedes hacerlo desde la plataforma ingresando al siguiente link:`;
            other = {
              button: true,
              buttonText: 'Ver Tramite',
              buttonLink: `${process.env.PORTAL_URL}/tramites/${tramite.id}`
            };
          }
          break;

        case 'approvedData':
          if (instanceOfITramite(tramite)) {
            title = 'Tus datos fueron aprobados';
            description = `Se aprobaron los datos de tu trámite de ${tramite.tipo.titulo}. Necesitás sacar turno para presentar la documentación de manera física en la plataforma. Podés acceder por el siguiente link:`;

            other = {
              button: true,
              buttonText: 'Sacar Turno',
              buttonLink: `${process.env.PORTAL_URL}/tramites/${tramite.id}`
            };
          }
          break;

        case 'approvedTurno':
          if (instanceOfITramite(tramite)) {
            title = 'Tus datos fueron aprobados';
            description = `Se aprobaron los datos físicos de tu trámite de ${tramite.tipo.titulo}. Se te informará como continúa el trámite por este medio.`;
          }
          break;

        case 'approvedProcedure':
          if (instanceOfITramite(tramite)) {
            title = 'El Honorable Consejo Directivo aprobó tu trámite';
            description = `El Honorable Consejo Directivo aprobó tu trámite de ${tramite.tipo.titulo}. Deberás abonar los gastos administrativos para finalizar tu trámite. Podés acceder por el siguiente link:`;
            other = {
              button: true,
              buttonText: 'Abonar Gastos',
              buttonLink: `${process.env.PORTAL_URL}/tramites/${tramite.id}`
            };

            attachments = [
              {
                filename: 'formulario_fianza_2023.docx',
                path: `${process.env.SERVER_URL}/assets/archivos_altaMatriculacion/formulario_fianza_2023.docx`
              },
              {
                filename: 'nuevo_cuadro_aranceles_2023.docx',
                path: `${process.env.SERVER_URL}/assets/archivos_altaMatriculacion/nuevo_cuadro_aranceles_2023.docx`
              },
              {
                filename: 'plan_b_122.000_2023.docx',
                path: `${process.env.SERVER_URL}/assets/archivos_altaMatriculacion/plan_b_122.000_2023.docx`
              },
              {
                filename: 'plan_c_152.500_2023.docx',
                path: `${process.env.SERVER_URL}/assets/archivos_altaMatriculacion/plan_c_152.500_2023.docx`
              },
              {
                filename: 'plan_d_165.600_2023.docx',
                path: `${process.env.SERVER_URL}/assets/archivos_altaMatriculacion/plan_d_165.600_2023.docx`
              }
            ];
          }
          break;

        case 'approvedTransaction':
          if (instanceOfITramite(tramite)) {
            switch (tramite.tipo.id) {
              case tramites.certificadoFirmaCotizaciones:
                title = 'Se aprobó tu transacción';
                description = `Se aprobó tu transacción. Para continuar debes solicitar turno desde la plataforma:`;
                other = {
                  button: true,
                  buttonText: 'Ver Trámite',
                  buttonLink: `${process.env.PORTAL_URL}/tramites/${tramite.id}`
                };

                break;

              default:
                title = 'Se aprobó tu transacción';
                description = `Tu transacción fue revisada y aprobada por el Área de Finanzas.`;
                break;
            }
          }
          break;

        case 'approveTramite':
          if (instanceOfITramite(tramite)) {
            switch (tramite.tipo.id) {
              case tramites.altaMatriculacion:
                let matricula;
                if (userId) {
                  matricula = await matriculaServices.getByUserId(userId);
                }
                title = 'Se aprobó tu trámite de Alta de Matriculación';
                description = `Tu tramite de matriculación se aprobó con éxito${
                  matricula
                    ? '. Tu número de matricula es: ' + matricula.id
                    : ''
                }. Podes ver mas detalles de tu matrícula desde la plataforma:`;
                other = {
                  button: true,
                  buttonText: 'Ver Matrícula',
                  buttonLink: `${process.env.PORTAL_URL}/mis-datos`
                };
                break;

              case tramites.ddjjActividadComercial:
                title = 'Se aprobó tu trámite de Actividad Comercial';
                description =
                  'Tu trámite de Actividad Comercial se aprobó con éxito. Podrás imprimir tu oblea en la sección oblea dentro del portal de CUCIBA.';
                other = {
                  button: true,
                  buttonLink: `${process.env.PORTAL_URL}/oblea`,
                  buttonText: 'Ver Oblea'
                };
                break;

              case tramites.solicitudUserSistFidelitas:
                if (instanceOfITramite(tramite)) {
                  // const fidelitas = getDatoTramite(
                  //   ['usuarioFidelitas', 'claveFidelitas'],
                  //   tramite
                  // );
                  const inputValuesfidelitas =
                    await prisma.inputsValues.findMany({
                      where: {
                        tramiteId: tramite.id,
                        inputNombre: {
                          in: ['usuarioFidelitas', 'claveFidelitas']
                        }
                      }
                    });

                  const usuario = inputValuesfidelitas[0].value;
                  const clave = inputValuesfidelitas[1].value;

                  title =
                    'Se aprobó tu trámite de Solicitud de Usuario Fidelitas';
                  description = `Tu trámite de Solicitud de Usuario se aprobó con éxito. 
              Tu usuario y clave es: ${usuario} ${clave}.`;
                }
                break;

              case tramites.certificadoMatriculaVigente:
                title =
                  'Se aprobó tu trámite de Certificado de Matrícula Vigente';
                description =
                  'Tu trámite de Certificado de Matrícula Vigente se aprobó con éxito. Podrás verlo yendo a tu trámite desde el portal o haciendo click aqui:';
                other = {
                  button: true,
                  buttonText: 'Ver Trámite',
                  buttonLink: `${process.env.PORTAL_URL}/tramites/${tramite.id}`
                };
                break;

              case tramites.subsidioPorFallecimiento:
                if (instanceOfITramite(tramite)) {
                  // const monto = getDatoTramite(['montoSubsidio'], tramite);
                  const monto = await prisma.inputsValues.findUnique({
                    where: {
                      tramiteId_inputNombre: {
                        tramiteId: tramite.id,
                        inputNombre: 'montoSubsidio'
                      }
                    }
                  });

                  title = 'Trámite de Subsidio por Fallecimiento';
                  description = `El subsidio fue abonado por el monto $${monto?.value}`;
                }
                break;

              case tramites.denunciaPorCucicba:
              case tramites.denunciaMatriculaAOtroMatriculado:
              case tramites.denunciaExterna:
              case tramites.denunciaMesaEntrada:
                return;
                break;

              default:
                title = `Se aprobó tu trámite de ${tramite.tipo.titulo}`;
                description = `Tu trámite de ${tramite.tipo.titulo} se aprobó con éxito.`;
                break;
            }
          }
          break;

        case 'formaPago':
          if (instanceOfITramite(tramite)) {
            switch (tramite.tipo.id) {
              case tramites.subsidioPorFallecimiento:
                if (instanceOfITramite(tramite)) {
                  // const monto = getDatoTramite(['montoSubsidio'], tramite);
                  const formaPago = await prisma.inputsValues.findUnique({
                    where: {
                      tramiteId_inputNombre: {
                        tramiteId: tramite.id,
                        inputNombre: 'formaPago'
                      }
                    }
                  });
                  title = 'Trámite de Subsidio por Fallecimiento';
                  description = `Tu trámite de Subsidio por Fallecimiento se aprobó con éxito. La forma de pago del subsidio es: ${formaPago?.value}`;
                }
            }
          }

          break;

        case 'rechazado':
          title = 'Se rechazó tu trámite';
          if (instanceOfITramite(tramite)) {
            description = `Se rechazó tu trámite de ${tramite.tipo.titulo}. Para mayor información, acèrquese a las Oficinas de CUCICBA.`;
          }
          break;

        case 'procesoRechazado':
          title = 'Se rechazó tu denuncia';
          description = `Se rechazó tu denuncia.`;
          break;

        case 'archivado':
          title = 'Se archivó tu trámite';
          if (instanceOfITramite(tramite)) {
            description = `Se archivó tu trámite de ${tramite.tipo.titulo}.`;
          }
          break;

        case 'denunciaRechazada':
          title = 'Se rechazó tu denuncia';
          description = `Se rechazó tu denuncia.`;
          break;

        case 'cedula':
          title = 'Se envió una cédula de notificación';
          description = `Se envió una cédula de notificación.`;
          break;

        case 'cedulaElectronica':
          title = 'Se envió una cédula de notificación electrónica';
          if (condition === 'mailDoble') {
            description = `Se envió una cédula de notificación electrónica a tu casilla de correo institucional y a tu casilla de correo personal.`;
          } else {
            description = `Se envió una cédula de notificación electrónica.`;
          }
          break;

        case 'reclamoAprobado':
          title = 'Se aprobó tu reclamo';
          description = `Se aprobó tu reclamo con éxito.`;
          break;

        case 'linkTramiteExterno':
          title = 'Solicitud de link para Tramite';
          description = `Puedes seguir el estado de tu trámite haciendo click en el siguiente link:`;

          const encryptId = CryptoJS.AES.encrypt(
            `${tramite.id}`,
            process.env.CRYPTO_SECRET
          )
            .toString()
            .replaceAll('+', 'xMl3Jk')
            .replaceAll('/', 'Por21Ld')
            .replaceAll('=', 'Ml32');
          other = {
            button: true,
            buttonText: 'Ver Denuncia',
            buttonLink: `${process.env.PORTAL_URL}/tramite-externo/${encryptId}`
          };
          break;

        default:
          break;
      }

      const mailTransporter = createTransport(mailConfig);

      const large_logo = await getBase64ImageFromURL(
        `${process.env.SERVER_URL}/assets/img/large_logo.png`
      );
      const logo = await getBase64ImageFromURL(
        `${process.env.SERVER_URL}/assets/img/logo.png`
      );

      const mailDetails = {
        from: 'info@colegioinmobiliario.org.ar',
        to: email,
        subject: title,
        text: `Notificacion: ${title}`,
        html: await getTemplateNotificacion(
          title,
          description,
          logo,
          large_logo,
          other
        ),
        attachments
      };

      await mailTransporter.sendMail(mailDetails);
    }
  } catch (error) {
    console.log(error);
  }
};

// notificacionMailExpediente
export const notificacionMailProceso = async ({
  type,
  condition,
  expedienteId,
  procesoLegal
}: {
  type: string;
  condition: string;
  expedienteId?: number;
  procesoLegal?: IProcesoLegales;
}) => {
  let canSendMail: boolean;

  const expediente = await prisma.expediente.findUnique({
    where: {
      id: procesoLegal?.expedienteId
    }
  });

  if (!expediente) return;

  try {
    switch (condition) {
      case 'solo':
        canSendMail = true;
        break;

      case 'ambos':
        canSendMail = true;
        break;

      case 'mail':
        canSendMail = true;
        break;

      default:
        canSendMail = false;
        break;
    }

    if (canSendMail) {
      let title: string = '';
      let description: string = '';
      let email: string[] | undefined | null = [];

      const denuncia = await prisma.denuncia.findUnique({
        where: {
          id: expediente.denunciaId
        }
      });

      if (condition === 'solo') {
        const info = denuncia?.info as { [key: string]: any };

        if (info) {
          if (info.denunciadoMatriculado) {
            const user = await prisma.usuario.findUnique({
              where: {
                id: info.denunciadoMatriculado
              }
            });
            // console.log(user?.email);
            email.push(user?.email as string);
          }
        }
      } else if (condition === 'ambos') {
      }

      switch (type) {
        case 'imputaciones':
          title = 'Se agregaron imputaciones';
          description = `Se agregaron imputaciones al expediente.`;
          break;

        case 'verProcesoLegal':
          title = 'Se agregó un proceso legal';
          description = `Se agregó un proceso legal al expediente.`;
          break;

        default:
          break;
      }

      const mailTransporter = createTransport(mailConfig);

      // console.log(title, description, email);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
