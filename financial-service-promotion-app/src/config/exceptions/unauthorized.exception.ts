import { HttpExceptionExtended } from './extended/http-exception.extended';
import { HttpStatus } from '@nestjs/common';
import * as i18n from 'i18n';

export class UnauthorizedException extends HttpExceptionExtended {
  constructor(error: string, message?: string, meta?: string) {
    super(message, HttpStatus.UNAUTHORIZED, error ? error : 'unauthorized');

    let messageError: string;
    if (message && meta) {
      messageError = i18n.__(message, { meta });
    } else if (message) {
      messageError = i18n.__(message);
    } else {
      messageError = 'unauthorized';
    }
  }
}
