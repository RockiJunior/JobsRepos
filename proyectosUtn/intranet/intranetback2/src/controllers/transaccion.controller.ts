import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import transaccionValidator from '../validators/transaccion.validators';

class TransaccionController {
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const transaccion = await transaccionValidator.getById(Number(id));
      return res.status(200).json(transaccion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  // async create(req: Request, res: Response) {
  //   const { tramiteId, monto, estado, tipoTransaccionId, usuarioId } = req.body;
  //   try {
  //     const transaccion = await transaccionValidator.create(
  //       tramiteId,
  //       monto,
  //       estado,
  //       tipoTransaccionId,
  //       usuarioId
  //     );
  //     return res.status(200).json(transaccion);
  //   } catch (error) {
  //     return errorHandler(error, res);
  //   }
  // }

  // async update(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const { tramiteId, monto, estado, tipoTransaccionId } = req.body;
  //   try {
  //     const transaccionUpdated = await transaccionValidator.update(Number(id), {
  //       tramiteId,
  //       monto,
  //       estado,
  //       tipoTransaccionId
  //     });

  //     return res.status(200).json(transaccionUpdated);
  //   } catch (error) {
  //     return errorHandler(error, res);
  //   }
  // }

  async comprobante(req: Request, res: Response) {
    const { transaccionId, userId, documentoId } = req.body;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirComprobante = await transaccionValidator.comprobante({
        transaccionId: Number(transaccionId),
        userId,
        filename,
        documentoId
      });

      return res.status(200).json(recibirComprobante);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async aprobarRechazarTransac(req: Request, res: Response) {
    const { id } = req.params;
    const { estado, comentario } = req.body;
    try {
      const aprobarRechazarTransac =
        await transaccionValidator.aprobarRechazarTransac({
          id: Number(id),
          estado,
          comentario
        });

      return res.status(200).json(aprobarRechazarTransac);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async transaccionByEmpleado(req: Request, res: Response) {
    const { id } = req.params;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'asc';
    const columna = req.query.columna ? String(req.query.columna) : 'id';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';

    try {
      const transaccionByEmpleado =
        await transaccionValidator.transaccionByEmpleado({
          empleadoId: Number(id),
          limite: Number(limite),
          pagina: Number(pagina),
          busqueda,
          orden,
          columna
        });

      return res.status(200).json(transaccionByEmpleado);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getAll(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'asc';
    const columna = req.query.columna ? String(req.query.columna) : 'id';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';

    try {
      const transaccionByEmpleado = await transaccionValidator.getAll({
        empleadoId: Number(usuarioid),
        limite: Number(limite),
        pagina: Number(pagina),
        busqueda,
        orden,
        columna
      });
      return res.status(200).json(transaccionByEmpleado);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async elegirCuotas(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { transaccionId, opcionCuotasId } = req.body;
    try {
      const elegirCuotas = await transaccionValidator.elegirCuotas({
        transaccionId,
        opcionCuotasId,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(elegirCuotas);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getTypes(req: Request, res: Response) {
    try {
      const types = await transaccionValidator.getTypes();
      return res.status(200).json(types);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async crearTransaccionFiscalizacion(req: Request, res: Response) {
    try {
      const {
        fiscalizacionId,
        conceptosId,
        conceptoInfraccionNoMatriculadoId
      } = req.body;

      const transaccion =
        await transaccionValidator.crearTransaccionFiscalizacion({
          fiscalizacionId,
          conceptosId,
          conceptoInfraccionNoMatriculadoId
        });

      return res.status(200).json(transaccion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getConceptosFiscalizacion(req: Request, res: Response) {
    try {
      const conceptos = await transaccionValidator.getConceptosFiscalizacion();
      return res.status(200).json(conceptos);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transaccion = await transaccionValidator.delete(Number(id));
      return res.status(200).json(transaccion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new TransaccionController();
