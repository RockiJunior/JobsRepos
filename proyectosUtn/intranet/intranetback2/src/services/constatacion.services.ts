import { EstadoExpediente } from '@prisma/client';
import prisma from '../config/db';

class ConstatacionService {
  async findById(id: number) {
    return prisma.constatacion.findUnique({
      where: {
        id
      },
      include: {
        documento: true
      }
    });
  }

  create({
    titulo,
    comentario,
    estado,
    fiscalizacionId,
    usuarioId,
    fecha
  }: {
    titulo: string;
    comentario: string;
    estado: EstadoExpediente;
    fiscalizacionId: number;
    usuarioId: number;
    fecha: Date;
  }) {
    return prisma.constatacion.create({
      data: {
        titulo,
        comentario,
        estado,
        fiscalizacionId,
        empleadoId: usuarioId,
        fecha
      }
    });
  }

  update({
    constatacionId,
    titulo,
    comentario,
    estado
  }: {
    constatacionId: number;
    titulo: string;
    comentario: string;
    estado: EstadoExpediente;
  }) {
    return prisma.constatacion.update({
      where: {
        id: constatacionId
      },
      data: {
        titulo,
        comentario,
        estado
      }
    });
  }

  delete(constatacionId: number) {
    return prisma.constatacion.delete({
      where: {
        id: constatacionId
      }
    });
  }
}

export default new ConstatacionService();
