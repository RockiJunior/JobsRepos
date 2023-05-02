import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import usersValidator from '../validators/users.validator';

class UsersController {
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await usersValidator.getById(Number(id));
      return res.status(200).json(user);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const { nombre, apellido, dni, email, contrasenia } = req.body;
    try {
      const user = await usersValidator.create({
        nombre,
        apellido,
        dni,
        email,
        contrasenia
      });

      const { contrasenia: unused, ...userWithOutPassword } = user;

      return res.status(200).json(userWithOutPassword);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nombre, apellido, dni, email, contrasenia, datos } = req.body;
    try {
      const userUpdated = await usersValidator.update(Number(id), {
        nombre,
        apellido,
        dni,
        email,
        contrasenia,
        datos
      });
      const { contrasenia: unused, ...userWithOutPassword } = userUpdated;

      return res.status(200).json(userWithOutPassword);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const userDelete = await usersValidator.delete(Number(id));
      return res.status(200).json(userDelete);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async verifyByEmail(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const verify = await usersValidator.verifyByEmail(email);
      return res.status(200).json('Success');
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getMatriculados(req: Request, res: Response) {
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'asc';
    const columna = req.query.columna ? String(req.query.columna) : 'id';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';
    const { usuarioid } = req.headers;

    try {
      const matricula = await usersValidator.getMatriculados({
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(matricula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getUsuariosConCarpeta(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'asc';
    const columna = req.query.columna ? String(req.query.columna) : 'id';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';
    const filter = req.query.filter ? String(req.query.filter) : '';

    try {
      const matricula = await usersValidator.getUsuariosConCarpeta({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        rawFilter: filter
      });
      return res.status(200).json(matricula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new UsersController();
