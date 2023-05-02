import { Usuario } from '@prisma/client';
import prisma from '../config/db';
import Exception from '../utils/Exception';

const regex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  onlyLetters: /^[a-zA-Z]+$/,
  onlyNumbers: /^[0-9]+$/
};

export class UsersService {
  findById(id: number) {
    return prisma.usuario.findUnique({
      where: {
        id
      },
      include: {
        empleado: {
          include: {
            area: true,
            roles: {
              include: {
                PermisoRol: {
                  include: {
                    permiso: true
                  }
                }
              }
            }
          }
        },
        turnos: {
          include: {
            area: true
          }
        },
        matricula: {
          take: 1,
          orderBy: {
            fecha: 'desc'
          }
        },
        transacciones: {
          select: {
            id: true,
            comprobante: true,
            cuotaNro: true,
            estado: true,
            fecha: true,
            monto: true,
            tramiteId: true,
            tipoCuota: true,
            tipoTransaccion: {
              select: {
                TipoTransaccionConcepto: {
                  include: {
                    concepto: true
                  }
                }
              }
            }
          },
          orderBy: {
            fecha: 'desc'
          }
        },
        carpetas: {
          include: {
            tramites: {
              select: {
                id: true,
                numero: true,
                estado: true,
                fechaFin: true,
                createdAt: true,
                tipo: {
                  select: {
                    id: true,
                    titulo: true,
                    pasos: true
                  }
                },
                pasoActual: true,
                empleadoAsignado: {
                  select: {
                    usuario: true
                  }
                }
              },
              orderBy: {
                createdAt: 'desc'
              }
            },
            expedientes: {
              select: {
                id: true,
                numeroLegales: true,
                numeroFiscalizacion: true,
                estado: true,
                createdAt: true,
                updatedAt: true,
                areas: true,
                fechaFin: true,
                procesosLegales: {
                  select: {
                    fallos: {
                      select: {
                        tipo: true
                      }
                    }
                  }
                }
              },
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        },
        cedulas: {
          select: {
            id: true,
            numero: true,
            createdAt: true,
            estado: true,
            pasoActual: true,
            titulo: true,
            fechaRecepcion: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  }

  findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
      include: {
        turnos: true,
        empleado: {
          include: {
            area: true,
            roles: {
              include: {
                PermisoRol: {
                  include: {
                    permiso: true
                  }
                }
              }
            }
          }
        },
        matricula: {
          take: 1,
          orderBy: {
            fecha: 'desc'
          }
        }
      }
    });
  }

  findByEmailCabaprop(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
      include: {
        turnos: true,
        empleado: {
          include: {
            area: true,
            roles: {
              include: {
                PermisoRol: {
                  include: {
                    permiso: true
                  }
                }
              }
            }
          }
        },
        matricula: {
          where: {
            estado: 'activo'
          },
          take: 1,
          orderBy: {
            fecha: 'desc'
          }
        }
      }
    });
  }

  create({
    nombre,
    apellido,
    dni,
    email,
    contrasenia,
    verificado
  }: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    contrasenia: string;
    verificado?: boolean;
  }) {
    if (!regex.email.test(email)) throw new Exception('El email no es valido');
    if (!regex.onlyNumbers.test(dni) && dni.length !== 8)
      throw new Exception('DNI no es valido');

    return prisma.usuario.create({
      data: {
        nombre,
        apellido,
        dni,
        contrasenia,
        email,
        datos: {
          nombre: { value: nombre },
          apellido: { value: apellido },
          dni: { value: dni },
          mailParticular: { value: email }
        },
        verificado
      }
    });
  }

  update(id: number, data: Partial<Usuario>) {
    return prisma.usuario.update({
      where: {
        id
      },
      data: data as any
    });
  }
  delete(id: number) {
    return prisma.usuario.delete({
      where: {
        id
      }
    });
  }

  verifyByEmail(email: string) {
    return prisma.usuario.update({
      where: {
        email
      },
      data: {
        verificado: true
      }
    });
  }

  async emailOrDniAlreadyExists({
    email,
    dni
  }: {
    email: string;
    dni: string;
  }) {
    const user = await prisma.usuario.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            dni
          }
        ]
      }
    });
    return user ? true : false;
  }

  contarMatriculados(busqueda: string, usuarioId?: number) {
    return prisma.usuario.count({
      where: {
        id: {
          not: usuarioId || undefined
        },
        matricula: {
          some: {
            NOT: {
              libro: null,
              folio: null,
              tomo: null
            },
            OR: [
              { id: isNaN(busqueda as any) ? undefined : Number(busqueda) },
              {
                usuario: { nombre: { contains: busqueda, mode: 'insensitive' } }
              },
              {
                usuario: {
                  apellido: { contains: busqueda, mode: 'insensitive' }
                }
              },
              { usuario: { dni: { contains: busqueda, mode: 'insensitive' } } },
              {
                usuario: { email: { contains: busqueda, mode: 'insensitive' } }
              },
              {
                usuario: {
                  nombre: {
                    contains: busqueda.slice(0, busqueda.lastIndexOf(' ')),
                    mode: 'insensitive'
                  },
                  apellido: {
                    contains: busqueda.slice(busqueda.lastIndexOf(' ') + 1),
                    mode: 'insensitive'
                  }
                }
              }
            ]
          }
        }
      }
    });
  }

  findMatriculados({
    limite,
    orden,
    columna,
    pagina,
    busqueda,
    usuarioId
  }: {
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
    usuarioId?: number;
  }) {
    let orderBy = {};

    orderBy = {
      [columna]: orden
    };

    return prisma.usuario.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        id: {
          not: usuarioId || undefined
        },
        matricula: {
          some: {
            NOT: {
              libro: null,
              folio: null,
              tomo: null
            },
            OR: [
              { id: isNaN(busqueda as any) ? undefined : Number(busqueda) },
              {
                usuario: { nombre: { contains: busqueda, mode: 'insensitive' } }
              },
              {
                usuario: {
                  apellido: { contains: busqueda, mode: 'insensitive' }
                }
              },
              { usuario: { dni: { contains: busqueda, mode: 'insensitive' } } },
              {
                usuario: { email: { contains: busqueda, mode: 'insensitive' } }
              },
              {
                usuario: {
                  nombre: {
                    contains: busqueda.slice(0, busqueda.lastIndexOf(' ')),
                    mode: 'insensitive'
                  },
                  apellido: {
                    contains: busqueda.slice(busqueda.lastIndexOf(' ') + 1),
                    mode: 'insensitive'
                  }
                }
              }
            ]
          }
        }
      },
      orderBy,
      include: {
        matricula: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        }
      }
    });
  }

  async findUsuariosConCarpeta({
    limite,
    orden,
    columna,
    pagina,
    busqueda,
    filter
  }: {
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
    filter?: any;
  }) {
    let orderBy = {};

    orderBy = {
      [columna]: orden
    };

    return await prisma.usuario.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        ...filter,
        carpetas: {
          some: {}
        },
        AND: [
          {
            OR: [
              {
                nombre: { contains: busqueda, mode: 'insensitive' }
              },
              {
                apellido: { contains: busqueda, mode: 'insensitive' }
              },
              { dni: { contains: busqueda, mode: 'insensitive' } },
              { email: { contains: busqueda, mode: 'insensitive' } },
              {
                nombre: {
                  contains: busqueda.slice(0, busqueda.lastIndexOf(' ')),
                  mode: 'insensitive'
                },
                apellido: {
                  contains: busqueda.slice(busqueda.lastIndexOf(' ') + 1),
                  mode: 'insensitive'
                }
              },
              {
                matricula: {
                  some: {
                    OR: [
                      {
                        id: isNaN(busqueda as any)
                          ? undefined
                          : Number(busqueda)
                      },
                    ]
                  }
                }
              }
            ]
          },
          {
            OR: [...(filter?.OR || [])]
          }
        ]
      },
      orderBy,
      include: {
        matricula: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        }
      }
    });
  }

  async contarUsuariosConCarpeta({
    busqueda,
    filter
  }: {
    busqueda: string;
    filter?: any;
  }) {
    return await prisma.usuario.count({
      where: {
        ...filter,
        carpetas: {
          some: {}
        },
        AND: [
          {
            OR: [
              { id: isNaN(busqueda as any) ? undefined : Number(busqueda) },
              {
                nombre: { contains: busqueda, mode: 'insensitive' }
              },
              {
                apellido: { contains: busqueda, mode: 'insensitive' }
              },
              { dni: { contains: busqueda, mode: 'insensitive' } },
              { email: { contains: busqueda, mode: 'insensitive' } },
              {
                nombre: {
                  contains: busqueda.slice(0, busqueda.lastIndexOf(' ')),
                  mode: 'insensitive'
                },
                apellido: {
                  contains: busqueda.slice(busqueda.lastIndexOf(' ') + 1),
                  mode: 'insensitive'
                }
              },
              {
                matricula: {
                  some: {
                    id: isNaN(busqueda as any) ? undefined : Number(busqueda)
                  }
                }
              }
            ]
          },
          {
            OR: [...(filter.OR || [])]
          }
        ]
      }
    });
  }
}

export default new UsersService();
