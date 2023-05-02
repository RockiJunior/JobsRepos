import { Requiere } from '@prisma/client';
import prisma from '../config/db';

class TipoTramiteService {
  findById(id: number) {
    return prisma.tipoTramite.findUnique({
      where: {
        id
      }
    });
  }

  findByIdExterno(id: number) {
    return prisma.tipoTramite.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        secciones: {
          include: {
            inputs: {
              include: {
                validaciones: true
              }
            }
          }
        },
        descripcion: true,
        puedeIniciar: true
      }
    });
  }

  findAllUsuario({
    hasMatricula,
    actividadComercial,
    matriculaCesante
  }: {
    hasMatricula: boolean;
    actividadComercial: boolean;
    matriculaCesante: boolean;
  }) {
    const OR = [];

    if (!hasMatricula) {
      OR.push({ requiere: Requiere.noMatricula });
    } else if (matriculaCesante) {
      OR.push({ requiere: Requiere.matriculaCesante });
    } else {
      OR.push({ requiere: Requiere.matricula });

      if (actividadComercial) {
        OR.push({ requiere: Requiere.actividadComercial });
      }
    }

    return prisma.tipoTramite.findMany({
      where: {
        AND: [
          { OR: [{ puedeIniciar: 'usuario' }, { puedeIniciar: 'ambos' }] },
          { OR }
        ]
      }
    });
  }

  findAllEmpleado(areaId: number) {
    return prisma.tipoTramite.findMany({
      where: {
        areaId,
        OR: [{ puedeIniciar: 'empleado' }, { puedeIniciar: 'ambos' }]
      }
    });
  }
}

export default new TipoTramiteService();
