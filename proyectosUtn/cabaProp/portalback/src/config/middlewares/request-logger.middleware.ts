import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerEntity } from '../../api/GeneralUsers/_logger/entities/logger.entity';
import { Repository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as geoip from 'geoip-lite';
import { Users } from 'src/api/GeneralUsers/users/entities/user.entity';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
	private readonly loggerConsole = new Logger(RequestLoggerMiddleware.name);
	constructor(
		@InjectRepository(LoggerEntity)
		private readonly loggerRepository: Repository<LoggerEntity>,
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		let userId: string;
		let statusCode: number;
		let auth = req.headers['authorization'];
		let body = req.body;
		let auxBody: any;
		if (body.password) {
			auxBody = { ...body };
			delete auxBody.password;
		}
		auxBody = { ...body };
		if (auth !== undefined && auth !== null) {
			const token = auth.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			userId = decoded['id'];
		}
		statusCode = res.statusCode;
		let ipAddress = req.headers['x-forwarded-for'];
		if (!ipAddress) {
			ipAddress = [`"local"- without proxy configuration`];
		}
		const geo = geoip.lookup(ipAddress.toString());
		// ---------------------------------------------------------------------- userData
		if (!userId) {
			const logger = this.loggerRepository.create({
				userId: `${ipAddress}`,
				ipAddress: ipAddress,
				location: geo,
				method: req.method,
				statusCode,
				url: req.baseUrl,
				headers: req.headers,
				body: auxBody,
			});
			await this.loggerRepository.save(logger);
			this.loggerConsole.log(
				`${req.method} ${req.baseUrl} status: ${statusCode} userId: ${userId} ip: ${ipAddress}`
			);
			next();
		} else if (userId) {
			const userFinded = await this.usersRepository.findOne({
				where: {
					id: userId,
				},
			});
			const {
				firstName,
				lastName,
				email,
				dni,
				realAddress,
				legalAddress,
				typeOfUser,
				adminUserId,
				status,
				registration,
			} = userFinded;
			const logger = this.loggerRepository.create({
				userId,
				ipAddress: ipAddress,
				location: geo,
				firstName,
				lastName,
				email,
				dni,
				realAddress,
				legalAddress,
				typeOfUser,
				adminUserId,
				status,
				registration,
				method: req.method,
				statusCode,
				url: req.baseUrl,
				headers: req.headers,
				body: auxBody,
			});
			await this.loggerRepository.save(logger);
			this.loggerConsole.log(
				`${req.method} ${req.baseUrl} status: ${statusCode} userId: ${userId} ip: ${ipAddress}`
			);
			next();
		}
	}
}
