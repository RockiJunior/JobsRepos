import { EstadoTurno, Turno } from '@prisma/client';
import dayjs from 'dayjs';
import prisma from '../config/db';
import areas from '../data/areas';

class TurnoService {
  findTurnoById({ id }: { id: number }) {
    return prisma.turno.findUnique({
      where: {
        id
      }
    });
  }

  findTurnos({ inicio, fin }: { inicio: Date; fin: Date }) {
    return prisma.turno.findMany({
      where: {
        inicio: {
          gte: inicio,
          lte: fin
        }
      }
    });
  }

  reservarTurno({
    usuarioId,
    areaId,
    tramiteId,
    procesoLegalesId,
    inicio,
    fin,
    info
  }: {
    usuarioId?: number;
    areaId: number;
    tramiteId?: number;
    procesoLegalesId?: number;
    inicio: Date;
    fin: Date;
    info?: { [key: string]: string };
  }) {
    return prisma.turno.create({
      data: {
        usuarioId,
        areaId,
        tramiteId,
        procesoLegalesId,
        inicio,
        fin,
        info
      }
    });
  }

  findTurnosByArea({ areaId }: { areaId: number }) {
    return prisma.turno.findMany({
      where: {
        areaId
      },
      include: {
        tramite: {
          include: {
            tipo: true
          }
        },
        procesoLegales: true,
        usuario: true
      },
      orderBy: {
        inicio: 'asc'
      }
    });
  }
  async actualizarEstado({
    estado,
    turnoId
  }: {
    estado: EstadoTurno;
    turnoId: number;
  }) {
    return prisma.turno.update({
      where: {
        id: turnoId
      },
      data: {
        estado
      }
    });
  }

  all() {
    return prisma.turno.findMany({
      where: {
        estado: 'pending'
      },
      include: {
        area: true,
        usuario: true,
        tramite: {
          include: {
            tipo: true
          }
        },
        procesoLegales: true
      }
    });
  }

  async turnoFiscalizacion({
    motivo,
    inicio,
    fin,
    nombreTitular,
    apellidoTitular,
    dniTitular,
    mailTitular,
    telefono,
    empresa,
    direccion,
    numero,
    piso,
    depto,
    localidad,
    concurre,
    nombreConcurre,
    apellidoConcurre,
    matricula,
    numeroMatricula,
    acta,
    visita,
    inspeccion,
    nombreInspector,
    formaPago,
    usuarioId
  }: {
    motivo: string;
    inicio: Date;
    fin: Date;
    nombreTitular: string;
    apellidoTitular: string;
    dniTitular: string;
    mailTitular: string;
    telefono: string;
    empresa: string;
    direccion: string;
    numero: string;
    piso: string;
    depto: string;
    localidad: string;
    concurre: string;
    nombreConcurre: string;
    apellidoConcurre: string;
    matricula: string;
    numeroMatricula: string;
    acta: string;
    visita: string;
    inspeccion: string;
    nombreInspector: string;
    formaPago: string;
    usuarioId?: number;
  }) {
    return prisma.turno.create({
      data: {
        inicio,
        fin,
        areaId: areas.fiscalizacion,
        usuarioId,
        info: {
          motivo,
          nombreTitular,
          apellidoTitular,
          dniTitular,
          mailTitular,
          telefono,
          empresa,
          direccion,
          numero,
          piso,
          depto,
          localidad,
          concurre,
          nombreConcurre,
          apellidoConcurre,
          matricula,
          numeroMatricula,
          acta,
          visita,
          inspeccion,
          nombreInspector,
          formaPago
        }
      }
    });
  }
}

export default new TurnoService();
