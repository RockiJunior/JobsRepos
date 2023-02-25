// Libraries
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
// Databases, Controllers, Services & Dtos
import config from '../../../../config/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.JWT_SECRET,
		});
	}

	async validate(payload: any) {
		return payload;
	}
}
