import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import empleadoValidator from '../validators/empleado.validator';

class EmpleadoController {
  async getByUserArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    try {
      const empleados = await empleadoValidator.getByUserArea(
        Number(usuarioid)
      );
      return res.status(200).json(empleados);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { usuarioid } = req.headers;
      const pagina = req.query.pagina || 1;
      const limite = req.query.limite || 10;
      const orden = req.query.orden ? String(req.query.orden) : 'asc';
      const columna = req.query.columna
        ? String(req.query.columna)
        : 'usuarioId';
      const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';

      const empleados = await empleadoValidator.getAll({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda
      });
      return res.status(200).json(empleados);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async crearEmpleado(req: Request, res: Response) {
    const { nombre, apellido, dni, email, constrasenia, roles, areaId } =
      req.body;

    const { usuarioid } = req.headers;

    try {
      await empleadoValidator.crearEmpleado({
        usuarioId: Number(usuarioid),
        nombre,
        apellido,
        dni,
        email,
        contrasenia: constrasenia,
        roles,
        areaId: Number(areaId)
      });
      return res.status(200).json({
        message: 'Empleado creado correctamente'
      });
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async updateEmpleado(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { nombre, apellido, dni, email, roles, areaId, empleadoId } =
      req.body;

    try {
      await empleadoValidator.updateEmpleado({
        empleadoId: Number(empleadoId),
        nombre,
        apellido,
        dni,
        email,
        roles,
        areaId: Number(areaId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json({
        message: 'Empleado actualizado correctamente'
      });
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async deleteEmpleado(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { empleadoId } = req.params;

    try {
      await empleadoValidator.deleteEmpleado({
        empleadoId: Number(empleadoId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json({
        message: 'Empleado eliminado correctamente'
      });
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new EmpleadoController();
