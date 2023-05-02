import {
  EstadoFiscalizacion,
  EstadoInput,
  InputsValueFiscalizacion
} from '@prisma/client';
import prisma from '../config/db';
import { InputName } from '../data/seed/inputs/inputs';
import caratulaServices from '../services/caratula.services';
import carpetaServices from '../services/carpeta.services';
import documentoServices from '../services/documento.services';
import expedienteServices from '../services/expediente.services';
import fiscalizacionServices from '../services/fiscalizacion.services';
import inputValuesFiscalizacionServices from '../services/inputValuesFiscalizacion.services';
import usersServices from '../services/users.services';
import Exception from '../utils/Exception';
import { registroHistorial } from '../utils/registrarHistorial';
import fs from 'fs';
import tramiteServices from '../services/tramite.services';
import tramites from '../data/tramites';

export interface IInputsValuesFiscalizacion extends InputsValueFiscalizacion {
  inputNombre: InputName;
}

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class InputsValuesFiscalizacionValidator {
  async upsertMany({
    arrInputs,
    fiscalizacionId,
    usuarioId
  }: {
    arrInputs: IInputsValuesFiscalizacion[];
    fiscalizacionId: number;
    usuarioId: number;
  }) {
    if (!fiscalizacionId) {
      throw new Exception('El fiscalizacionId es requerido');
    }
    if (!usuarioId) {
      throw new Exception('El usuarioId es requerido');
    }

    const fiscalizacion = await fiscalizacionServices.findById(fiscalizacionId);

    if (!fiscalizacion) {
      throw new Exception('La fiscalización no existe');
    }

    const expediente = await expedienteServices.findByIdConCarpeta(
      fiscalizacion.expedienteId
    );

    if (!expediente) {
      throw new Exception('El expediente no existe');
    }

    let matriculado = false;
    if (fiscalizacion.estado === EstadoFiscalizacion.pendiente) {
      for (const input of arrInputs.filter(
        (i) => i.inputNombre !== 'estadoFiscalizacion'
      )) {
        await inputValuesFiscalizacionServices.upsert(input, false);
        if (input.inputNombre === 'matriculado') {
          if (input.value) {
            const matriculadoDB = await usersServices.findById(
              Number(input.value)
            );

            if (matriculadoDB) {
              const denunciaDB = await prisma.denuncia.findUnique({
                where: {
                  id: expediente.denunciaId
                }
              });

              const info = denunciaDB?.info as any;

              const denuncia = await prisma.denuncia.update({
                where: {
                  id: expediente.denunciaId
                },
                data: {
                  info: {
                    ...info,
                    denunciadoMatriculado: matriculadoDB.id
                  },
                  nombreDenunciado: matriculadoDB.nombre,
                  apellidoDenunciado: matriculadoDB.apellido
                }
              });

              const expteDB = await expedienteServices.findById(expediente.id);
              let titulo: string = '';
              if (expteDB.caratula && expteDB.tramitePadreId) {
                const tramiteDB = await tramiteServices.findById(
                  expteDB.tramitePadreId
                );
                if (tramiteDB.tipo.tipo === 'denuncia') {
                  if (
                    tramiteDB.tipo.id === tramites.denunciaPorCucicba ||
                    tramiteDB.tipo.id === tramites.denunciaCucicbaFiscalizacion
                  ) {
                    titulo = `CUCICBA C/ ${denuncia.nombreDenunciado} ${denuncia.apellidoDenunciado} S/ PRESUNTA INFRACCIÓN`;
                  } else if (tramiteDB.carpeta?.usuarioId) {
                    titulo = `${denuncia.nombreDenunciante} ${denuncia.apellidoDenunciante} C/ ${denuncia.nombreDenunciado} ${denuncia.apellidoDenunciado} S/ DENUNCIA`;
                  } else {
                    titulo = `CUCICBA C/ ${denuncia.nombreDenunciado} ${denuncia.apellidoDenunciado} S/ DENUNCIA`;
                  }
                }
                await caratulaServices.update({
                  caratulaId: Number(expteDB.caratula?.id),
                  data: {
                    denunciado: `${matriculadoDB.nombre} ${matriculadoDB.apellido}`,
                    titulo
                  }
                });
              }

              let carpetaActiva = await carpetaServices.findCarpetaActiva(
                matriculadoDB.id
              );

              if (!carpetaActiva) {
                carpetaActiva = await carpetaServices.create({
                  usuarioId: matriculadoDB.id,
                  descripcion: 'Carpeta de Trámites'
                });
              }

              await prisma.expediente.update({
                where: {
                  id: expediente.id
                },
                data: {
                  carpeta: {
                    connect: {
                      id: carpetaActiva.id
                    }
                  }
                }
              });
            }
            matriculado = true;

            // Cambiar los archivos de lugar y cambiar los path en la db
            // fs.renameSync(`${process.env.SERVER_URL}/public/`)
          } else {
            await prisma.expediente.update({
              where: {
                id: expediente.id
              },
              data: {
                carpeta: {
                  disconnect: true
                }
              }
            });
          }
        }

        if (
          input.inputNombre === 'nombreDenunciado' &&
          input.value &&
          !matriculado
        ) {
          await prisma.denuncia.update({
            where: {
              id: expediente.denunciaId
            },
            data: {
              nombreDenunciado: input.value
            }
          });
        }

        if (
          input.inputNombre === 'apellidoDenunciado' &&
          input.value &&
          !matriculado
        ) {
          await prisma.denuncia.update({
            where: {
              id: expediente.denunciaId
            },
            data: {
              apellidoDenunciado: input.value
            }
          });
        }
      }

      const estadoFiscalizacion = arrInputs.find(
        (i) => i.inputNombre === 'estadoFiscalizacion'
      );

      if (estadoFiscalizacion) {
        if (
          estadoFiscalizacion.value === 'pendiente' &&
          expediente.fiscalizaciones.some(
            (fiscalizacion) =>
              fiscalizacion.estado === 'pendiente' &&
              fiscalizacion.id !== fiscalizacionId
          )
        ) {
          throw new Exception(
            'No se puede cambiar el estado a pendiente porque ya hay una fiscalización activa'
          );
        }

        if (estadoFiscalizacion.value === EstadoFiscalizacion.finalizada) {
          await registroHistorial({
            titulo: `Finalización de fiscalización ${fiscalizacion.titulo}`,
            descripcion: `Finalizó la Fiscalización <strong>${fiscalizacion.titulo}</strong> del Expediente Nro <strong>${expediente.id}</strong>`,
            usuarioId,
            expedienteId: expediente.id
          });

          await registroHistorial({
            titulo: `Finalización de fiscalización ${fiscalizacion.titulo}`,
            descripcion: `Finalizó la Fiscalización <strong>${fiscalizacion.titulo}</strong> del Expediente Nro <strong>${expediente.id}</strong>`,
            usuarioId,
            expedienteId: expediente.id,
            fiscalizacionId: fiscalizacion.id
          });
        } else {
          await registroHistorial({
            titulo: `Envío datos para la fiscalizacion ${fiscalizacion.titulo}`,
            descripcion: `Se envió datos para la fiscalización ${
              fiscalizacion.titulo
            } del Expediente Nro <strong>${
              expediente.numeroLegales ? `${expediente.numeroLegales}` : ''
            } ${
              expediente.numeroFiscalizacion && expediente.numeroLegales
                ? '/'
                : ''
            }$
            ${
              expediente.numeroFiscalizacion
                ? `${expediente.numeroFiscalizacion}`
                : ''
            }</strong>.`,
            usuarioId,
            expedienteId: expediente.id
          });

          await registroHistorial({
            titulo: `Envío datos para la fiscalizacion ${fiscalizacion.titulo}`,
            descripcion: `Se envió datos para la fiscalización ${
              fiscalizacion.titulo
            } del Expediente Nro <strong>${
              expediente.numeroLegales ? `${expediente.numeroLegales}` : ''
            }${
              expediente.numeroFiscalizacion && expediente.numeroLegales
                ? '/'
                : ''
            }$
            ${
              expediente.numeroFiscalizacion
                ? `${expediente.numeroFiscalizacion}`
                : ''
            }</strong>.`,
            usuarioId,
            expedienteId: expediente.id,
            fiscalizacionId: fiscalizacion.id
          });
        }

        await fiscalizacionServices.update({
          id: fiscalizacionId,
          data: { estado: estadoFiscalizacion.value as EstadoFiscalizacion }
        });

        await inputValuesFiscalizacionServices.upsert(
          estadoFiscalizacion,
          false
        );
      }

      return fiscalizacion;
    } else {
      throw new Exception(
        `No se puede modificar el Formulario porque la Fiscalización se encuentra ${fiscalizacion.estado} `
      );
    }
  }

  async archivo({
    inputNombre,
    expedienteId,
    fiscalizacionId,
    userId,
    estado,
    filename,
    borrarAnteriores = false
  }: {
    inputNombre: string;
    expedienteId: number;
    userId: number;
    estado: string;
    filename: string;
    borrarAnteriores: boolean;
    fiscalizacionId: number;
  }) {
    if (!inputNombre) {
      throw new Exception('El id del input es requerido');
    }

    if (!expedienteId) {
      throw new Exception('El id expediente es requerido');
    }

    if (!userId) {
      throw new Exception('El userId es requerido');
    }

    if (!estado) {
      throw new Exception('El estado es requerido');
    }

    if (borrarAnteriores) {
      await documentoServices.deleteByInputValueExpediente(
        inputNombre,
        expedienteId
      );
    }

    const archivoGuardado = await inputValuesFiscalizacionServices.archivo(
      inputNombre,
      expedienteId,
      estado as EstadoInput
    );

    await documentoServices.createInput({
      userId,
      filename,
      inputNombre,
      fiscalizacionId,
      expedienteId
    });

    return archivoGuardado;
  }
}

export default new InputsValuesFiscalizacionValidator();
