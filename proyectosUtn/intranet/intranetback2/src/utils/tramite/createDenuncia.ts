import prisma from '../../config/db';
import { ITramite } from '../../interfaces/tramite.interface';

export const createDenuncia = async ({
  tramite,
  esCucicba
}: {
  tramite: ITramite;
  esCucicba: boolean;
}) => {
  const inputValues = await prisma.inputsValues.findMany({
    where: {
      inputNombre: {
        in: [
          'nombre',
          'apellido',
          'dni',
          'mailParticular',
          'telefonoParticular',
          'domicilioReal',
          'codigoPostalReal',
          'motivoDenuncia',
          'nombreDenunciado',
          'apellidoDenunciado',
          'dniDenunciado',
          'telefonoDenunciado',
          'mailDenunciado',
          'domicilioDenunciado',
          'archivoDenuncia'
        ]
      },
      tramiteId: tramite.id
    },
    include: {
      archivos: true
    }
  });

  const motivo = inputValues.find(
    (input) => input.inputNombre === 'motivoDenuncia'
  )?.value;

  const denunciante = {
    nombreDenunciante: esCucicba
      ? 'Cucicba'
      : inputValues.find((input) => input.inputNombre === 'nombre')?.value,
    apellidoDenunciante: inputValues.find(
      (input) => input.inputNombre === 'apellido'
    )?.value,
    dniDenunciante: inputValues.find((input) => input.inputNombre === 'dni')
      ?.value,
    mailDenunciante: inputValues.find(
      (input) => input.inputNombre === 'mailParticular'
    )?.value,
    telefonoDenunciante: inputValues.find(
      (input) => input.inputNombre === 'telefonoParticular'
    )?.value,
    domicilioDenunciante: inputValues.find(
      (input) => input.inputNombre === 'domicilioReal'
    )?.value,
    codigoPostalDenunciante: inputValues.find(
      (input) => input.inputNombre === 'codigoPostalReal'
    )?.value
  };

  const denunciado = {
    nombreDenunciado: inputValues.find(
      (input) => input.inputNombre === 'nombreDenunciado'
    )?.value,
    apellidoDenunciado: inputValues.find(
      (input) => input.inputNombre === 'apellidoDenunciado'
    )?.value,
    dniDenunciado: inputValues.find(
      (input) => input.inputNombre === 'dniDenunciado'
    )?.value,
    mailDenunciado: inputValues.find(
      (input) => input.inputNombre === 'mailDenunciado'
    )?.value,
    telefonoDenunciado: inputValues.find(
      (input) => input.inputNombre === 'telefonoDenunciado'
    )?.value,
    domicilioDenunciado: inputValues.find(
      (input) => input.inputNombre === 'domicilioDenunciado'
    )?.value,
    codigoPostalDenunciado: inputValues.find(
      (input) => input.inputNombre === 'codigoPostalDenunciado'
    )?.value
  };

  if (tramite.info.denunciado) {
    const denunciadoDB = await prisma.usuario.findUnique({
      where: {
        id: tramite.info.denunciado
      }
    });

    denunciado.nombreDenunciado = denunciadoDB?.nombre;
    denunciado.apellidoDenunciado = denunciadoDB?.apellido;
    denunciado.dniDenunciado = denunciadoDB?.dni;
  }

  const info: {
    [key: string]:
      | number
      | (string | undefined)[]
      | { [key: string]: string | undefined | null }
      | any;
  } = {
    archivos: inputValues
      .find((input) => input.inputNombre === 'archivoDenuncia')
      ?.archivos.map((doc) => doc.archivoUbicacion)
  };
  let contacto: any = {};

  if (tramite.carpeta?.usuarioId) {
    contacto = {
      mailDenunciante: denunciante.mailDenunciante
    };
    info['denuncianteMatriculado'] = tramite.carpeta.usuarioId;
  } else {
    contacto = {
      ...contacto,
      nombreDenunciante: denunciante.nombreDenunciante,
      apellidoDenunciante: denunciante.apellidoDenunciante,
      dniDenunciante: denunciante.dniDenunciante,
      mailDenunciante: denunciante.mailDenunciante,
      telefonoDenunciante: denunciante.telefonoDenunciante,
      domicilioDenunciante: denunciante.domicilioDenunciante,
      codigoPostalDenunciante: denunciante.codigoPostalDenunciante
    };
  }

  if (tramite.info.denunciado) {
    info['denunciadoMatriculado'] = tramite.info.denunciado;
  } else {
    contacto = {
      ...contacto,
      nombreDenunciado: denunciado.nombreDenunciado,
      apellidoDenunciado: denunciado.apellidoDenunciado,
      dniDenunciado: denunciado.dniDenunciado,
      mailDenunciado: denunciado.mailDenunciado,
      telefonoDenunciado: denunciado.telefonoDenunciado,
      domicilioDenunciado: denunciado.domicilioDenunciado,
      codigoPostalDenunciado: denunciado.codigoPostalDenunciado
    };
  }

  info['contacto'] = contacto;

  if (
    denunciado.nombreDenunciado &&
    denunciado.apellidoDenunciado &&
    denunciante.nombreDenunciante &&
    motivo
  ) {
    return prisma.denuncia.create({
      data: {
        nombreDenunciado: denunciado.nombreDenunciado,
        apellidoDenunciado: denunciado.apellidoDenunciado,
        dniDenunciado: denunciado.dniDenunciado,

        nombreDenunciante: denunciante.nombreDenunciante,
        apellidoDenunciante: denunciante.apellidoDenunciante,
        dniDenunciante: denunciante.dniDenunciante,

        motivo: motivo,
        info
      }
    });
  } else {
    throw new Error('Faltan datos para crear la denuncia');
  }
};
