import prisma from '../config/db';
import Exception from '../utils/Exception';

class DocumentoService {
  async findById(id: number) {
    return prisma.documento.findUnique({
      where: {
        id
      },
      include: {
        transaccion: true,
        inputValue: true,
        informe: true,
        cedula: true,
        inputValueFiscalizacion: true
      }
    });
  }

  createInput({
    userId,
    filename,
    inputNombre,
    tramiteId,
    expedienteId,
    fiscalizacionId
  }: {
    userId: number;
    filename: string;
    inputNombre: string;
    tramiteId?: number;
    expedienteId?: number;
    fiscalizacionId?: number;
  }) {
    if (tramiteId && expedienteId) {
      throw new Exception(
        'No se puede crear un documento con un tramite y un expediente al mismo tiempo'
      );
    }
    if (tramiteId && inputNombre) {
      const path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        userId +
        '/tramites/' +
        tramiteId +
        '/' +
        filename;

      return prisma.documento.create({
        data: {
          archivoNombre: filename,
          archivoUbicacion: path,
          fecha: new Date(),
          tramiteId,
          inputNombre
        }
      });
    } else if (expedienteId && inputNombre) {
      const path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        userId +
        '/expedientes/' +
        expedienteId +
        '/fiscalizaciones/' +
        fiscalizacionId +
        '/' +
        filename;

      return prisma.documento.create({
        data: {
          archivoNombre: filename,
          archivoUbicacion: path,
          fecha: new Date(),
          fiscalizacionId,
          inputNombre
        }
      });
    } else {
      throw new Exception('El path es requerido');
    }
  }

  createInputSinUsuario({
    filename,
    inputNombre,
    tramiteId
  }: {
    filename: string;
    inputNombre: string;
    tramiteId?: number;
  }) {
    if (tramiteId && inputNombre) {
      const path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        'cucicba' +
        '/tramites/' +
        tramiteId +
        '/' +
        filename;

      return prisma.documento.create({
        data: {
          archivoNombre: filename,
          archivoUbicacion: path,
          fecha: new Date(),
          tramiteId,
          inputNombre
        }
      });
    } else {
      throw new Exception('El path es requerido');
    }
  }

  async deleteByInputValue(inputNombre: string, tramiteId: number) {
    return prisma.documento.deleteMany({
      where: {
        inputNombre,
        tramiteId
      }
    });
  }
  async deleteByInputValueExpediente(
    inputNombre: string,
    fiscalizacionId: number
  ) {
    return prisma.documento.deleteMany({
      where: {
        inputNombre,
        fiscalizacionId
      }
    });
  }

  async upsertTransaccion({
    userId,
    filename,
    transaccionId,
    documentoId
  }: {
    userId: number;
    filename: string;
    transaccionId: number;
    documentoId?: number;
  }) {
    const path =
      process.env.SERVER_URL +
      '/public/archivos/' +
      userId +
      '/transacciones/' +
      transaccionId +
      '/' +
      filename;

    return prisma.documento.upsert({
      where: {
        id: documentoId || 0
      },
      update: {
        archivoNombre: filename,
        archivoUbicacion: path
      },
      create: {
        archivoNombre: filename,
        archivoUbicacion: path,
        fecha: new Date(),
        transaccionId
      }
    });
  }

