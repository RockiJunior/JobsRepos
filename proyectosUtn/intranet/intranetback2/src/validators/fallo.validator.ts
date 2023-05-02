import { TipoFallo } from '@prisma/client';
import fs from 'fs';
import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import falloService from '../services/fallo.services';
import procesoLegalesServices from '../services/procesoLegales.services';
import Exception from '../utils/Exception';
import { registroHistorial } from '../utils/registrarHistorial';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

const tipoFalloNames = {
  sin_sancion: 'Sin Sanción',
  advertencia_privada: 'Advertencia Privada',
  apercibiento_publico: 'Apercibimiento Público',
  multa: 'Multa',
  suspension: 'Suspensión',
  cancelacion: 'Cancelación'
};

class FalloValidator {
  async findById(id: number) {
    if (!id) {
      throw new Exception('El id es requerido');
    }
    const falloDB = await falloService.findById(id);

    if (!falloDB) {
      throw new Exception('Fallo no encontrada');
    }

    return falloDB;
  }

  async crearFallo({
    titulo,
    comentario,
    tipo,
    procesoLegalesId,
    usuarioId
  }: {
    titulo: string;
    comentario: string;
    tipo: TipoFallo;
    procesoLegalesId: number;
    usuarioId: number;
  }) {
    if (!titulo) {
      throw new Exception('Titulo es requerido');
    }
    if (!comentario) {
      throw new Exception('El comentario es requerido');
    }
    if (!tipo) {
      throw new Exception('El tipo es requerido');
    }
    if (!procesoLegalesId) {
      throw new Exception('El id del proceso Legal es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del empleado es requerido');
    }

    const procesoLegal = await procesoLegalesServices.findById(
      procesoLegalesId
    );

    if (!procesoLegal) {
      throw new Exception('El proceso Legal no existe');
    }

    const fallo = await falloService.create({
      titulo,
      comentario,
      tipo,
      paso: procesoLegal.pasoActual,
      procesoLegalesId,
      usuarioId
    });

    const empleado = await empleadoServices.findById(usuarioId);
    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    await registroHistorial({
      titulo: 'Se ha generado un fallo',
      descripcion: `El Tribunal de Ética ha generado un fallo con el título <strong>${titulo}</strong> del tipo "<strong>${tipoFalloNames[tipo]}</strong>" en el Proceso Legal Nro <strong>${procesoLegal.id}</strong>`,
      usuarioId: empleado.usuarioId,
      expedienteId: procesoLegal.expedienteId,
      info: {
        tipo: 'fallo',
        id: fallo.id,
        procesoLegalId: procesoLegal.id
      }
    });

    await registroHistorial({
      titulo: 'Se ha generado un fallo',
      descripcion: `El Tribunal de Ética ha generado un fallo con el título <strong>${titulo}</strong> del tipo "<strong>${tipoFalloNames[tipo]}</strong>" en el Proceso Legal Nro <strong>${procesoLegal.id}</strong>`,
      usuarioId: empleado.usuarioId,
      expedienteId: procesoLegal.expedienteId,
      procesoLegalId: procesoLegal.id,
      info: {
        tipo: 'fallo',
        id: fallo.id,
        procesoLegalId: procesoLegal.id
      }
    });

    return fallo;
  }

