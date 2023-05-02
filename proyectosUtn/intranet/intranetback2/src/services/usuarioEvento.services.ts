import { Usuario_Evento } from '@prisma/client';
import prisma from '../config/db';

class UsuarioEventoService {
  async create({
    usuarioId,
    tipoEventoId,
    info
  }: {
    usuarioId: number;
    tipoEventoId: number;
    info?: { [key: string]: any };
  }) {
    return prisma.usuario_Evento.create({
      data: {
        usuarioId,
        tipoEventoId,
        info
      }
    });
  }

  async findById({ id, usuarioId }: { id: number; usuarioId: number }) {
    return prisma.usuario_Evento.findFirst({
      where: {
        id
      },
      include: {
        evento: {
          include: {
            tipoEvento: {
              include: {
                tipoTramite: {
                  include: {
                    tramite: {
                      where: {
                        carpeta: {
                          usuarioId
                        },
                        estado: 'pendiente'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async getListaEsperaEventos() {
    return prisma.usuario_Evento.findMany({
      where: {
        estado: 'pendiente'
      },
      include: {
        tipoEvento: true,
        usuario: true
      }
    });
  }

  async update(id: number, data: Partial<Usuario_Evento>) {
    return prisma.usuario_Evento.update({
      where: {
        id
      },
      data: {
        ...data,
        info: data.info || {}
      }
    });
  }
}

export default new UsuarioEventoService();
