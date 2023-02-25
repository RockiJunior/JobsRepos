import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
	constructor() {
		super({
			clientID: process.env.FB_ID,
			clientSecret: process.env.FB_SECRET,
			callbackURL: process.env.FB_CALLBACK,
			scope: 'email',
			profileFields: [
				'id',
				'emails',
				'first_name',
				'last_name',
				'displayName',
				'link',
				'photos',
			],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: (err: any, user: any, info?: any) => void
	): Promise<any> {
		const { name, emails, photos } = profile;
		const user = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			photos: photos[0].value,
			accessToken,
		};
		done(null, user);
	}
}
