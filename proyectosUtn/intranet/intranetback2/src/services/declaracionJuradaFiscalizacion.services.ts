import prisma from '../config/db';

class DeclaracionJuradaService {
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
    fiscalizacionId,
    expedienteId,
    userFiscalizacionId
  }: {
    titulo: string;
    filename: string;
    empleadoId: number;
    userProcesoId?: number;
    fiscalizacionId: number;
    expedienteId?: number;
    userFiscalizacionId?: number;
  }) {
    const path =
      process.env.SERVER_URL +
      '/public/archivos/' +
      userFiscalizacionId +
      '/expedientes/' +
      expedienteId +
      '/fiscalizaciones/' +
      fiscalizacionId +
      '/ddjj/' +
      filename;
    return prisma.declaracionJuradaFiscalizacion.create({
      data: {
        empleadoId,
        titulo,
        archivoNombre: filename,
        archivoUbicacion: path,
        fiscalizacionId
      }
    });
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

export default new DeclaracionJuradaService();
