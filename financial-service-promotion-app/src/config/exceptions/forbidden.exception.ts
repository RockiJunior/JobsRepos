import { HttpStatus } from '@nestjs/common';
import * as i18n from 'i18n';
import { HttpExceptionExtended } from './extended/http-exception.extended';

export class ForbiddenException extends HttpExceptionExtended {
  constructor(errorCode: string, message?: string, meta?: string) {
    let messageError: string;

    if (message && meta) {
      messageError = i18n.__(message, { meta });
    } else if (message) {
      messageError = i18n.__(message);
    } else {
      messageError = 'forbidden';
    }

    super(messageError, HttpStatus.FORBIDDEN, errorCode ? errorCode : 'WII-ERR-FORBIDDEN');
  }
}
