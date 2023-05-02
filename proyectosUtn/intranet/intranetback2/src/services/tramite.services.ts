import { Tramite } from '@prisma/client';
import { Exception } from 'handlebars';
import prisma from '../config/db';
import { tiposTramites } from '../data/seed/tipos';
import { IPaso } from '../interfaces/pasos.interface';
import { IInput, ITramite } from '../interfaces/tramite.interface';

export class TramitesService {
  findAll({
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

    if (columna === 'nombre' || columna === 'apellido' || columna === 'dni') {
      orderBy = {
        datosUsuario: {
          [columna]: orden
        }
      };
    } else if (columna === 'titulo') {
      orderBy = {
        tipo: {
          titulo: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.tramite.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        ...filter,
        OR: [
          {
            datosUsuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            },
            areas: {
              some: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                }
              }
            }
          },
          {
            numero: isNaN(busqueda as any) ? undefined : Number(busqueda)
          }
        ]
      },
      select: {
        numero: true,
        pasoActual: true,
        areas: {
          include: {
            area: true
          }
        },
        id: true,
        createdAt: true,
        fechaFin: true,
        estado: true,
        tipo: {
          select: {
            titulo: true,
            id: true,
            pasos: true
          }
        },
        // carpeta: {
        //   select: {
        //     id: true,
        //     usuario: {
        //       select: {
        //         apellido: true,
        //         dni: true,
        //         email: true,
        //         nombre: true
        //       }
        //     }
        //   }
        // },
        datosUsuario: {
          select: {
            nombre: true,
            apellido: true,
            dni: true
          }
        }
      },
      orderBy
    });
  }

  contarTramitesAll({ busqueda, filter }: { busqueda?: string; filter?: any }) {
    return prisma.tramite.count({
      where: {
        ...filter,
        OR: [
          {
            datosUsuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            },
            areas: {
              every: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                }
              }
            }
          },
          {
            numero: isNaN(busqueda as any) ? undefined : Number(busqueda)
          }
        ]
      }
    });
  }

  async findById(id: number) {
    const tramiteDB = await prisma.tramite.findUnique({
      where: {
        id
      },
      include: {
        expedientesHijos: true,
        historial: {
          orderBy: {
            fecha: 'desc'
          },
          include: {
            usuario: {
              include: {
                empleado: true
              }
            }
          }
        },
        intimacion: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            documento: true,
            empleado: {
              include: {
                area: true,
                usuario: true
              }
            }
          }
        },
        notaInterna: {
          where: {
            deletedAt: null
          },
          include: {
            empleado: {
              include: {
                area: true,
                usuario: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        carpeta: {
          select: {
            usuarioId: true,
            usuario: {
              include: {
                matricula: {
                  orderBy: {
                    fecha: 'desc'
                  },
                  take: 1
                }
              }
            }
          }
        },
        transacciones: {
          include: {
            comprobante: true,
            tipoCuota: true,
            tipoTransaccion: {
              include: {
                TipoTransaccionConcepto: {
                  include: {
                    concepto: true
                  }
                },
                opcionesCuotas: true
              }
            }
          },
          orderBy: {
            fecha: 'desc'
          }
        },
        areas: {
          include: {
            area: true
          }
        },
        informe: {
          include: {
            documento: true,
            empleado: {
              include: {
                area: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        tipo: {
          include: {
            secciones: {
              include: {
                inputs: {
                  include: {
                    validaciones: true,
                    InputValues: {
                      where: {
                        tramiteId: id
                      },
                      include: {
                        archivos: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        dictamen: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            documento: true,
            empleado: {
              include: {
                area: true
              }
            }
          }
        },
        resoluciones: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            documento: true,
            empleado: {
              include: {
                area: true
              }
            }
          }
        },
        turno: {
          orderBy: {
            inicio: 'desc'
          }
        },
        plazos: true,
        archivos: {
          orderBy: {
            fecha: 'desc'
          }
        },
        cedulas: true
      }
    });

    if (!tramiteDB) {
      throw new Exception('No se encontró el tramite');
    }

    const tipo = tiposTramites.find((t) => t.id === tramiteDB.tipo.id);

    if (tipo) {
      const seccionesDB = tramiteDB.tipo.secciones;
      const sortSecciones = seccionesDB.map((seccion) => {
        const seccionTipo = tipo.secciones.find((s) => s.id === seccion.id);

        if (seccionTipo) {
          const newInputs: IInput[] = [];
          const inputsDB = seccion.inputs;
          const inputsTipo = seccionTipo.inputs;

          inputsTipo.forEach((input) => {
            const newInput = inputsDB.find((i) => i.nombre === input.nombre);

            if (newInput) {
              newInputs.push({
                ...newInput,
                requerido: input.requerido,
                padre: input.padre,
                multiple: input.multiple,
                isDisabled: input.isDisabled,
                prefijo: input.prefijo,

                InputValues: newInput.InputValues[0],
                nombre: input.nombre
              });
            }
          });

          return {
            ...seccion,
            inputs: newInputs,
            tipo: seccionTipo.tipo || undefined
          };
        } else {
          throw new Exception('No se encontró la sección');
        }
      });

      const newTramite: ITramite = {
        ...tramiteDB,
        tipo: {
          ...tramiteDB.tipo,
          secciones: sortSecciones,
          pasos: tramiteDB.tipo.pasos as any as IPaso[]
        },
        info: tramiteDB.info as { [key: string]: any }
      };
      return newTramite;
    } else {
      throw new Exception('No se encontró el tipo de tramite');
    }
  }

  async findByIdExterno(id: number) {
    const tramiteDB = await prisma.tramite.findUnique({
      where: {
        id
      },
      select: {
        numero: true,
        tipo: {
          include: {
            secciones: {
              include: {
                inputs: {
                  include: {
                    validaciones: true,
                    InputValues: {
                      where: {
                        tramiteId: id
                      },
                      include: {
                        archivos: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        turno: true,
        createdAt: true,
        tipoSeccion: true,
        estado: true,
        fechaFin: true,
        id: true,
        pasoActual: true
      }
    });

    if (!tramiteDB) {
      throw new Exception('No se encontró el tramite');
    }

    const tipo = tiposTramites.find((t) => t.id === tramiteDB.tipo.id);

    if (tipo) {
      const seccionesDB = tramiteDB.tipo.secciones;

      const sortSecciones = seccionesDB.map((seccion) => {
        const seccionTipo = tipo.secciones.find((s) => s.id === seccion.id);

        if (seccionTipo) {
          const newInputs: IInput[] = [];
          const inputsDB = seccion.inputs;
          const inputsTipo = seccionTipo.inputs;

          inputsTipo.forEach((input) => {
            const newInput = inputsDB.find((i) => i.nombre === input.nombre);
            if (newInput) {
              newInputs.push({
                ...newInput,
                requerido: input.requerido,
                padre: input.padre,
                multiple: input.multiple,
                isDisabled: input.isDisabled,
                prefijo: input.prefijo,

                InputValues: newInput.InputValues[0],
                nombre: input.nombre
              });
            }
          });

          return {
            ...seccion,
            inputs: newInputs
          };
        } else {
          return seccion;
        }
      });

      return {
        ...tramiteDB,
        tipo: {
          ...tramiteDB.tipo,
          secciones: sortSecciones
        }
      };
    } else {
      return tramiteDB;
    }
  }

  findByUserId({
    usuarioId,
    limite,
    orden,
    columna,
    pagina,
    busqueda,
    filter
  }: {
    usuarioId: number;
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
    filter?: { [prop: string]: string };
  }) {
    let orderBy = {};

    if (columna === 'titulo') {
      orderBy = {
        tipo: {
          titulo: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }
    return prisma.tramite.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        ...filter,
        tipo: {
          requiere: {
            not: 'oculto'
          }
        },
        carpeta: {
          usuarioId
        },
        OR: [
          {
            datosUsuario: {
              OR: [
                {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  apellido: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  dni: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            }
          }
        ]
      },
      select: {
        id: true,
        numero: true,
        createdAt: true,
        fechaFin: true,
        estado: true,
        tipo: {
          select: {
            titulo: true,
            id: true
          }
        }
      },
      orderBy
    });
  }

  contarTramitesByUserId({
    usuarioId,
    busqueda,
    filter
  }: {
    usuarioId: number;
    busqueda?: string;
    filter?: { [prop: string]: string };
  }) {
    return prisma.tramite.count({
      where: {
        ...filter,
        tipo: {
          requiere: {
            not: 'oculto'
          }
        },
        carpeta: {
          usuarioId
        },
        OR: [
          {
            datosUsuario: {
              OR: [
                {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  apellido: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  dni: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            }
          }
        ]
      }
    });
  }

  findByAdminId({
    id,
    limite,
    orden,
    columna,
    pagina,
    busqueda,
    filter
  }: {
    id: number;
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
    filter?: any;
  }) {
    let orderBy = {};

    if (columna === 'nombre' || columna === 'apellido' || columna === 'dni') {
      orderBy = {
        datosUsuario: {
          [columna]: orden
        }
      };
    } else if (columna === 'titulo') {
      orderBy = {
        tipo: {
          titulo: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.tramite.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        empleadoId: id,
        ...filter,
        OR: [
          {
            datosUsuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            },
            areas: {
              every: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                }
              }
            }
          },
          {
            numero: isNaN(busqueda as any) ? undefined : Number(busqueda)
          }
        ]
      },
      select: {
        numero: true,
        fechaFin: true,
        pasoActual: true,
        areas: {
          include: {
            area: true
          }
        },
        id: true,
        createdAt: true,
        estado: true,
        tipo: {
          select: {
            titulo: true,
            id: true,
            pasos: true
          }
        },
        carpeta: {
          select: {
            id: true,
            usuario: {
              select: {
                apellido: true,
                dni: true,
                email: true,
                nombre: true
              }
            }
          }
        },
        datosUsuario: true
      },
      orderBy
    });
  }

  contarTramitesByAdminId({
    empleadoId,
    busqueda,
    filter
  }: {
    empleadoId: number;
    busqueda?: string;
    filter?: any;
  }) {
    return prisma.tramite.count({
      where: {
        ...filter,
        empleadoId,
        OR: [
          {
            datosUsuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            },
            areas: {
              every: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                }
              }
            }
          },
          {
            numero: isNaN(busqueda as any) ? undefined : Number(busqueda)
          }
        ]
      }
    });
  }

  findByAreaId({
    areaId,
    limite,
    orden,
    columna,
    pagina,
    busqueda,
    filter
  }: {
    areaId: number;
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
    filter?: any;
  }) {
    let orderBy = {};

    if (columna === 'nombre' || columna === 'apellido' || columna === 'dni') {
      orderBy = {
        datosUsuario: {
          [columna]: orden
        }
      };
    } else if (columna === 'titulo') {
      orderBy = {
        tipo: {
          titulo: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.tramite.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        ...filter,
        areas: {
          some: {
            areaId,
            deleted: null
          }
        },
        OR: [
          {
            datosUsuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            }
          },
          {
            numero: isNaN(busqueda as any) ? undefined : Number(busqueda)
          },
          {
            empleadoAsignado: {
              usuario: {
                OR: [
                  { nombre: { contains: busqueda, mode: 'insensitive' } },
                  { apellido: { contains: busqueda, mode: 'insensitive' } }
                ]
              }
            }
          }
        ]
      },
      select: {
        numero: true,
        fechaFin: true,
        empleadoAsignado: {
          select: {
            usuario: true
          }
        },
        pasoActual: true,
        areas: {
          include: {
            area: true
          }
        },
        id: true,
        createdAt: true,
        estado: true,
        tipo: {
          select: {
            titulo: true,
            id: true,
            pasos: true
          }
        },
        // carpeta: {
        //   select: {
        //     id: true,
        //     usuario: {
        //       select: {
        //         apellido: true,
        //         dni: true,
        //         email: true,
        //         nombre: true
        //       }
        //     }
        //   }
        // }
        datosUsuario: true
      },
      orderBy
    });
  }

  create({
    tipoId,
    areaId,
    numero,
    datosUsuarioId,
    carpetaId,
    expiracion,
    empleadoId
  }: {
    tipoId: number;
    areaId: number;
    numero: number;
    datosUsuarioId: number;
    carpetaId?: number;
    expiracion?: Date;
    empleadoId?: number;
  }) {
    return prisma.tramite.create({
      data: {
        numero,
        tipoId,
        areas: {
          create: {
            areaId
          }
        },
        carpetaId,
        expiracion,
        empleadoId,
        datosUsuarioId
      }
    });
  }

  findUltimoTramiteByUserByTipo({
    carpetaId,
    tipoId
  }: {
    carpetaId: number;
    tipoId: number;
  }) {
    return prisma.tramite.findFirst({
      where: {
        carpetaId,
        tipoId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    });
  }

  findByIdCarpeta(tramiteId: number) {
    return prisma.tramite.findUnique({
      where: {
        id: tramiteId
      },
      include: {
        carpeta: true,
        datosUsuario: true
      }
    });
  }

  findSinAsignarPorArea({
    areaId,
    limite,
    orden,
    columna,
    pagina,
    busqueda,
    filter
  }: {
    areaId: number;
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
    filter?: any;
  }) {
    let orderBy = {};

    if (columna === 'nombre' || columna === 'apellido' || columna === 'dni') {
      orderBy = {
        datosUsuario: {
          [columna]: orden
        }
      };
    } else if (columna === 'tipo') {
      orderBy = {
        tipo: {
          titulo: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.tramite.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        ...filter,
        areas: {
          every: {
            areaId
          }
        },
        empleadoId: null,
        asignarEmpleado: true,
        estado: 'pendiente',
        OR: [
          {
            datosUsuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            }
          },
          {
            areas: {
              every: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                }
              }
            }
          },
          { numero: isNaN(busqueda as any) ? undefined : Number(busqueda) }
        ]
      },
      include: {
        tipo: true,
        areas: { include: { area: true } },
        datosUsuario: true
        // carpeta: {
        //   include: {
        //     usuario: true
        //   }
        // }
      },
      orderBy
    });
  }

  contarTotalTramitesSinAsignarPorArea({
    areaId,
    busqueda,
    filter
  }: {
    areaId: number;
    busqueda?: string;
    filter?: any;
  }) {
    return prisma.tramite.count({
      where: {
        ...filter,
        areas: {
          every: {
            areaId
          }
        },
        estado: 'pendiente',
        empleadoId: null,
        asignarEmpleado: true,
        OR: [
          {
            datosUsuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            }
          },
          {
            numero: isNaN(busqueda as any) ? undefined : Number(busqueda)
          }
        ]
      }
    });
  }

  asignarMatriculador({
    encargadoId,
    tramiteId
  }: {
    encargadoId: number;
    tramiteId: number;
  }) {
    return prisma.tramite.update({
      where: {
        id: tramiteId
      },
      data: {
        empleadoId: encargadoId
      }
    });
  }

  desasignarMatriculador(tramiteId: number) {
    return prisma.tramite.update({
      where: {
        id: tramiteId
      },
      data: {
        empleadoId: null
      }
    });
  }

  update(tramiteId: number, data: Partial<Tramite>) {
    return prisma.tramite.update({
      where: {
        id: tramiteId
      },
      data: {
        ...data,
        info: data.info || undefined
      }
    });
  }

  contarTramitesPendientesByArea({
    areaId,
    busqueda,
    filter
  }: {
    areaId: number;
    busqueda?: string;
    filter?: any;
  }) {
    return prisma.tramite.count({
      where: {
        ...filter,
        areas: {
          some: {
            areaId,
            deleted: null
          }
        },
        OR: [
          {
            datosUsuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            },
            areas: {
              every: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                }
              }
            }
          },
          {
            numero: isNaN(busqueda as any) ? undefined : Number(busqueda)
          }
        ]
      }
    });
  }

  rechazarTramite(tramiteId: number) {
    return prisma.tramite.update({
      where: {
        id: tramiteId
      },
      data: {
        estado: 'rechazado',
        fechaFin: new Date()
      }
    });
  }

  cancelarTramite(tramiteId: number) {
    return prisma.tramite.update({
      where: {
        id: tramiteId
      },
      data: {
        estado: 'cancelado',
        fechaFin: new Date()
      }
    });
  }

  findFamilia(tramiteId: number) {
    return prisma.tramite.findUnique({
      where: {
        id: tramiteId
      },
      include: {
        tramitesHijos: true,
        expedientesHijos: true,
        tramitePadre: true,
        expedientePadre: true,
        tipo: true,
        cedulas: true
      }
    });
  }

  findTramitePendienteByTipoAndUser({
    tipoId,
    usuarioId
  }: {
    tipoId: number;
    usuarioId: number;
  }) {
    return prisma.tramite.findFirst({
      where: {
        tipoId,
        carpeta: {
          usuarioId
        },
        estado: 'pendiente'
      },
      include: { tipo: true }
    });
  }

  findTramiteAprobadoByTipoAndUser({
    tipoId,
    usuarioId
  }: {
    tipoId: number;
    usuarioId: number;
  }) {
    return prisma.tramite.findFirst({
      where: {
        tipoId,
        carpeta: {
          usuarioId
        },
        estado: 'aprobado'
      },
      include: { tipo: true }
    });
  }

  deleteAllAreas(id: number) {
    return prisma.tramite.update({
      where: {
        id
      },
      data: {
        areas: {
          updateMany: {
            where: {
              tramiteId: id
            },
            data: {
              deleted: new Date()
            }
          }
        }
      }
    });
  }

  contarTramitesPendientes() {
    return prisma.tramite.count({
      where: {
        estado: 'pendiente'
      }
    });
  }

  createSinUsuario({
    tipoId,
    areaId,
    numero,
    datosUsuarioId,
    expiracion,
    empleadoId
  }: {
    tipoId: number;
    areaId: number;
    numero: number;
    datosUsuarioId: number;
    expiracion?: Date;
    empleadoId?: number;
  }) {
    return prisma.tramite.create({
      data: {
        tipoId,
        numero,
        expiracion,
        empleadoId,
        areas: {
          create: {
            areaId
          }
        },
        datosUsuarioId
      }
    });
  }

  findAllSinUsuario({
    pagina,
    limite,
    orden,
    columna,
    busqueda
  }: {
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
  }) {
    const orderBy = { [columna]: orden };

    return prisma.tramite.findMany({
      skip: pagina * limite,
      take: limite,
      where: {
        OR: [
          {
            datosUsuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            tipo: {
              titulo: { contains: busqueda, mode: 'insensitive' }
            }
          }
        ]
      },
      include: {
        tipo: true,
        areas: { include: { area: true } }
      },
      orderBy
    });
  }
}

export default new TramitesService();
