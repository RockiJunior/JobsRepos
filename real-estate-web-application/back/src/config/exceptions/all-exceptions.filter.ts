import {
	Catch,
	ExceptionFilter,
	ArgumentsHost,
	HttpStatus,
	HttpException,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerEntity } from '../../api/GeneralUsers/_logger/entities/logger.entity';
import { Repository } from 'typeorm';
import { ExceptionResponseErrorDto } from './dto/exception-response-errors.dto';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);
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
		const { method, url, body, headers } = req;

		const auth = headers.authorization;
		let errorLog: any;

		if (auth) {
			const token = auth.split(' ')[1];
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			const id = decode['id'];
			let errorLog: string;
			if (body && id) {
				//  ------------------------------------------------------------------------------------
				errorLog = `\n Response Code: ${statusCode} - Method: ${method} - URL: ${url}
				Body: ${body.email},
				UserId: ${id}\n,
				${JSON.stringify(errorResponse)}
				${exception instanceof HttpException ? exception.stack : error}\n`;

				return errorLog;
			} else if (!body && id) {
				//  ------------------------------------------------------------------------------------
				errorLog = `\n Response Code: ${statusCode} - Method: ${method} - URL: ${url}
				UserId: ${id}\n
				${JSON.stringify(errorResponse)}
				${exception instanceof HttpException ? exception.stack : error}\n`;

				return errorLog;
			}
		} else {
			//  ------------------------------------------------------------------------------------
			errorLog = `\n Response Code: ${statusCode} - Method: ${method} - URL: ${url}
		${JSON.stringify(errorResponse)}
		${exception instanceof HttpException ? exception.stack : error}\n`;
			return errorLog;
		}
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

	async catch(exception: any, host: ArgumentsHost) {
		this.logger.debug('Type Error');
		this.logger.debug(exception.constructor.name);

		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();
		const req = ctx.getRequest<Request>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let errorCode = `${exception.constructor.name}`;
		let errorMessage = exception.message || null;
		let customMessage = null;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			customMessage = exception.getResponse();
			if (customMessage.error === 'Forbidden') {
				errorMessage = 'Acceso denegado';
			}
			if (Array.isArray(customMessage.message)) {
				errorMessage = customMessage.message[0];
			}
		} else if (exception.hasOwnProperty('errorCode')) {
			errorCode = exception.errorCode;
		}

		this.logger.error(status);
		this.logger.error(errorMessage);
		this.logger.debug(exception.stack);

		const logger = this.loggerRepository.create({
			method: req.method,
			url: req.url,
			headers: req.headers,
			statusCode: status,
			error: errorMessage,
		});
		await this.loggerRepository.save(logger);

		const errorResponse = this.getErrorResponse(status, errorMessage, req);
		const errorLog = this.getErrorLog(errorResponse, req, exception);
		this.writeErrorLogToFile(errorLog);

		const customErrorResponse = new ExceptionResponseErrorDto(
			status,
			errorCode,
			errorMessage
		);

		res.status(status).json(customErrorResponse);
	}
}
