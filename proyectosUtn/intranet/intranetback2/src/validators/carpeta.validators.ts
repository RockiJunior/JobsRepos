import carpetaServices from '../services/carpeta.services';
import Exception from '../utils/Exception';

class CarpetaValidator {
  async getById(id: number) {
    if (!id) {
      throw new Exception('La identificación de la carpeta es requerido');
    }

    const carpetaDB = await carpetaServices.findById(id);

    if (!carpetaDB) {
      throw new Exception('Carpeta no encontrado');
    }
    return carpetaDB;
  }

  /* async create(descripcion: string, usuarioId: number) {
    if (!descripcion) {
      throw new Exception('La descripcion es requerida');
    }
    if (!usuarioId) {
      throw new Exception('La identificación del usuario es requerida');
    }

    const carpeta = await carpetaServices.create(descripcion, usuarioId);

    return carpeta;
  } */
}

export default new CarpetaValidator();
