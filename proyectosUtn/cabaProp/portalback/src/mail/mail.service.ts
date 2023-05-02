import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendUserConfirmation(user: any, token: string) {
		const url = `${process.env.FRONT_URL}/validar-token/${token}`;
		try {
			await this.mailerService.sendMail({
				to: user.email,
				subject: 'CABAPROP | ¡Confirmá tu cuenta!',
				template: './confirmations',
				context: {
					firstName: user.firstName,
					url,
				},
			});
		} catch (err) {
			return err;
		}
	}

	async sendClientConfirmation(user: any, token: string) {
		const url = `${process.env.CLIENT_URL}/confirmar-registro/${token}`;
		try {
			await this.mailerService.sendMail({
				to: user.email,
				subject: '¡Confirmá tu cuenta de CABAPROP!',
				template: './confirmations',
				context: {
					firstName: user.firstName,
					url,
				},
			});
		} catch (err) {
			return err;
		}
	}

	async sendClientCreated(user: any, token: string) {
		try {
			await this.mailerService.sendMail({
				to: user.email,
				subject: '¡Su cuenta ha sido confirmada!',
				template: './confirmated',
				context: {
					firstName: user.firstName,
					lastName: user.lastName,
				},
			});
		} catch (err) {
			return err;
		}
	}

	async sendUserRecovery(user: any, token: string) {
		const url = `${process.env.FRONT_URL}/restablecer-contrasena/${token}`;
		try {
			await this.mailerService.sendMail({
				to: user.email,
				subject: 'CABAPROP | ¡Recuperá tu cuenta!',
				template: './recovery',
				context: {
					firstName: user.firstName,
					url,
				},
			});
		} catch (err) {
			return err;
		}
	}

	async sendClientRecovery(user: any, token: string) {
		const url = `${process.env.CLIENT_URL}/restablecer-contrasena/${token}`;
		try {
			await this.mailerService.sendMail({
				to: user.email,
				subject: 'CABAPROP | ¡Recuperá tu cuenta!',
				template: './recovery',
				context: {
					firstName: user.firstName,
					url,
				},
			});
		} catch (err) {
			return err;
		}
	}

	async sendUserCreatedNotification(admin: any, user: any) {
		await this.mailerService.sendMail({
			to: admin.email,
			subject: 'CABAPROP | Cuenta de usuario confirmada',
			template: './userCreated',
			context: {
				adminName: admin.firstName,
				userName: user.firstName,
				userlastName: user.lastName,
			},
		});
	}
}
