import { EstadoTransaccion, Transaccion } from '@prisma/client';
import prisma from '../config/db';

class TransaccionService {
  findById(id: number) {
    return prisma.transaccion.findUnique({
      where: {
        id
      },
      include: {
        comprobante: true,
        tipoCuota: true,
        tipoTransaccion: {
          include: {
            opcionesCuotas: true,
            TipoTransaccionConcepto: {
              include: {
                concepto: true
              }
            }
          }
        },
        tramite: {
          select: {
            tipo: {
              select: {
                titulo: true
              }
            }
          }
        },
        fiscalizacion: {
          include: {
            expediente: {
              select: {
                numeroFiscalizacion: true,
                numeroLegales: true,
                denuncia: true
              }
            }
          }
        },
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            dni: true,
            email: true
          }
        }
      }
    });
  }

  create({
    tramiteId,
    monto,
    estado,
    tipoTransaccionNombre,
    usuarioId
  }: {
    tramiteId: number;
    monto: number;
    estado: EstadoTransaccion;
    tipoTransaccionNombre: string;
    usuarioId: number;
  }) {
    return prisma.transaccion.create({
      data: {
        tramiteId,
        monto,
        estado,
        tipoTransaccionNombre,
        usuarioId
      }
    });
  }

  update(id: number, data: Partial<Transaccion>) {
    return prisma.transaccion.update({
      where: {
        id
      },
      data: {
        ...data,
        info: data.info || undefined
      }
    });
  }
  async asignarEmpleado({
    empleadoId,
    transaccionId
  }: {
    empleadoId: number;
    transaccionId: number;
  }) {
    await prisma.transaccion.update({
      where: {
        id: transaccionId
      },
      data: {
        empleadoId
      }
    });
  }

  async transaccionByEmpleadoPending({
    empleadoId,
    busqueda
  }: {
    empleadoId: number;
    busqueda: string;
  }) {
    return prisma.transaccion.findMany({
      where: {
        empleadoId,
        estado: 'pending',
        OR: [
          {
            monto: {
              gte:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda),
              lt:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda) + 1
            }
          },
          {
            fiscalizacion: {
              expediente: {
                denuncia: {
                  OR: [
                    {
                      nombreDenunciado: {
                        contains: busqueda,
                        mode: 'insensitive'
                      }
                    },
                    {
                      apellidoDenunciado: {
                        contains: busqueda,
                        mode: 'insensitive'
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      },
      include: {
        usuario: true,
        comprobante: true,
        tipoCuota: true,
        fiscalizacion: {
          include: {
            expediente: {
              include: {
                denuncia: true
              }
            }
          }
        },
        tipoTransaccion: {
          include: {
            TipoTransaccionConcepto: {
              include: {
                concepto: true
              }
            }
          }
        }
      }
    });
  }

  async transaccionByEmpleado({
    empleadoId,
    limite,
    pagina,
    busqueda,
    orden,
    columna
  }: {
    empleadoId: number;
    limite: number;
    pagina: number;
    busqueda: string;
    orden: string;
    columna: string;
  }) {
    let orderBy = {};

    if (columna === 'nombre' || columna === 'apellido' || columna === 'dni') {
      orderBy = {
        usuario: {
          [columna]: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.transaccion.findMany({
      skip: (pagina - 1) * limite,
      take: limite,
      where: {
        empleadoId,
        estado: { in: ['sent', 'pending'] },
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } },
                { email: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            monto: {
              gte:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda),
              lt:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda) + 1
            }
          }
        ]
      },
      include: {
        usuario: true,
        comprobante: true,
        tipoCuota: true,
        fiscalizacion: {
          include: {
            expediente: {
              include: {
                denuncia: true
              }
            }
          }
        },
        tipoTransaccion: {
          include: {
            TipoTransaccionConcepto: {
              include: {
                concepto: true
              }
            }
          }
        }
      },
      orderBy
    });
  }

  async transaccionByEmpleadoSent({
    empleadoId,
    busqueda
  }: {
    empleadoId: number;
    busqueda: string;
  }) {
    return prisma.transaccion.findMany({
      where: {
        empleadoId,
        estado: 'sent',
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } },
                { email: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            monto: {
              gte:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda),
              lt:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda) + 1
            }
          }
        ]
      },
      include: {
        usuario: true,
        comprobante: true,
        tipoCuota: true,
        fiscalizacion: {
          include: {
            expediente: {
              include: {
                denuncia: true
              }
            }
          }
        },
        tipoTransaccion: {
          include: {
            TipoTransaccionConcepto: {
              include: {
                concepto: true
              }
            }
          }
        }
      }
    });
  }

  contarTotalTransaccionesByEmpleado({
    empleadoId,
    busqueda
  }: {
    empleadoId: number;
    busqueda: string;
  }) {
    return prisma.transaccion.count({
      where: {
        empleadoId,
        estado: { in: ['sent', 'pending'] },
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } },
                { email: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            monto: {
              gte:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda),
              lt:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda) + 1
            }
          }
        ]
      }
    });
  }

  async findAll({
    limite,
    pagina,
    busqueda,
    orden,
    columna
  }: {
    limite: number;
    pagina: number;
    busqueda: string;
    orden: string;
    columna: string;
  }) {
    let orderBy = {};

    if (columna === 'nombre' || columna === 'apellido' || columna === 'dni') {
      orderBy = {
        usuario: {
          [columna]: orden
        }
      };
    } else if (columna === 'empleado') {
      orderBy = {
        empleado: {
          usuario: {
            apellido: orden
          }
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }
    return prisma.transaccion.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        estado: { in: ['sent', 'pending'] },
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } },
                { email: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            empleado: {
              usuario: {
                OR: [
                  { nombre: { contains: busqueda, mode: 'insensitive' } },
                  { apellido: { contains: busqueda, mode: 'insensitive' } }
                ]
              }
            }
          },
          {
            monto: {
              gte:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda),
              lt:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda) + 1
            }
          }
        ]
      },
      orderBy,
      include: {
        fiscalizacion: {
          include: {
            expediente: {
              include: {
                denuncia: true
              }
            }
          }
        },
        usuario: true,
        comprobante: true,
        tipoCuota: true,
        tipoTransaccion: true,
        empleado: {
          include: {
            usuario: true
          }
        }
      }
    });
  }

  contarTotalTransaccionesAll(busqueda: string) {
    return prisma.transaccion.count({
      where: {
        estado: { in: ['sent', 'pending'] },
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } },
                { email: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            monto: {
              gte:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda),
              lt:
                busqueda === '' || isNaN(busqueda as any)
                  ? undefined
                  : parseInt(busqueda) + 1
            }
          }
        ]
      }
    });
  }

  crearTransaccionFiscalizacion({
    fiscalizacionId,
    monto,
    estado,
    tipoTransaccionNombre,
    empleadoId
  }: {
    fiscalizacionId: number;
    monto: number;
    estado: EstadoTransaccion;
    tipoTransaccionNombre: string;
    empleadoId: number;
  }) {
    return prisma.transaccion.create({
      data: {
        monto,
        estado,
        tipoTransaccion: {
          connect: {
            nombre: tipoTransaccionNombre
          }
        },
        fiscalizacion: {
          connect: {
            id: fiscalizacionId
          }
        },
        empleado: {
          connect: {
            usuarioId: empleadoId
          }
        }
      }
    });
  }

  delete(id: number) {
    return prisma.transaccion.delete({
      where: {
        id
      }
    });
  }
}
export default new TransaccionService();
