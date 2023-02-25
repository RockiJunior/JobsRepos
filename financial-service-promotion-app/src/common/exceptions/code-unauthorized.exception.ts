import { UnauthorizedException } from '@nestjs/common';

export class CodeUnauthorizedException {
  constructor(code: string, message: string) {
    return new UnauthorizedException({
      error: 'Unauthorized',
      statusCode: 401,
      code,
    });
  }
}
