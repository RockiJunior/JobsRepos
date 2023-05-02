import { EstadoExpediente, EstadoInput } from '@prisma/client';
import dayjs from 'dayjs';
import fs from 'fs';
import prisma from '../config/db';
import areas from '../data/areas';
import { IDatos } from '../interfaces/users.interface';
import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import expedienteServices from '../services/expediente.services';
import fiscalizacionServices from '../services/fiscalizacion.services';
import inputValuesFiscalizacionServices from '../services/inputValuesFiscalizacion.services';
import usersServices from '../services/users.services';
import Exception from '../utils/Exception';
import { registroHistorial } from '../utils/registrarHistorial';
import expedienteValidators from './expediente.validators';
import transaccionValidators from './transaccion.validators';

declare const process: {
  env: {
    CRYPTO_SECRET: string;
    SERVER_URL: string;
  };
};

class FiscalizacionValidator {
  async create(titulo: string, expedienteId: number, empleadoId: number) {
    if (!titulo) {
      throw new Exception('El titulo es requerido');
    }

    if (!expedienteId) {
      throw new Exception('El expediente es requerido');
    }

    const expedienteDB = await expedienteServices.findById(expedienteId);
    if (!expedienteDB) {
      throw new Exception('El expediente no existe');
    }

    const tipoFiscalizacion = await prisma.tipoFiscalizacion.findFirst();

    if (!tipoFiscalizacion) {
      throw new Exception('No hay tipos de fiscalizacion');
    }

    const fiscalizacion = await fiscalizacionServices.create(
      titulo,
      tipoFiscalizacion.id,
      expedienteId
    );

    if (expedienteDB.carpeta) {
      const usuario = await usersServices.findById(
        expedienteDB.carpeta.usuarioId
      );

      if (usuario) {
        const datos = usuario.datos as IDatos;
        if (fiscalizacion) {
          const { secciones } = fiscalizacion.tipo;

          const matricula = await prisma.matricula.findFirst({
            where: {
              usuarioId: usuario.id,
              estado: 'activo'
            }
          });

          for (const seccion of secciones) {
            const { inputs } = seccion;
            for (const input of inputs) {
              switch (input.nombre) {
                case 'numeroMatricula':
                  if (matricula) {
                    await inputValuesFiscalizacionServices.upsert(
                      {
                        fiscalizacionId: fiscalizacion.id,
                        inputNombre: input.nombre,
                        value: `${matricula.id}`,
                        estado: EstadoInput.pending,
                        comentario: null
                      },
                      false
                    );
                  }
                  break;

                case 'matriculado':
                  await inputValuesFiscalizacionServices.upsert(
                    {
                      fiscalizacionId: fiscalizacion.id,
                      inputNombre: input.nombre,
                      value: `${usuario.id}`,
                      estado: EstadoInput.pending,
                      comentario: null
                    },
                    false
                  );

                  break;

                case 'libroMatricula':
                  if (matricula) {
                    await inputValuesFiscalizacionServices.upsert(
                      {
                        fiscalizacionId: fiscalizacion.id,
                        inputNombre: input.nombre,
                        value: `${matricula.libro}`,
                        estado: EstadoInput.pending,
                        comentario: null
                      },
                      false
                    );
                  }
                  break;

                case 'tomoMatricula':
                  if (matricula) {
                    await inputValuesFiscalizacionServices.upsert(
                      {
                        fiscalizacionId: fiscalizacion.id,
                        inputNombre: input.nombre,
                        value: `${matricula.tomo}`,
                        estado: EstadoInput.pending,
                        comentario: null
                      },
                      false
                    );
                  }
                  break;

                case 'folioMatricula':
                  if (matricula) {
                    await inputValuesFiscalizacionServices.upsert(
                      {
                        fiscalizacionId: fiscalizacion.id,
                        inputNombre: input.nombre,
                        value: `${matricula.folio}`,
                        estado: EstadoInput.pending,
                        comentario: null
                      },
                      false
                    );
                  }
                  break;

                default:
                  if (datos[input.nombre]?.value) {
                    const value = datos[input.nombre].value;

                    if (value) {
                      await inputValuesFiscalizacionServices.upsert(
                        {
                          fiscalizacionId: fiscalizacion.id,
                          inputNombre: input.nombre,
                          value: value,
                          estado: EstadoInput.pending,
                          comentario: null
                        },
                        false
                      );
                    }
                  } else if (datos[input.nombre]?.archivos?.length) {
                    const archivos = datos[input.nombre].archivos;
                    if (archivos) {
                      try {
                        for (const archivo of archivos) {
                          const oldPath = archivo.replace(
                            process.env.SERVER_URL,
                            '.'
                          );

                          const destination = `./public/archivos/${usuario.id}/expedientes/${expedienteDB.id}/fiscalizaciones/${fiscalizacion.id}/`;

                          const newPath = `./public/archivos/${
                            usuario.id
                          }/expedientes/${expedienteDB.id}/fiscalizaciones/${
                            fiscalizacion.id
                          }/${input.nombre}-${dayjs().format(
                            'YYYY-MM-DD_HH.mm.ss.SSS'
                          )}${oldPath.substring(oldPath.lastIndexOf('.'))}`;

                          fs.mkdirSync(destination, { recursive: true });

                          fs.copyFileSync(oldPath, newPath);

                          await inputValuesFiscalizacionServices.upsert(
                            {
                              fiscalizacionId: fiscalizacion.id,
                              inputNombre: input.nombre,
                              value: null,
                              estado: EstadoInput.pending,
                              comentario: null
                            },
                            false
                          );

                          await documentoServices.createInput({
                            userId: usuario.id,
                            filename: newPath.substring(
                              newPath.lastIndexOf('/') + 1
                            ),
                            inputNombre: input.nombre,
                            expedienteId,
                            fiscalizacionId: fiscalizacion.id
                          });
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }
                  break;
              }
            }
          }
        }
      }
    }

    const empleado = await empleadoServices.findById(empleadoId);
    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    await registroHistorial({
      titulo: `Se creó la fiscalización ${fiscalizacion.titulo}`,
      descripcion: `Se creó la fiscalización ${
        fiscalizacion.titulo
      } para el Expediente Nro <strong>${
        expedienteDB.numeroLegales ? `${expedienteDB.numeroLegales}` : ''
      }${
        expedienteDB.numeroFiscalizacion && expedienteDB.numeroLegales
          ? '/'
          : ''
      }${
        expedienteDB.numeroFiscalizacion
          ? `${expedienteDB.numeroFiscalizacion}`
          : ''
      }</strong>.`,
      usuarioId: empleado.usuarioId,
      expedienteId: expedienteDB.id,
      fiscalizacionId: fiscalizacion.id,
      info: {
        fiscalizacionId: fiscalizacion.id,
        tipo: 'fiscalizacion'
      }
    });

    await registroHistorial({
      titulo: `Se creó la fiscalización ${fiscalizacion.titulo}`,
      descripcion: `Se creó la fiscalización ${
        fiscalizacion.titulo
      } para el Expediente Nro <strong>${
        expedienteDB.numeroLegales ? `${expedienteDB.numeroLegales}` : ''
      }${
        expedienteDB.numeroFiscalizacion && expedienteDB.numeroLegales
          ? '/'
          : ''
      }${
        expedienteDB.numeroFiscalizacion
          ? `${expedienteDB.numeroFiscalizacion}`
          : ''
      }</strong>.`,
      usuarioId: empleado.usuarioId,
      expedienteId: expedienteDB.id,
      info: {
        fiscalizacionId: fiscalizacion.id,
        tipo: 'fiscalizacion'
      }
    });

    await expedienteServices.update({
      id: expedienteId,
      data: {
        estado: EstadoExpediente.fiscalizacion_abierta
      }
    });

    return fiscalizacion;
  }

  async finalizarFiscalizacion({
    fiscalizacionId,
    usuarioId,
    tipo
  }: {
    fiscalizacionId: number;
    usuarioId: number;
    tipo: 'matriculacion' | 'transaccion' | 'informe';
  }) {
    if (!fiscalizacionId) {
      throw new Exception('El id de la fiscalización es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    if (!tipo) {
      throw new Exception('El tipo de finalizacion es requerido');
    }

    const fiscalizacion = await fiscalizacionServices.findById(fiscalizacionId);

    if (!fiscalizacion) {
      throw new Exception('La fiscalización no existe');
    }

    const expediente = await expedienteServices.findById(
      Number(fiscalizacion.expedienteId)
    );

    await expedienteServices.update({
      id: fiscalizacion.expedienteId,
      data: {
        estado: EstadoExpediente.pendiente
      }
    });

    switch (tipo) {
      case 'matriculacion':
        //falta hacer
        break;

      case 'transaccion':
        if (!fiscalizacion.transaccion) {
          throw new Exception('La fiscalización no tiene transacción asociada');
        }
        if (fiscalizacion.transaccion.estado === 'approved') {
          const fiscalizacionUpdated = await fiscalizacionServices.update({
            id: fiscalizacionId,
            data: {
              estado: 'finalizada'
            }
          });

          await registroHistorial({
            titulo: `Se finalizó la fiscalización ${fiscalizacion.titulo}`,
            descripcion: `Se finalizó la fiscalización ${
              fiscalizacion.titulo
            } para el Expediente Nro <strong>${
              expediente.numeroLegales ? `${expediente.numeroLegales}` : ''
            }${
              expediente.numeroFiscalizacion && expediente.numeroLegales
                ? '/'
                : ''
            }${
              expediente.numeroFiscalizacion
                ? `${expediente.numeroFiscalizacion}`
                : ''
            }</strong>.`,
            usuarioId,
            expedienteId: expediente.id,
            fiscalizacionId,
            info: {
              fiscalizacionId: fiscalizacion.id,
              tipo: 'fiscalizacion'
            }
          });

          await registroHistorial({
            titulo: `Se finalizó la fiscalización ${fiscalizacion.titulo}`,
            descripcion: `Se finalizó la fiscalización ${
              fiscalizacion.titulo
            } para el Expediente Nro <strong>${
              expediente.numeroLegales ? `${expediente.numeroLegales}` : ''
            }${
              expediente.numeroFiscalizacion && expediente.numeroLegales
                ? '/'
                : ''
            }${
              expediente.numeroFiscalizacion
                ? `   ${expediente.numeroFiscalizacion}`
                : ''
            }</strong>.`,
            usuarioId,
            expedienteId: expediente.id,
            info: {
              fiscalizacionId: fiscalizacion.id,
              tipo: 'fiscalizacion'
            }
          });

          return fiscalizacionUpdated;
        } else {
          throw new Exception('La transacción no está aprobada');
        }

      case 'informe':
        if (!fiscalizacion.informeFiscalizacion) {
          throw new Exception(
            'La fiscalización debe tener un informe asociado'
          );
        }
        if (expediente.carpeta?.usuarioId) {
          const fiscalizacionUpdated = await fiscalizacionServices.update({
            id: fiscalizacionId,
            data: {
              estado: 'finalizada'
            }
          });

          await registroHistorial({
            titulo: `Se finalizó la fiscalización de nombre ${fiscalizacion.titulo}`,
            descripcion: `Se finalizó la fiscalización ${
              fiscalizacion.titulo
            } para el Expediente Nro <strong>${
              expediente.numeroLegales ? `${expediente.numeroLegales}` : ''
            }${
              expediente.numeroFiscalizacion && expediente.numeroLegales
                ? '/'
                : ''
            }${
              expediente.numeroFiscalizacion
                ? `${expediente.numeroFiscalizacion}`
                : ''
            }</strong>.`,
            usuarioId,
            fiscalizacionId,
            expedienteId: expediente.id,
            info: {
              fiscalizacionId: fiscalizacion.id,
              tipo: 'fiscalizacion'
            }
          });

          await registroHistorial({
            titulo: `Se finalizó la fiscalización de nombre ${fiscalizacion.titulo}`,
            descripcion: `Se finalizó la fiscalización ${
              fiscalizacion.titulo
            } para el Expediente Nro <strong>${
              expediente.numeroLegales ? `${expediente.numeroLegales}` : ''
            }${
              expediente.numeroFiscalizacion && expediente.numeroLegales
                ? '/'
                : ''
            }${
              expediente.numeroFiscalizacion
                ? `${expediente.numeroFiscalizacion}`
                : ''
            }</strong>.`,
            usuarioId,
            expedienteId: expediente.id,
            info: {
              fiscalizacionId: fiscalizacion.id,
              tipo: 'fiscalizacion'
            }
          });

          await expedienteValidators.cambiarArea({
            expedienteId: expediente.id,
            areaId: areas.legales,
            usuarioId: usuarioId
          });
          return fiscalizacionUpdated;
        } else {
          throw new Exception('El expediente no pertenece a un matriculado');
        }
      default:
        break;
    }
  }

  async cancelarFiscalizacion({
    fiscalizacionId,
    usuarioId
  }: {
    fiscalizacionId: number;
    usuarioId: number;
  }) {
    if (!fiscalizacionId) {
      throw new Exception('El id de la fiscalización es requerido');
    }

    const fiscalizacion = await fiscalizacionServices.findById(fiscalizacionId);

    if (!fiscalizacion) {
      throw new Exception('La fiscalización no existe');
    }

    const fiscalizacionUpdated = await fiscalizacionServices.update({
      id: fiscalizacionId,
      data: {
        estado: 'cancelada'
      }
    });

    const expediente = await expedienteServices.update({
      id: fiscalizacion.expedienteId,
      data: {
        estado: EstadoExpediente.pendiente
      }
    });

    await registroHistorial({
      titulo: `Se canceló la fiscalización ${fiscalizacion.titulo}`,
      descripcion: `Se canceló la fiscalización ${
        fiscalizacion.titulo
      } para el Expediente Nro <strong>${
        expediente.numeroLegales ? `${expediente.numeroLegales}` : ''
      }${expediente.numeroFiscalizacion && expediente.numeroLegales ? '/' : ''} 
      ${
        expediente.numeroFiscalizacion
          ? `${expediente.numeroFiscalizacion}`
          : ''
      }</strong>.`,
      usuarioId,
      fiscalizacionId,
      expedienteId: expediente.id,
      info: {
        fiscalizacionId: fiscalizacion.id,
        tipo: 'fiscalizacion'
      }
    });

    await registroHistorial({
      titulo: `Se canceló la fiscalización ${fiscalizacion.titulo}`,
      descripcion: `Se canceló la fiscalización ${
        fiscalizacion.titulo
      } para el Expediente Nro <strong>${
        expediente.numeroLegales ? `${expediente.numeroLegales}` : ''
      }${expediente.numeroFiscalizacion && expediente.numeroLegales ? '/' : ''} 
      ${
        expediente.numeroFiscalizacion
          ? `${expediente.numeroFiscalizacion}`
          : ''
      }</strong>.`,
      usuarioId,
      expedienteId: expediente.id,
      info: {
        fiscalizacionId: fiscalizacion.id,
        tipo: 'fiscalizacion'
      }
    });

    return fiscalizacionUpdated;
  }

  async cambiarEstadoYCrearTransaccion({
    fiscalizacionId,
    conceptosId,
    conceptoInfraccionNoMatriculadoId
  }: {
    fiscalizacionId: number;
    conceptosId: number[];
    conceptoInfraccionNoMatriculadoId?: number | undefined;
  }) {
    if (!fiscalizacionId) {
      throw new Exception('El id de la fiscalización es requerido');
    }

    if (!conceptosId) {
      throw new Exception('El id del concepto es requerido');
    }

    const fiscalizacion = await fiscalizacionServices.findById(fiscalizacionId);

    if (!fiscalizacion) {
      throw new Exception('La fiscalización no existe');
    }

    await transaccionValidators.crearTransaccionFiscalizacion({
      fiscalizacionId: fiscalizacion.id,
      conceptosId,
      conceptoInfraccionNoMatriculadoId
    });

    const fiscalizacionUpdated = await fiscalizacionServices.update({
      id: fiscalizacionId,
      data: {
        estado: 'esperando_ddjj_y_pago'
      }
    });

    console.log('fiscalizacionUpdated', fiscalizacionUpdated);

    return fiscalizacionUpdated;
  }
}

export default new FiscalizacionValidator();
