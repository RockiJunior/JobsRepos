import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerEntity } from '../../api/GeneralUsers/_logger/entities/logger.entity';
import { Repository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
	private readonly loggerConsole = new Logger(RequestLoggerMiddleware.name);
	constructor(
		@InjectRepository(LoggerEntity)
		private readonly loggerRepository: Repository<LoggerEntity>
	) {}
	async use(req: Request, res: Response, next: NextFunction) {
		let userId: string;
		let statusCode: number;
		let auth = req.headers['authorization'];
		if (auth !== undefined && auth !== null) {
			const token = auth.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			userId = decoded['id'];
		}
		statusCode = res.statusCode;
		const logger = this.loggerRepository.create({
			method: req.method,
			url: req.url,
			headers: req.headers,
			statusCode,
			userId,
		});
		await this.loggerRepository.save(logger);
		this.loggerConsole.log(
			`${req.method}${req.url}${statusCode} userId: ${userId}`
		);
		next();
	}
}
