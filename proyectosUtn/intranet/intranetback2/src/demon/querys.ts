import {
  Documento,
  InputsValueFiscalizacion,
  Validaciones
} from '@prisma/client';
import prisma from '../config/db';
import procesoLegalesPasos from '../data/procesoLegales';
import { InputName } from '../data/seed/inputs/inputs';
import { tiposTramites } from '../data/seed/tipos';
import formularioFiscalizacion from '../data/seed/tiposFiscalizacion/fiscalizacion';
import {
  IExpediente,
  IFiscalizacion
} from '../interfaces/expediente.interface';
import { IPaso } from '../interfaces/pasos.interface';
import { IInput, ITramite } from '../interfaces/tramite.interface';
import Exception from '../utils/Exception';
import { getNumeroExpediente } from '../utils/getNumeroExpediente';

export const tramitefindById = async (id: number) => {
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
              matricula: true
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
};

interface IInputsValueFiscalizacion extends InputsValueFiscalizacion {
  archivos: Documento[];
}

export interface Input {
  nombre: InputName;
  requerido: (boolean | InputName)[];
  isDisabled?: boolean;
  padre: InputName | undefined;
  multiple?: boolean;
  prefijo?: string;
}

interface IIInput extends Input {
  nombre: InputName;
  inputValueFiscalizacion?: IInputsValueFiscalizacion;
  validaciones: Validaciones | null;
  titulo: string;
  tipo: string;
}

export const expedientefindById = async (id: number) => {
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
          }
        }
      },
      empleadosAsignados: true,
      procesosLegales: {
        include: {
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
        const newInputs: IIInput[] = [];
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

  const procesosLegales = expedienteDB.procesosLegales.map((procesoLegal) => ({
    ...procesoLegal,
    pasoActualLabel: {
      label: `${procesoLegal.pasoActual + 1} de ${procesoLegalesPasos.length}`,
      title: procesoLegalesPasos[procesoLegal.pasoActual].intraTitle
    },
    pasos: procesoLegalesPasos
  }));

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
};

export const procesoLegalesFindById = async (id: number) => {
  const procesolegalesDB = await prisma.procesoLegales.findUnique({
    where: {
      id
    },
    include: {
      expediente: true,
      cedulas: true,
      resoluciones: true,
      fallos: true,
      notas: true,
      archivos: true,
      dictamen: true,
      despachoImputacion: true
    }
  });
  return procesolegalesDB;
};
