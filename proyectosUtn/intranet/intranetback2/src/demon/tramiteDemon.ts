import prisma from '../config/db';
import dayjs from 'dayjs';
import { IPaso } from '../interfaces/pasos.interface';
import { tramiteOnExpiration } from '../utils/tramite/tramiteOnExpiration';
import permisos from '../data/permisos';
import { tramitefindById } from './querys';

export const tramiteDemon = async (now: any) => {
  const plazosVencidos = await prisma.plazo.findMany({
    where: {
      fechaVencimiento: {
        lte: now.toDate()
      },
      fechaFinalizacion: null
    }
  });

  plazosVencidos.forEach(async (plazo) => {
    let areas = plazo.areas.split(':');

    areas.forEach(async (area) => {
      let areasEmpleados = await prisma.area.findUnique({
        where: {
          id: Number(area)
        },
        include: {
          empleados: {
            include: {
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
          }
        }
      });
      if (areasEmpleados) {
        const empleados = areasEmpleados.empleados.filter((empleado) =>
          empleado.roles?.some((rol) => {
            return rol.PermisoRol?.some((permisoRol) => {
              return (
                permisoRol.permisoId ===
                permisos.notificaciones.notificacion_plazos_vencidos
              );
            });
          })
        );
        empleados.forEach(async (empleado) => {
          if (plazo.tramiteId) {
            const tramite = await prisma.tramite.findUnique({
              where: {
                id: plazo.tramiteId
              },
              include: {
                tipo: true
              }
            });
            if (tramite) {
              const pasoActual = tramite.tipo.pasos[
                tramite.pasoActual
              ] as any as IPaso;
              await prisma.notificacion.create({
                data: {
                  titulo: `El plazo del tramite ${plazo.tramiteId} ha expirado`,
                  descripcion: `Se ha producido en el paso ${tramite.pasoActual}: ${pasoActual.intraTitle}`,
                  usuarioId: empleado.usuarioId,
                  info: {
                    tipo: 'tramite',
                    tramiteId: plazo.tramiteId
                  }
                }
              });
            }
          }
        });
      }
    });
  });

  const tramitePendienteYExpiracion = await prisma.tramite.findMany({
    where: {
      estado: 'pendiente',
      NOT: {
        expiracion: null
      }
    }
  });

  const tramitePlazosVencidos = tramitePendienteYExpiracion.filter(
    (tramite) => {
      const fechaVencimiento = dayjs(tramite.expiracion);
      return fechaVencimiento.isBefore(now);
    }
  );

  tramitePlazosVencidos.forEach(async (vencido) => {
    const tramiteId = vencido.id;
    await prisma.tramite.update({
      where: {
        id: tramiteId
      },
      data: {
        estado: 'rechazado'
      }
    });

    const tramiteAction = await tramitefindById(tramiteId);

    await tramiteOnExpiration(tramiteAction);
  });
};
