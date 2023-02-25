import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as i18n from 'i18n';
import { HttpExceptionExtended } from '../extended/http-exception.extended';
import { ExceptionResponseError } from '../dto/exceptions.response.errors';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger('HttpExceptionFilter');

  catch(exception: HttpExceptionExtended, host: ArgumentsHost) {
    this.logger.debug('Type Error');
    this.logger.debug(exception.constructor.name);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const variables = Object.keys(exception);
    let errorCode = `${exception.constructor.name}`;

    if (variables.includes('errorCode')) {
      errorCode = exception.getErrorCode();
    }

    let messageError: string;

    switch (exception.message) {
      case 'BadRequest':
        messageError = i18n.__('Bad request');
        break;
      case 'Unauthorized':
        messageError = i18n.__(
          'No tiene permisos para realizar esta acción o su sesión ha caducado. Por favor inicie sesión nuevamente.',
        );
        break;
      case 'Forbidden':
        messageError = i18n.__('Forbidden');
        break;
      case 'NotFound':
        messageError = i18n.__('Not Found');
        break;
      case 'NotAcceptable':
        messageError = i18n.__('Not Acceptable');
        break;
      case 'Conflict':
        messageError = i18n.__('Conflict');
        break;
      case 'PreconditionFailed':
        messageError = i18n.__('Precondition Failed');
        break;
      case 'InternalServerError':
        messageError = i18n.__('InternalServerError');
        break;
      case 'Su sesión ha caducado, por favor vuelva a iniciar sesión':
        messageError = i18n.__('Su sesión ha caducado, por favor vuelva a iniciar sesión');
      default:
        messageError = exception.message || null;
        break;
    }

    this.logger.error(exception.getStatus());
    this.logger.error(messageError);
    this.logger.debug(exception.stack);

    const errorResponse = new ExceptionResponseError(status, errorCode, messageError);

    response.status(status).json(errorResponse);
  }
}
