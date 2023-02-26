import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		super(
		// 	{
		// 	clientID: "256044242886-oibj8tr4oa8st4i2jbqvggjrn9l56ol1.apps.googleusercontent.com",
		// 	clientSecret: "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",
		// 	callbackURL: "http://localhost:3001/clients/login/google/callback",
		// 	scope: ['email', 'profile'],
		// }
		{
			clientID: `${process.env.GOOGLE_CLIENT_ID}`,
			clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
			callbackURL: `${process.env.GOOGLE_CLIENT_CALLBACK_URL}`,
			scope: ['email', 'profile'],
		}
		
		);
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	): Promise<any> {
		const { name, emails, photos } = profile;
		const user = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			photo: photos[0].value,
			accessToken,
		};
		done(null, user);
	}
}
