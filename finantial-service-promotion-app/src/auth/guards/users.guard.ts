import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PayloadToken } from '../models/token.model';
import { UsersService } from 'src/api/users/services/users.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request.user as PayloadToken;
    const token = request.headers.authorization;
    return this.userService.findOneGuard(payload.id, token).then(() => {
      return true;
    });
  }
}
