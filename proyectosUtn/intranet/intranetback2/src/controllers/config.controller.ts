import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import configValidator from '../validators/config.validator';

class AlertaController {
  async get(req: Request, res: Response) {
    try {
      const config = await configValidator.get();

      return res.status(200).json(config);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async update(req: Request, res: Response) {
    const { config } = req.body;

    try {
      const configUpdated = await configValidator.update(config);

      return res.status(200).json(configUpdated);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new AlertaController();
