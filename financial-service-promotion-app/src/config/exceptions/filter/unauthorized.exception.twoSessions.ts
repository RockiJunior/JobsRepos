import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UnauthorizedException as MyUnauthorizedException } from '../unauthorized.exception';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilterTwoSessions implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    let status = exception.getStatus();
    let error = 'Unauthorized';
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const { message } = new MyUnauthorizedException(
      '401',
      'Solo puedes tener una sesión activa, por favor vuelva a iniciar sesión',
    );

    response.status(status).json({
      statusCode: status,
      error: error,
      message: message,
    });
  }
}
