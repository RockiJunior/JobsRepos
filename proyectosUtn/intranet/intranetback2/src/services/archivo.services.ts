import Exception from '../utils/Exception';
import prisma from '../config/db';

class ArchivoService {
  findById(id: number) {
    return prisma.archivo.findUnique({
      where: {
        id
      },
      include: {
        tramite: true,
        empleado: true
      }
    });
  }

  create({
    titulo,
    filename,
    empleadoId,
    tramiteId,
    expedienteId,
    procesoLegalesId,
    paso,
    userProcesoId
  }: {
    titulo: string;
    filename: string;
    empleadoId: number;
    tramiteId?: number;
    expedienteId?: number;
    paso?: number;
    procesoLegalesId?: number;
    userProcesoId?: number;
  }) {
    if (tramiteId) {
      const path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        (userProcesoId || 'cucicba') +
        '/tramites/' +
        tramiteId +
        '/' +
        filename;

      return prisma.archivo.create({
        data: {
          titulo,
          archivoNombre: filename,
          archivoUbicacion: path,
          tramiteId: tramiteId,
          empleadoId,
          paso
        }
      });
    } else if (procesoLegalesId) {
      const path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        (userProcesoId || 'cucicba') +
        '/expedientes/' +
        expedienteId +
        '/procesos-legales/' +
        procesoLegalesId +
        '/' +
        filename;

      return prisma.archivo.create({
        data: {
          titulo,
          archivoNombre: filename,
          archivoUbicacion: path,
          procesoLegalesId,
          empleadoId,
          paso
        }
      });
    } else if (expedienteId) {
      const path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        (userProcesoId || 'cucicba') +
        '/expedientes/' +
        expedienteId +
        '/' +
        filename;

      return prisma.archivo.create({
        data: {
          titulo,
          archivoNombre: filename,
          archivoUbicacion: path,
          expedienteId: procesoLegalesId ? undefined : expedienteId,
          procesoLegalesId: procesoLegalesId || undefined,
          empleadoId,
          paso
        }
      });
    }
  }

  update({
    id,
    titulo,
    filename,
    path
  }: {
    id: number;
    titulo: string;
    filename: string;
    path: string;
  }) {
    return prisma.archivo.update({
      where: {
        id
      },
      data: {
        titulo,
        archivoNombre: filename,
        archivoUbicacion: path
      }
    });
  }

  delete(id: number) {
    return prisma.archivo.delete({
      where: {
        id
      }
    });
  }
}

export default new ArchivoService();
