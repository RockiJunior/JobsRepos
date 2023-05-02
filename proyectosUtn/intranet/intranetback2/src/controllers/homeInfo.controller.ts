import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import homeInfoValidators from '../validators/homeInfo.validators';

class HomeInfoController {
  async get(req: Request, res: Response) {
    const { usuarioid } = req.headers;

    try {
      const homeInfo = await homeInfoValidators.get(Number(usuarioid));

      return res.status(200).json(homeInfo);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new HomeInfoController();
