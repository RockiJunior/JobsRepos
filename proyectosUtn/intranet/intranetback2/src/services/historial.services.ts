import prisma from '../config/db';

class HistorialServices {
  async create(
    nombre: string,
    descripcion: string,
    usuarioId?: number,
    tramiteId?: number,
    expedienteId?: number,
    fiscalizacionId?: number,
    procesoLegalId?: number,
    info?: { [key: string]: any }
  ) {
    return prisma.registro.create({
      data: {
        nombre,
        descripcion,
        usuarioId: usuarioId ? Number(usuarioId): undefined,
        tramiteId,
        expedienteId,
        fiscalizacionId,
        procesoLegalId,
        info
      }
    });
  }
}

export default new HistorialServices();
