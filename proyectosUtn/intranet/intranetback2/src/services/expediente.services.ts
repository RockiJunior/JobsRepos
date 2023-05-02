import {
  Documento,
  EstadoExpediente,
  Expediente,
  InputsValueFiscalizacion,
  Validaciones
} from '@prisma/client';
import { Exception } from 'handlebars';
import prisma from '../config/db';
import procesoLegalesPasos from '../data/procesoLegales';
import { InputName } from '../data/seed/inputs/inputs';
import formularioFiscalizacion from '../data/seed/tiposFiscalizacion/fiscalizacion';
import {
  IExpediente,
  IFiscalizacion
} from '../interfaces/expediente.interface';
import { getNumeroExpediente } from '../utils/getNumeroExpediente';

interface IInputsValueFiscalizacion extends InputsValueFiscalizacion {
  archivos: Documento[];
}

export interface Input {
  nombre: InputName;
  requerido: (boolean | InputName)[];
  isDisabled?: boolean;
  padre?: InputName;
  multiple?: boolean;
  prefijo?: string;
}

interface IInput extends Input {
  nombre: InputName;
  inputValueFiscalizacion?: IInputsValueFiscalizacion;
  validaciones: Validaciones | null;
  titulo: string;
  tipo: string;
}

class ExpedienteServices {
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
        denuncia: {
          [this.getNombreColumnaDenuncia(columna)]: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.expediente.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        ...filter,
        OR: [
          {
            denuncia: {
              OR: [
                {
                  nombreDenunciado: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  apellidoDenunciado: {
                    contains: busqueda,
                    mode: 'insensitive'
                  }
                },
                {
                  dniDenunciado: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            areas: {
              some: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                },
                deleted: null
              }
            }
          },
          {
            numeroFiscalizacion: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            numeroLegales: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            empleadosAsignados: {
              some: {
                usuario: {
                  OR: [
                    {
                      nombre: { contains: busqueda, mode: 'insensitive' }
                    },
                    {
                      apellido: { contains: busqueda, mode: 'insensitive' }
                    }
                  ]
                }
              }
            }
          }
        ]
      },
      select: {
        denuncia: true,
        numeroFiscalizacion: true,
        numeroLegales: true,
        areas: {
          include: {
            area: true
          }
        },
        id: true,
        createdAt: true,
        fechaFin: true,
        estado: true,
        fiscalizaciones: {
          select: {
            titulo: true,
            id: true
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
        empleadosAsignados: {
          select: {
            usuario: true
          }
        }
      },
      orderBy
    });
  }

