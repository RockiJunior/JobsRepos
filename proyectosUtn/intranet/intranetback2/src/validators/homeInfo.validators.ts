import areas from '../data/areas';
import empleadoServices from '../services/empleado.services';
import expedienteServices from '../services/expediente.services';
import tramiteServices from '../services/tramite.services';
import usersServices from '../services/users.services';

class HomeInfoValidator {
  async get(userId: number) {
    if (!userId) throw new Error('No se ha encontrado el usuario');

    const empleado = await empleadoServices.findById(userId);

    if (!empleado) throw new Error('No se ha encontrado el empleado');

    const areaId = empleado.areaId;

    const matriculadosCount = await usersServices.contarMatriculados('');
    const tramitesActivosCount =
      await tramiteServices.contarTramitesPendientes();
    const tramitesAsignadosCount =
      await tramiteServices.contarTramitesByAdminId({
        empleadoId: userId,
        filter: {
          estado: 'pendiente'
        }
      });
    const tramitesAreaCount = areaId
      ? await tramiteServices.contarTramitesPendientesByArea({ areaId })
      : 0;
    const tramitesSinAsignarCount = areaId
      ? await tramiteServices.contarTotalTramitesSinAsignarPorArea({ areaId })
      : 0;

    const expedientesActivosCount =
      await expedienteServices.contarExpedientesActivos();
    const expedientesAsignadosCount =
      await expedienteServices.contarExpedientesByAdminId({
        empleadoId: userId,
        filter: {
          estado: { not: 'archivado' }
        }
      });
    const expedientesAreaCount = areaId
      ? await expedienteServices.contarExpedienteByArea({ areaId })
      : 0;

    const expedientesSinAsignarCount = areaId
      ? await expedienteServices.contarTotalSinAsignar({
          areaId,
          busqueda: ''
        })
      : 0;
    
    const homeInfo = {
      matriculadosCount,

      tramitesActivosCount,
      tramitesAsignadosCount,
      tramitesAreaCount,
      tramitesSinAsignarCount,

      expedientesActivosCount,
      expedientesAsignadosCount,
      expedientesAreaCount,
      expedientesSinAsignarCount
    };

    return homeInfo;
  }
}

export default new HomeInfoValidator();
