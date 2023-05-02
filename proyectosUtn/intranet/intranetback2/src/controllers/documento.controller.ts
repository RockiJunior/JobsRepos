import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import documentoValidator from '../validators/documento.validator';

class DocumentoController {
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const deleted = await documentoValidator.delete(
        Number(id),
        Number(usuarioid)
      );
      return res.status(200).json(deleted);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new DocumentoController();
