import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthQueryStringGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    let getUrlToken = context.switchToHttp().getRequest()['query']['auth_token'] || undefined;
    if (getUrlToken) {
      const headers = context.switchToHttp().getRequest()['headers'];
      getUrlToken = getUrlToken.replace(/Bearer /g, '');
      headers['authorization'] = 'Bearer ' + getUrlToken;
    }
    return super.canActivate(context);
  }
}