  async upsertInformes({
    informeId,
    filename,
    tramiteUserId,
    tramiteId,
    expedienteId,
    cedulaId,
    documentoId,
    procesoLegalesId
  }: {
    informeId: number;
    filename: string;
    tramiteUserId: number | 'cucicba';
    tramiteId?: number;
    expedienteId?: number;
    cedulaId?: number;
    documentoId?: number;
    procesoLegalesId?: number;
  }) {
    let path;
    if (tramiteId) {
      path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        tramiteUserId +
        '/tramites/' +
        tramiteId +
        '/informes/' +
        informeId +
        '/' +
        filename;
    } else if (procesoLegalesId) {
      path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        tramiteUserId +
        '/expedientes/' +
        expedienteId +
        '/procesos-legales/' +
        procesoLegalesId +
        '/informes/' +
        informeId +
        '/' +
        filename;
    } else if (expedienteId) {
      path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        tramiteUserId +
        '/expedientes/' +
        expedienteId +
        '/informes/' +
        informeId +
        '/' +
        filename;
    } else if (cedulaId) {
      path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        tramiteUserId +
        '/cedulas/' +
        cedulaId +
        '/informes/' +
        informeId +
        '/' +
        filename;
    } else {
      throw new Exception('El path es requerido');
    }

    return prisma.documento.upsert({
      where: {
        id: documentoId || 0
      },
      update: {
        archivoNombre: filename,
        archivoUbicacion: path
      },
      create: {
        archivoNombre: filename,
        archivoUbicacion: path,
        fecha: new Date(),
        informeId
      }
    });
  }

  async upsertInformesFiscalizacion({
    informeFiscalizacionId,
    filename,
    expedienteUserId,
    fiscalizacionId,
    documentoId,
    expedienteId
  }: {
    informeFiscalizacionId: number;
    filename: string;
    expedienteUserId: number | 'cucicba';
    fiscalizacionId: number;
    documentoId?: number;
    expedienteId: number;
  }) {
    let path;
    if (fiscalizacionId) {
      path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        expedienteUserId +
        '/expedientes/' +
        expedienteId +
        '/fiscalizaciones/' +
        fiscalizacionId +
        '/informes/' +
        informeFiscalizacionId +
        '/' +
        filename;
    } else {
      throw new Exception('El path es requerido');
    }

    return prisma.documento.upsert({
      where: {
        id: documentoId || 0
      },
      update: {
        archivoNombre: filename,
        archivoUbicacion: path
      },
      create: {
        archivoNombre: filename,
        archivoUbicacion: path,
        fecha: new Date(),
        informeFiscalizacionId
      }
    });
  }

  async upsertIntimacion({
    intimacionId,
    filename,
    tramiteUserId,
    tramiteId,
    documentoId
  }: {
    intimacionId: number;
    filename: string;
    tramiteUserId: number;
    tramiteId: number;
    documentoId?: number;
  }) {
    const path =
      process.env.SERVER_URL +
      '/public/archivos/' +
      tramiteUserId +
      '/tramites/' +
      tramiteId +
      '/intimacion/' +
      intimacionId +
      '/' +
      filename;

    return prisma.documento.upsert({
      where: {
        id: documentoId || 0
      },
      update: {
        archivoNombre: filename,
        archivoUbicacion: path
      },
      create: {
        archivoNombre: filename,
        archivoUbicacion: path,
        fecha: new Date(),
        intimacionId
      }
    });
  }

  async upsertDictamen({
    dictamenId,
    filename,
    tramiteUserId,
    tramiteId,
    documentoId,
    procesoLegalesId,
    expedienteUserId,
    expedienteId
  }: {
    dictamenId: number;
    filename: string;
    tramiteUserId?: number | string;
    tramiteId?: number;
    documentoId?: number;
    procesoLegalesId?: number;
    expedienteUserId?: number;
    expedienteId?: number;
  }) {
    let path;
    if (tramiteId) {
      path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        tramiteUserId +
        '/tramites/' +
        tramiteId +
        '/dictamen/' +
        dictamenId +
        '/' +
        filename;
    } else if (procesoLegalesId) {
      path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        expedienteUserId +
        '/expedientes/' +
        expedienteId +
        '/procesos-legales/' +
        procesoLegalesId +
        '/dictamen/' +
        dictamenId +
        '/' +
        filename;
    } else {
      throw new Exception('El path es requerido');
    }

    return prisma.documento.upsert({
      where: {
        id: documentoId || 0
      },
      update: {
        archivoNombre: filename,
        archivoUbicacion: path
      },
      create: {
        archivoNombre: filename,
        archivoUbicacion: path,
        fecha: new Date(),
        dictamenId: Number(dictamenId)
      }
    });
  }

