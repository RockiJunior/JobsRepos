import alertaServices from '../services/alerta.services';
import Exception from '../utils/Exception';

class AlertaValidator {
  async create({
    mensaje,
    fecha,
    areaId,
    empleadoId
  }: {
    mensaje: string;
    fecha: Date;
    areaId?: number;
    empleadoId?: number;
  }) {
    if (!mensaje) {
      throw new Exception('El mensaje es requerido');
    }
    if (!fecha) {
      throw new Exception('La fecha es requerida');
    }
    const alerta = await alertaServices.create({
      mensaje,
      fecha,
      areaId,
      empleadoId
    });

    return alerta;
  }
}

export default new AlertaValidator();
