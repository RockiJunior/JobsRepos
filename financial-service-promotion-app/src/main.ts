import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationError } from 'class-validator';
// import { useRequestLogging } from './middleware/logger';
import * as fs from 'fs';
import { cronService } from './cronService/cron.service';
import { HttpExceptionFilter } from './config/exceptions/filter/http-exception.filter';

async function bootstrap() {
  await cronService();
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const response = errors.reduce(
          (response, error) => {
            response.message[error.property] = Object.values(error.constraints)[0];
            return response;
          },
          {
            statusCode: 400,
            error: 'Bad Request',
            message: {},
          },
        );
        return new BadRequestException(response);
      },
    }),
  );
  // useRequestLogging(app);
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API')
    .setDescription('FINCOMUN')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  //Export as JSON Swagger API
  //fs.writeFileSync('../fincomun-spec.json', JSON.stringify(document));

  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
