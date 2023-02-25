import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class TokensGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request.user as PayloadToken;
    const token = request.headers.authorization.replace(/Bearer /g, '');

    try {
      return this.authService.validateToken(payload.id, token);
    } catch {
      return false;
    }
  }
}
