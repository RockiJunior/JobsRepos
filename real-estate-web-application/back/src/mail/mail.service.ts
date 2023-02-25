import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendUserConfirmation(user: any, token: string) {
		const url = `http://localhost:3000/validar-token/${token}`;
		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Testing email Service',
			template: './confirmations',
			context: {
				firstName: user.firstName,
				url,
			},
		});
	}

	async sendUserCreatedNotification(admin: any, user: any) {
		await this.mailerService.sendMail({
			to: admin.email,
			subject: 'Testing email Service',
			template: './userCreated',
			context: {
				adminName: admin.firstName,
				userName: user.firstName,
				userlastName: user.lastName,
			},
		});
	}

}
