import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import errorHandler from './errorHandler';
import { IUsuario } from '../interfaces/users.interface';

declare const process: {
  env: {
    JWT_SECRET_USUARIO: string;
    JWT_SECRET_EMPLEADO: string;
  };
};

export const createTokenUsuario = ({ email }: { email: string }): string => {
  const accessToken = sign({ email }, process.env.JWT_SECRET_USUARIO, {
    expiresIn: '2h'
  });
  return accessToken;
};

export const createTokenUsuarioCabaprop = (user: any) => {
  const accessToken = sign(user, process.env.JWT_SECRET_USUARIO, {
    expiresIn: '2h'
  });
  return accessToken;
}

export const createTokenEmpleado = ({ email }: { email: string }): string => {
  const accessToken = sign({ email }, process.env.JWT_SECRET_EMPLEADO, {
    expiresIn: '2h'
  });
  return accessToken;
};

export const validateTokenUsuario = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessTokenUsuario = req.headers.authorization;

  if (accessTokenUsuario) {
    try {
      const validToken = verify(
        accessTokenUsuario,
        process.env.JWT_SECRET_USUARIO
      );
      if (validToken) {
        return next();
      }
      return errorHandler(new Error('Token invalido'), res, true);
    } catch (error) {
      return res.status(401).json({ error });
    }
  } else {
    return errorHandler(new Error('Usuario no autenticado'), res, true);
  }
};

export const validateTokenEmpleado = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessTokenEmpleado = req.headers.authorization;

  if (accessTokenEmpleado) {
    try {
      const validToken = verify(
        accessTokenEmpleado,
        process.env.JWT_SECRET_EMPLEADO
      );
      if (validToken) {
        return next();
      }
      return errorHandler(new Error('Token invalido'), res, true);
    } catch (error) {
      return res.status(401).json({ error });
    }
  } else {
    return errorHandler(new Error('Usuario no autenticado'), res, true);
  }
};

export const validateTokenAmbos = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessTokenAmbos = req.headers.authorization;
  let validTokenUsuario;
  let validTokenEmpleado;
  if (accessTokenAmbos) {
    try {
      validTokenUsuario = verify(
        accessTokenAmbos,
        process.env.JWT_SECRET_USUARIO
      );
    } catch (error) {}

    try {
      validTokenEmpleado = verify(
        accessTokenAmbos,
        process.env.JWT_SECRET_EMPLEADO
      );
    } catch (error) {}

    if (validTokenUsuario || validTokenEmpleado) {
      return next();
    }

    return errorHandler(new Error('Token invalido'), res, true);
  } else {
    return errorHandler(new Error('Usuario no autenticado'), res, true);
  }
};