  async editarFallo({
    falloId,
    titulo,
    comentario,
    tipo,
    usuarioId
  }: {
    falloId: number;
    titulo: string;
    comentario: string;
    tipo: TipoFallo;
    usuarioId: number;
  }) {
    if (!falloId) {
      throw new Exception('El id del fallo es requerido');
    }

    const falloDB = await falloService.findById(falloId);

    if (!falloDB) {
      throw new Exception('El fallo no existe');
    }
    const procesoLegales = await procesoLegalesServices.findById(
      falloDB.procesoLegalesId
    );

    if (falloDB.paso === procesoLegales?.pasoActual) {
      const fallo = await falloService.update({
        falloId,
        titulo,
        comentario,
        tipo
      });

      await registroHistorial({
        titulo: 'Se editado un fallo',
        descripcion: `Se ha editado el fallo con el título <strong>${titulo}</strong> del tipo "<strong>${tipoFalloNames[tipo]}</strong>" en el Proceso Legal Nro <strong>${falloDB.procesoLegalesId}</strong>`,
        usuarioId,
        expedienteId: procesoLegales?.expedienteId,
        info: {
          tipo: 'fallo',
          id: fallo.id,
          procesoLegalId: fallo.procesoLegalesId
        }
      });

      await registroHistorial({
        titulo: 'Se editado un fallo',
        descripcion: `Se ha editado el fallo con el título <strong>${titulo}</strong> del tipo "<strong>${tipoFalloNames[tipo]}</strong>" en el Proceso Legal Nro <strong>${falloDB.procesoLegalesId}</strong>`,
        usuarioId,
        expedienteId: procesoLegales?.expedienteId,
        procesoLegalId: procesoLegales?.id,
        info: {
          tipo: 'fallo',
          id: fallo.id,
          procesoLegalId: fallo.procesoLegalesId
        }
      });
      return fallo;
    } else {
      throw new Exception('No se puede editar el fallo en este paso');
    }
  }

  async eliminarfallo({
    falloId,
    usuarioId
  }: {
    falloId: number;
    usuarioId: number;
  }) {
    if (!falloId) {
      throw new Exception('El id del fallo es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const falloDB = await falloService.findById(falloId);

    if (!falloDB) {
      throw new Exception('El fallo no existe');
    }

    for (const documento of falloDB.documento) {
      try {
        fs.unlinkSync(
          '.' + documento.archivoUbicacion.replace(process.env.SERVER_URL, '')
        );
      } catch (e) {
        console.log(e);
      }
      await documentoServices.delete(documento.id);
    }

    const procesoLegales = await procesoLegalesServices.findById(
      falloDB.procesoLegalesId
    );
    if (falloDB.paso === procesoLegales?.pasoActual) {
      const fallo = await falloService.delete(falloId);

      await registroHistorial({
        titulo: 'Se ha eliminado un fallo',
        descripcion: `Se ha eliminado el fallo con el título <strong>${
          fallo.titulo
        }</strong> del tipo "<strong>${
          tipoFalloNames[fallo.tipo]
        }</strong>" en el Proceso Legal Nro <strong>${
          falloDB.procesoLegalesId
        }</strong>`,
        usuarioId,
        expedienteId: procesoLegales?.expedienteId
      });

      await registroHistorial({
        titulo: 'Se ha eliminado un fallo',
        descripcion: `Se ha eliminado el fallo con el título <strong>${
          fallo.titulo
        }</strong> del tipo "<strong>${
          tipoFalloNames[fallo.tipo]
        }</strong>" en el Proceso Legal Nro <strong>${
          falloDB.procesoLegalesId
        }</strong>`,
        usuarioId,
        expedienteId: procesoLegales?.expedienteId,
        procesoLegalId: procesoLegales?.id
      });

      return fallo;
    } else {
      throw new Exception('No se puede eliminar el fallo en este paso');
    }
  }

  async documento({
    falloId,
    usuarioId,
    filename,
    expedienteUserId,
    procesoLegalesId,
    documentoId,
    expedienteId
  }: {
    falloId: number;
    usuarioId: number;
    filename: string;
    expedienteUserId: number;
    procesoLegalesId: number;
    documentoId?: number;
    expedienteId: number;
  }) {
    if (!falloId) {
      throw new Exception('El id del fallo es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const documentoGuardado = await documentoServices.upsertFallo({
      falloId,
      filename,
      expedienteUserId,
      procesoLegalesId,
      documentoId,
      expedienteId
    });

    return documentoGuardado;
  }
}

export default new FalloValidator();
