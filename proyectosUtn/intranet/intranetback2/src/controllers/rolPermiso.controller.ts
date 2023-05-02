import rolPermisoValidator, {
  RolPermisoValidatorClass
} from '../validators/rolPermiso.validator';
import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';

class RolPermisoControllerClass {
  rolPermisoValidator: RolPermisoValidatorClass;

  constructor() {
    this.rolPermisoValidator = rolPermisoValidator;
    this.getAllRoles = this.getAllRoles.bind(this);
    this.getAllPermisos = this.getAllPermisos.bind(this);
    this.createRol = this.createRol.bind(this);
    this.updateRol = this.updateRol.bind(this);
    this.deleteRol = this.deleteRol.bind(this);
  }

  async getAllRoles(req: Request, res: Response) {
    try {
      const { usuarioid } = req.headers
      const roles = await this.rolPermisoValidator.getAllRoles(Number(usuarioid));

      return res.status(200).json(roles);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getAllPermisos(req: Request, res: Response) {
    try {
      const { usuarioid } = req.headers
      const permisos = await this.rolPermisoValidator.getAllPermisos(Number(usuarioid));

      return res.status(200).json(permisos);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async createRol(req: Request, res: Response) {
    const { nombre, permisos } = req.body;
    const { usuarioid } = req.headers

    try {
      const rol = await this.rolPermisoValidator.createRol(Number(usuarioid), nombre, permisos);

      return res.status(200).json(rol);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async updateRol(req: Request, res: Response) {
    const { nombre, permisos } = req.body;
    const { id } = req.params;
    const { usuarioid } = req.headers

    try {
      const rol = await this.rolPermisoValidator.updateRol(
        Number(usuarioid),
        Number(id),
        nombre,
        permisos
      );

      return res.status(200).json(rol);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async deleteRol(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers

    try {
      const rol = await this.rolPermisoValidator.deleteRol(Number(usuarioid), Number(id));

      return res.status(200).json(rol);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new RolPermisoControllerClass();
