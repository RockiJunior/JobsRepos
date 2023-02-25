import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import express from 'express';
import http from 'http';

async function bootstrap() {
	const server = express();
	const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
	//  ---------------------------------------------------------------------------- Swagger Documentation
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('CabaProp Documentation')
		.setDescription('Only for development')
		.setVersion('1.0')
		.addTag('CabaProp')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		})
	);
	http.createServer(server).listen(3001);
	// http.createServer(server).listen(3000); // en caso de necesitar otro servidor
	await app.init();
}
bootstrap();