  async upsertFallo({
    falloId,
    filename,
    expedienteUserId,
    procesoLegalesId,
    documentoId,
    expedienteId
  }: {
    falloId: number;
    filename: string;
    expedienteUserId: number;
    procesoLegalesId: number;
    documentoId?: number;
    expedienteId: number;
  }) {
    const path =
      process.env.SERVER_URL +
      '/public/archivos/' +
      expedienteUserId +
      '/expedientes/' +
      expedienteId +
      '/procesos-legales/' +
      procesoLegalesId +
      '/fallos/' +
      falloId +
      '/' +
      filename;

    return prisma.documento.upsert({
      where: {
        id: documentoId || 0
      },
      update: {
        archivoNombre: filename,
        archivoUbicacion: path
      },
      create: {
        archivoNombre: filename,
        archivoUbicacion: path,
        fecha: new Date(),
        falloId
      }
    });
  }

  async upsertCedula({
    cedulaId,
    filename,
    cedulaUserId,
    documentoId
  }: {
    cedulaId: number;
    filename: string;
    cedulaUserId: number;
    documentoId?: number;
  }) {
    const path =
      process.env.SERVER_URL +
      '/public/archivos/' +
      cedulaUserId +
      '/cedulas/' +
      cedulaId +
      '/' +
      filename;

    return prisma.documento.upsert({
      where: {
        id: documentoId || 0
      },
      update: {
        archivoNombre: filename,
        archivoUbicacion: path
      },
      create: {
        archivoNombre: filename,
        archivoUbicacion: path,
        fecha: new Date(),
        cedulaId
      }
    });
  }

  async upsertResolucion({
    resolucionId,
    filename,
    tramiteUserId,
    tramiteId,
    expedienteId,
    documentoId,
    procesoLegalesId
  }: {
    resolucionId: number;
    filename: string;
    tramiteUserId: number | 'cucicba';
    tramiteId?: number;
    expedienteId?: number;
    documentoId?: number;
    procesoLegalesId?: number;
  }) {
    let path;
    if (tramiteId) {
      path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        tramiteUserId +
        '/tramites/' +
        tramiteId +
        '/resoluciones/' +
        resolucionId +
        '/' +
        filename;
    } else if (procesoLegalesId) {
      path =
        process.env.SERVER_URL +
        '/public/archivos/' +
        tramiteUserId +
        '/expedientes/' +
        expedienteId +
        '/procesos-legales/' +
        procesoLegalesId +
        '/resoluciones/' +
        resolucionId +
        '/' +
        filename;
    } else {
      throw new Error('No se pudo guardar el archivo');
    }
    return prisma.documento.upsert({
      where: {
        id: documentoId || 0
      },
      update: {
        archivoNombre: filename,
        archivoUbicacion: path
      },
      create: {
        archivoNombre: filename,
        archivoUbicacion: path,
        fecha: new Date(),
        resolucionId
      }
    });
  }

  async upsertConstatacion({
    constatacionId,
    filename,
    expedienteUserId,
    expedienteId,
    fiscalizacionId,
    documentoId
  }: {
    constatacionId: number;
    filename: string;
    expedienteUserId: number;
    expedienteId: number;
    fiscalizacionId: number;
    documentoId?: number;
  }) {
    const path =
      process.env.SERVER_URL +
      '/public/archivos/' +
      expedienteUserId +
      '/expedientes/' +
      expedienteId +
      '/fiscalizaciones/' +
      fiscalizacionId +
      '/constataciones/' +
      constatacionId +
      '/' +
      filename;

    return prisma.documento.upsert({
      where: {
        id: documentoId || 0
      },
      update: {
        archivoNombre: filename,
        archivoUbicacion: path
      },
      create: {
        archivoNombre: filename,
        archivoUbicacion: path,
        fecha: new Date(),
        constatacionId: Number(constatacionId)
      }
    });
  }

  async delete(id: number) {
    return prisma.documento.delete({
      where: {
        id
      }
    });
  }
}

export default new DocumentoService();
