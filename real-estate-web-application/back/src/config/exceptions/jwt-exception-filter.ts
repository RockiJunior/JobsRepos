import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpStatus,
	HttpException,
	Logger,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerEntity } from '../../api/GeneralUsers/_logger/entities/logger.entity';
import { Repository } from 'typeorm';

@Catch(JsonWebTokenError)
export class JWTExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(JWTExceptionFilter.name);

	constructor(
		@InjectRepository(LoggerEntity)
		private readonly loggerRepository: Repository<LoggerEntity>
	) {}

	private getErrorResponse = (
		status: any,
		errorMessage: string,
		req: Request
	): any => ({
		statusCode: status,
		error: errorMessage,
		path: req.url,
		method: req.method,
		timeStamp: new Date(),
		message: errorMessage,
	});

	private getErrorLog = (
		errorResponse: any,
		req: Request,
		exception: unknown
	) => {
		const { statusCode, error } = errorResponse;
		const { method, url } = req;
		let errorLog = `\n Response Code: ${statusCode} - Method: ${method} - URL: ${url}
		${JSON.stringify(errorResponse)}
		${exception instanceof HttpException ? exception.stack : error}\n`;
		return errorLog;
	};

	private writeErrorLogToFile = (errorLog: any) => {
		const date = new Date();
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		const currentDate = `${day}-${month}-${year}`;

		if (fs.existsSync(`./logs/errors/${currentDate}.log`)) {
			fs.appendFile(
				`./logs/errors/${currentDate}.log`,
				errorLog,
				'utf8',
				(err) => {
					if (err) throw err;
				}
			);
		} else {
			fs.writeFile(`./logs/errors/${currentDate}.log`, errorLog, (err) => {
				if (err) throw err;
			});
		}
	};

	async catch(exception: JsonWebTokenError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse();
		const req = ctx.getRequest();

		const errorResponse = this.getErrorResponse(401, res.message, req);
		const errorLog = this.getErrorLog(errorResponse, req, exception);
		this.writeErrorLogToFile(errorLog);

		const logger = this.loggerRepository.create({
			method: req.method,
			url: req.url,
			headers: req.headers,
			statusCode: HttpStatus.UNAUTHORIZED || 404,
			error: 'JWT Inválido',
		});
		await this.loggerRepository.save(logger);

		this.logger.error(HttpStatus.UNAUTHORIZED || 404);
		this.logger.error('Jwt Inválido');
		this.logger.debug(exception.stack);

		res.status(HttpStatus.UNAUTHORIZED).json({
			statusCode: HttpStatus.UNAUTHORIZED,
			error: exception.message || 'JWT Inválido',
			message: 'JWT Inválido',
		});
	}
}
