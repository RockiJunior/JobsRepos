import areaService from '../services/area.services';
import Exception from '../utils/Exception';

class AreaValidator {
  async getAllAreas() {
    const areas = await areaService.getAll();

    if (!areas) {
      throw new Exception('No se encontraron áreas');
    }

    return areas;
  }
}

export default new AreaValidator();
