import permisos from '../data/permisos';
import disponibilidadService from '../services/disponibilidad.services';
import Exception from '../utils/Exception';
import { verificarPermiso } from '../utils/verificarPermisos';

class DisponibilidadValidator {
  async byAreaId(usuarioId: number, areaId: number) {
    await verificarPermiso([permisos.area.ver_disponibilidad], usuarioId);

    if (!areaId) {
      throw new Exception('El areaId es requerido');
    }

    const disponibilidad = await disponibilidadService.byAreaId(areaId);

    return disponibilidad;
  }

  async create(
    areaId: number,
    nombre: string,
    inicio: Date,
    fin: Date,
    lun: any,
    mar: any,
    mie: any,
    jue: any,
    vie: any,
    sab: any,
    dom: any
  ) {
    if (!areaId) {
      throw new Exception('El id del área es requerido');
    }

    if (!inicio) {
      throw new Exception('El inicio es requerido');
    }

    if (!fin) {
      throw new Exception('El fin es requerido');
    }

    const disponibilidad = await disponibilidadService.create(
      areaId,
      nombre,
      inicio,
      fin,
      lun,
      mar,
      mie,
      jue,
      vie,
      sab,
      dom
    );

    return disponibilidad;
  }

  async update(usuarioId: number, id: number, data: any) {
    await verificarPermiso([permisos.area.modificar_disponibilidad], usuarioId);

    if (!id) {
      throw new Exception('El id es requerido');
    }

    if (!data) {
      throw new Exception('Los datos son requeridos');
    }

    const disponibilidad = await disponibilidadService.update(id, data);

    return disponibilidad;
  }

  async delete(id: number) {
    if (!id) {
      throw new Exception('El id es requerido');
    }

    const disponibilidad = await disponibilidadService.delete(id);

    return disponibilidad;
  }
}

export default new DisponibilidadValidator();
