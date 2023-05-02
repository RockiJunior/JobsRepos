import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
	ExpressAdapter,
	NestExpressApplication,
} from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import * as fs from 'fs';
import http from 'http';
import { AppModule } from './app.module';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { CronService } from './config/crons/cron.service';

async function bootstrap() {
	const server = express();
	const app = await NestFactory.create<NestExpressApplication>(
		AppModule,
		new ExpressAdapter(server)
	);
	// -------------------------------------------------------------------------------Proxy
	app.set('trust proxy', 1);
	// -------------------------------------------------------------------------------Statics files
	app.useStaticAssets(join(__dirname, '../uploads'), {
		prefix: '/uploads/',
	});
	// -------------------------------------------------------------------------------Crons
	const cron = app.get(CronService)
	cron.monthlyStatisticsCron()
	//  ------------------------------------------------------------------------------Swagger Documentation
	//  -------------------------------------- NO ELIMINAR COMENTARIO -------------------------------------
	//  ------------------------------- PUEDE SERVIR PARA CONFIGURAR SWAGGER ------------------------------
	// PLANTILLA CONFIGURACION SWAGGER
	// const config = new DocumentBuilder()
	// 	.addBearerAuth()
	// 	.setTitle('CabaProp Documentation')
	// 	.setDescription('Only for development')
	// 	.setVersion('1.0')
	// 	.addTag('CabaProp')
	// 	// .setBasePath('localhost:9000/api')
	// 	.build();
	//  ----------------------------------------------------------------------------------------------------
	const swaggerConfig = JSON.parse(
		fs.readFileSync('./swagger.json').toString()
	);

	const options = new DocumentBuilder().addBearerAuth().build();
	const document = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('api/docs', app, document, {
		swaggerOptions: {
			...options,
			security: [
				{
					bearerAuth: [],
				},
			],
		},
	});

	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		})
	);

	http.createServer(server).listen(process.env.SERVER_PORT);
	app.setGlobalPrefix('/api');
	await app.init();
}
bootstrap();
