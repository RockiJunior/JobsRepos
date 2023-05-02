import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import areaValidator from '../validators/area.validator';

class AreaController {
  async getAllAreas(req: Request, res: Response) {
    try {
      const areas = await areaValidator.getAllAreas();

      return res.status(200).json(areas);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new AreaController();
