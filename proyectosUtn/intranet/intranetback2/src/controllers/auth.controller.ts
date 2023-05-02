import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import authValidator from '../validators/auth.validator';

class AuthController {
  async login(req: Request, res: Response) {
    const { email, contrasenia } = req.body;
    try {
      const { user, token } = await authValidator.login(email, contrasenia);

      return res.status(200).json({ user, token });
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async loginCabaprop(req: Request, res: Response) {
    const { email, contrasenia } = req.body;

    try {
      const { response, status } = await authValidator.loginCabaprop(
        email,
        contrasenia
      );

      return res.status(status).json({ response });
    } catch (error: any) {
      console.log(error);
      
      return res.status(400).json({ statusCode: 400, errorCode: 'Not found exception', message: error.message });
    }
  }

  async loginEmpleado(req: Request, res: Response) {
    const { email, contrasenia } = req.body;

    try {
      const { user, token } = await authValidator.loginEmpleado(
        email,
        contrasenia
      );

      return res.status(200).json({ user, token });
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async checkLogged(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const user = await authValidator.checkLogged(Number(userId));

      return res.status(200).json({ user });
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async reenviarMail(req: Request, res: Response) {
    const { email } = req.body;
    try {
      await authValidator.reenviarMail(email);

      return res.status(200).json('success');
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async recuperarContrasenia(req: Request, res: Response) {
    const { email, intranet } = req.body;
    try {
      await authValidator.recuperarContrasenia(email, intranet);

      return res.status(200).json('success');
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async restablecerContrasenia(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      await authValidator.restablecerContrasenia(email, password);

      return res.status(200).json('success');
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async solicitudCambioMail(req: Request, res: Response) {
    const { email, password } = req.body;
    const { usuarioid } = req.headers;

    try {
      await authValidator.solicitudCambioMail(email, password, Number(usuarioid));

      return res.status(200).json('Success');
    } catch (error) {
      return res.status(500).json('Rejected');
    }
  }

  async restablecerMail(req: Request, res: Response) {
    const { email, usuarioId } = req.body;
    try {
      await authValidator.restablecerMail({ email, usuarioId: Number(usuarioId) });

      return res.status(200).json('Success');
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new AuthController();
