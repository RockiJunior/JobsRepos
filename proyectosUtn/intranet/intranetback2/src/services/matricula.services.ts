import { EstadoMatricula } from '@prisma/client';
import prisma from '../config/db';
import { not } from 'ip';

class MatriculaSercive {
  getById(id: number) {
    return prisma.matricula.findUnique({
      where: {
        id
      },
      include: {
        usuario: true
      }
    });
  }

  getByUserId(usuarioId: number) {
    return prisma.matricula.findFirst({
      where: {
        usuarioId,
        OR: [{ estado: 'activo' }, { estado: 'activo_sin_actividad' }]
      }
    });
  }

  getByUserIdNoBajaNiPendiente(usuarioId: number) {
    return prisma.matricula.findFirst({
      where: {
        usuarioId,
        AND: [{ estado: { not: 'baja' } }, { estado: { not: 'pendiente' } }]
      }
    });
  }

  getByUserIdAndEstado({
    usuarioId,
    estado
  }: {
    usuarioId: number;
    estado: EstadoMatricula;
  }) {
    return prisma.matricula.findFirst({
      where: {
        usuarioId,
        estado
      }
    });
  }

  create({
    id,
    estado,
    usuarioId,
    libro,
    folio,
    tomo
  }: {
    id: number;
    estado: EstadoMatricula;
    usuarioId: number;
    libro?: string;
    folio?: string;
    tomo?: string;
  }) {
    return prisma.matricula.create({
      data: {
        id,
        libro,
        folio,
        tomo,
        estado,
        usuarioId
      }
    });
  }

  allMatricula(usuarioId: number) {
    return prisma.matricula.findMany({
      where: {
        id: usuarioId
      },
      include: {
        usuario: true
      }
    });
  }
  ultimaMatricula(usuarioId: number) {
    return prisma.matricula.findFirst({
      where: {
        usuarioId
      },
      orderBy: {
        id: 'desc'
      },
      include: {
        usuario: true
      }
    });
  }
}

export default new MatriculaSercive();
