import { HttpException } from '@nestjs/common';

export class HttpExceptionExtended extends HttpException {
  error: string;
  constructor(message?: string, statusCode?: number, error?: string) {
    // console.log(message, error, statusCode);
    super(message, statusCode);
    this.error = error;
  }

  getErrorCode(): string {
    return this.error;
  }
}