  contarAll({ busqueda, filter }: { busqueda: string; filter?: any }) {
    return prisma.expediente.count({
      where: {
        ...filter,
        OR: [
          {
            denuncia: {
              OR: [
                {
                  nombreDenunciado: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  apellidoDenunciado: {
                    contains: busqueda,
                    mode: 'insensitive'
                  }
                },
                {
                  dniDenunciado: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            areas: {
              some: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                },
                deleted: null
              }
            }
          },
          {
            numeroFiscalizacion: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            numeroLegales: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            empleadosAsignados: {
              some: {
                usuario: {
                  OR: [
                    {
                      nombre: { contains: busqueda, mode: 'insensitive' }
                    },
                    {
                      apellido: { contains: busqueda, mode: 'insensitive' }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    });
  }

  async findById(id: number) {
    const expedienteDB = await prisma.expediente.findUnique({
      where: {
        id
      },
      include: {
        denuncia: true,
        caratula: true,
        historial: {
          orderBy: {
            fecha: 'desc'
          },
          include: {
            usuario: true
          }
        },
        notas: {
          where: {
            deletedAt: null
          },
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            empleado: {
              include: {
                usuario: true,
                area: true
              }
            }
          }
        },
        areas: {
          include: {
            area: true
          }
        },
        informes: {
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
        carpeta: {
          include: {
            usuario: {
              include: {
                matricula: {
                  orderBy: {
                    id: 'desc'
                  },
                  take: 1
                }
              }
            }
          }
        },
        turnos: true,
        plazos: true,
        archivos: {
          orderBy: {
            fecha: 'desc'
          }
        },
        fiscalizaciones: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            declaracionJurada: true,
            informeFiscalizacion: {
              include: {
                documento: true,
                empleado: {
                  include: {
                    area: true
                  }
                }
              }
            },
            notas: {
              include: {
                empleado: {
                  include: {
                    usuario: true,
                    area: true
                  }
                }
              },
              orderBy: {
                createdAt: 'desc'
              }
            },
            transaccion: {
              include: {
                tipoCuota: true,
                comprobante: true
              }
            },
            cobroFiscalizacion: {
              include: {
                CobroConcepto: {
                  include: {
                    concepto: true
                  }
                }
              }
            },
            constataciones: {
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
                        inputValueFiscalizacion: {
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
            historial: {
              orderBy: {
                fecha: 'desc'
              },
              include: {
                usuario: true
              }
            }
          }
        },
        empleadosAsignados: true,
        procesosLegales: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            turnos: {
              orderBy: {
                inicio: 'desc'
              }
            },
            archivos: {
              orderBy: {
                fecha: 'desc'
              }
            },
            cedulas: true,
            dictamen: {
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
            fallos: {
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
            despachoImputacion: {
              include: {
                imputaciones: true,
                empleado: {
                  include: {
                    area: true
                  }
                }
              }
            },
            notas: {
              include: {
                empleado: {
                  include: {
                    usuario: true,
                    area: true
                  }
                }
              },
              orderBy: {
                createdAt: 'desc'
              }
            },
            resoluciones: {
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
            informes: {
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
            historial: {
              include: {
                usuario: true
              },
              orderBy: {
                fecha: 'desc'
              }
            }
          }
        }
      }
    });

    if (!expedienteDB) {
      throw new Exception('No se encontró el Expediente');
    }

    const tipo = formularioFiscalizacion;
    const fiscalizacionesSort: IFiscalizacion[] = [];

    expedienteDB.fiscalizaciones.forEach((fiscalizacionDB) => {
      const seccionesDB = fiscalizacionDB.tipo.secciones;
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

                inputValueFiscalizacion: newInput.inputValueFiscalizacion.find(
                  (iv) => iv.fiscalizacionId === fiscalizacionDB.id
                ),
                nombre: input.nombre,
                tipo: newInput.tipo
              });
            }
          });

          return {
            ...seccion,
            inputs: newInputs
          };
        } else {
          throw new Exception('No se encontró la sección');
        }
      });

      fiscalizacionesSort.push({
        ...fiscalizacionDB,
        tipo: {
          ...fiscalizacionDB.tipo,
          secciones: sortSecciones as IFiscalizacion['tipo']['secciones']
        }
      });
    });

    const procesosLegales = expedienteDB.procesosLegales.map(
      (procesoLegal) => ({
        ...procesoLegal,
        pasoActualLabel: {
          label: `${procesoLegal.pasoActual + 1} de ${
            procesoLegalesPasos.length
          }`,
          title: procesoLegalesPasos[procesoLegal.pasoActual].intraTitle
        },
        pasos: procesoLegalesPasos
      })
    );

    const newExpediente: IExpediente = {
      ...expedienteDB,
      carpeta: expedienteDB.carpeta || undefined,
      fiscalizaciones: fiscalizacionesSort,
      procesosLegales,
      numero: getNumeroExpediente({
        numeroLegales: expedienteDB.numeroLegales,
        numeroFiscalizacion: expedienteDB.numeroFiscalizacion
      })
    };
    return newExpediente;
  }

  ultimoExpedienteLegales() {
    return prisma.expediente.findFirst({
      where: {
        numeroLegales: {
          not: null
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  ultimoExpedienteFiscalizacion() {
    return prisma.expediente.findFirst({
      where: {
        numeroFiscalizacion: {
          not: null
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  create({
    numeroLegales,
    numeroFiscalizacion,
    areaId,
    carpetaId,
    tramitePadreId,
    expedientePadreId,
    info,
    denunciaId,
    isDenuncia
  }: {
    numeroLegales?: string;
    numeroFiscalizacion?: string;
    areaId: number;
    carpetaId?: number;
    tramitePadreId?: number;
    expedientePadreId?: number;
    info?: { [prop: string]: any };
    denunciaId: number;
    isDenuncia: boolean;
  }) {
    return prisma.expediente.create({
      data: {
        isDenuncia,
        denunciaId,
        numeroLegales,
        numeroFiscalizacion,
        carpetaId,
        tramitePadreId,
        expedientePadreId,
        info,
        areas: {
          create: {
            areaId
          }
        }
      }
    });
  }

  update({ id, data }: { id: number; data: Partial<Expediente> }) {
    return prisma.expediente.update({
      where: {
        id
      },
      data: {
        ...data,
        info: data.info || undefined
      }
    });
  }

  findByAdminId({
    empleadoId,
    limite,
    orden,
    columna,
    pagina,
    busqueda,
    filter
  }: {
    empleadoId: number;
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
        denuncia: {
          [this.getNombreColumnaDenuncia(columna)]: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.expediente.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        empleadosAsignados: {
          some: {
            usuarioId: empleadoId
          }
        },
        ...filter,
        OR: [
          {
            denuncia: {
              OR: [
                {
                  nombreDenunciado: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  apellidoDenunciado: {
                    contains: busqueda,
                    mode: 'insensitive'
                  }
                },
                {
                  dniDenunciado: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            numeroFiscalizacion: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            numeroLegales: {
              contains: busqueda,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        denuncia: true,
        numeroFiscalizacion: true,
        numeroLegales: true,
        areas: {
          include: {
            area: true
          }
        },
        id: true,
        createdAt: true,
        fechaFin: true,
        estado: true,
        fiscalizaciones: {
          select: {
            titulo: true,
            id: true
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
        }
      },
      orderBy
    });
  }

  contarExpedientesByAdminId({
    empleadoId,
    busqueda,
    filter
  }: {
    empleadoId: number;
    busqueda?: string;
    filter?: any;
  }) {
    return prisma.expediente.count({
      where: {
        empleadosAsignados: {
          some: {
            usuarioId: empleadoId
          }
        },
        ...filter,
        OR: [
          {
            denuncia: {
              OR: [
                {
                  nombreDenunciado: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  apellidoDenunciado: {
                    contains: busqueda,
                    mode: 'insensitive'
                  }
                },
                {
                  dniDenunciado: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            numeroFiscalizacion: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            numeroLegales: {
              contains: busqueda,
              mode: 'insensitive'
            }
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
    filter,
    isFiscalizacion
  }: {
    areaId: number;
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
    filter?: any;
    isFiscalizacion: boolean;
  }) {
    let orderBy = {};

    if (columna === 'nombre' || columna === 'apellido' || columna === 'dni') {
      if (isFiscalizacion) {
        orderBy = {
          denuncia: {
            [this.getNombreColumnaDenuncia(columna)]: orden
          }
        };
      } else {
        orderBy = {
          carpeta: {
            usuario: {
              [columna]: orden
            }
          }
        };
      }
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.expediente.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        areas: {
          some: {
            areaId,
            deleted: null
          }
        },
        ...filter,
        OR: [
          {
            denuncia: {
              OR: [
                {
                  nombreDenunciado: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  apellidoDenunciado: {
                    contains: busqueda,
                    mode: 'insensitive'
                  }
                },
                {
                  dniDenunciado: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            numeroFiscalizacion: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            numeroLegales: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            empleadosAsignados: {
              some: {
                usuario: {
                  OR: [
                    {
                      nombre: { contains: busqueda, mode: 'insensitive' }
                    },
                    {
                      apellido: { contains: busqueda, mode: 'insensitive' }
                    }
                  ]
                }
              }
            }
          }
        ]
      },
      select: {
        denuncia: true,
        empleadosAsignados: {
          select: {
            usuario: true
          }
        },
        numeroFiscalizacion: true,
        numeroLegales: true,
        areas: {
          include: {
            area: true
          }
        },
        id: true,
        createdAt: true,
        fechaFin: true,
        estado: true,
        fiscalizaciones: {
          select: {
            titulo: true,
            id: true
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
        }
      },
      orderBy
    });
  }

  contarExpedienteByArea({
    areaId,
    busqueda,
    filter
  }: {
    areaId: number;
    busqueda?: string;
    filter?: any;
  }) {
    return prisma.expediente.count({
      where: {
        areas: {
          some: {
            areaId,
            deleted: null
          }
        },
        ...filter,
        OR: [
          {
            denuncia: {
              OR: [
                {
                  nombreDenunciado: { contains: busqueda, mode: 'insensitive' }
                },
                {
                  apellidoDenunciado: {
                    contains: busqueda,
                    mode: 'insensitive'
                  }
                },
                {
                  dniDenunciado: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            numeroFiscalizacion: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            numeroLegales: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            empleadosAsignados: {
              some: {
                usuario: {
                  OR: [
                    {
                      nombre: { contains: busqueda, mode: 'insensitive' }
                    },
                    {
                      apellido: { contains: busqueda, mode: 'insensitive' }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    });
  }

  findFamilia(id: number) {
    return prisma.expediente.findUnique({
      where: {
        id
      },
      include: {
        tramitesHijos: true,
        expedientesHijos: true,
        tramitePadre: true,
        expedientePadre: true,
        procesosLegales: {
          include: {
            cedulas: true
          }
        },
        fiscalizaciones: true,
        cedulas: true
      }
    });
  }

  asignarEmpleado({
    empleadoId,
    expedienteId
  }: {
    empleadoId: number;
    expedienteId: number;
  }) {
    return prisma.expediente.update({
      where: {
        id: expedienteId
      },
      data: {
        empleadosAsignados: {
          connect: {
            usuarioId: empleadoId
          }
        }
      }
    });
  }

  desasignarEmpleado({
    empleadoId,
    expedienteId
  }: {
    empleadoId: number;
    expedienteId: number;
  }) {
    return prisma.expediente.update({
      where: {
        id: expedienteId
      },
      data: {
        empleadosAsignados: {
          disconnect: {
            usuarioId: empleadoId
          }
        }
      }
    });
  }

  findByIdConCarpeta(expedienteId: number) {
    return prisma.expediente.findUnique({
      where: {
        id: expedienteId
      },
      include: {
        carpeta: true,
        fiscalizaciones: true,
        denuncia: true
      }
    });
  }

  getNombreColumnaDenuncia = (columna: string) => {
    switch (columna) {
      case 'nombre':
        return 'nombreDenunciado';
      case 'apellido':
        return 'apellidoDenunciado';
      case 'dni':
        return 'dniDenunciado';
      default:
        return columna;
    }
  };

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
        denuncia: {
          [this.getNombreColumnaDenuncia(columna)]: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.expediente.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        ...filter,
        areas: {
          some: {
            areaId
          }
        },
        empleadosAsignados: {
          none: {
            areaId
          }
        },
        OR: [
          {
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
                },
                {
                  dniDenunciado: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            numeroFiscalizacion: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            numeroLegales: {
              contains: busqueda,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        areas: { include: { area: true } },
        carpeta: {
          include: {
            usuario: true
          }
        },
        denuncia: true
      },
      orderBy
    });
  }

  contarTotalSinAsignar({
    areaId,
    busqueda,
    filter
  }: {
    areaId: number;
    busqueda?: string;
    filter?: any;
  }) {
    return prisma.expediente.count({
      where: {
        ...filter,
        areas: {
          some: {
            areaId
          }
        },
        empleadosAsignados: {
          none: {
            areaId
          }
        },
        OR: [
          {
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
                },
                {
                  dniDenunciado: { contains: busqueda, mode: 'insensitive' }
                }
              ]
            }
          },
          {
            numeroFiscalizacion: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            numeroLegales: {
              contains: busqueda,
              mode: 'insensitive'
            }
          }
        ]
      }
    });
  }

  contarExpedientesPorEmpleado(empleadoId: number) {
    return prisma.expediente.count({
      where: {
        empleadosAsignados: {
          some: {
            usuarioId: empleadoId
          }
        }
      }
    });
  }

  contarExpedientesActivos() {
    return prisma.expediente.count({
      where: {
        estado: { not: 'archivado' }
      }
    });
  }

  cambiarArea({
    expedienteId,
    areaId
  }: {
    expedienteId: number;
    areaId: number;
  }) {
    return prisma.expediente.update({
      where: {
        id: expedienteId
      },
      data: {
        areas: {
          updateMany: {
            where: {
              expedienteId
            },
            data: {
              deleted: new Date()
            }
          },
          upsert: {
            where: {
              areaId_expedienteId: {
                expedienteId,
                areaId
              }
            },
            create: {
              areaId
            },
            update: {
              deleted: null
            }
          }
        }
      }
    });
  }

  changeStatus({
    status,
    expedienteId
  }: {
    status: EstadoExpediente;
    expedienteId: number;
  }) {
    return prisma.expediente.update({
      where: {
        id: expedienteId
      },
      data: {
        estado: status
      }
    });
  }

  finalizarExpediente(expedienteId: number) {
    return prisma.expediente.update({
      where: {
        id: expedienteId
      },
      data: {
        estado: 'finalizado'
      }
    });
  }
}
export default new ExpedienteServices();
