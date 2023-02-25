import { HttpStatus } from '@nestjs/common';
import * as i18n from 'i18n';
import { HttpExceptionExtended } from './extended/http-exception.extended';

export class UnprocessableException extends HttpExceptionExtended {
  constructor(errorCode: string, message?: string, meta?: string, directMessage?: string) {
    let messageError: string;

    if (directMessage) {
      messageError = directMessage;
    } else if (message && meta) {
      messageError = i18n.__(message, { meta });
    } else if (message) {
      messageError = i18n.__(message);
    } else {
      messageError = 'unprocessable';
    }

    super(messageError, HttpStatus.UNPROCESSABLE_ENTITY, errorCode ? errorCode : 'WII-ERR-UNPROCESSABLE');
  }
}
