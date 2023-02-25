import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PayloadToken } from '../models/token.model';
import { PartnersService } from '../../api/partners/partners.service';

@Injectable()
export class PartnerGuard implements CanActivate {
  constructor(private partnerService: PartnersService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request.user as PayloadToken;
    const token = request.headers.authorization;
    return this.partnerService.findOneGuard(payload.id, token).then(response => {
      if (!response.result.sessions.accessToken) {
        throw new UnauthorizedException('La cuenta debe ser verificada.');
      }
      request.partner = response.result;
      return true;
    });
  }
}
