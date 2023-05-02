import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [config],
		}),
		MailerModule.forRoot({
			transport: {
				host: `${process.env.MAILER_HOST}`,
				port: parseInt(`${process.env.MAILER_PORT}`), // this port is from mailtrap
				secure: false,
				auth: {
					user: `${process.env.MAILER_AUTH_USER}`,
					pass: `${process.env.MAILER_AUTH_PASS}`,
				},
			},
			defaults: {
				from: `${process.env.MAILER_AUTH_USER}`,
			},
			template: {
				dir: join(__dirname, 'templates'),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: false,
				},
			},
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
