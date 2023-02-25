import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvironmentVariablesService } from './config/environment/environment.variables.service';
import { useRequestLogging } from './middleware/logger';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const response = errors.reduce(
          (response, error) => {
            response.message[error.property] = Object.values(
              error.constraints,
            )[0];
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
  app.enableCors();
  useRequestLogging(app);
  const configService = app.get(EnvironmentVariablesService);
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Academy-Backend-API')
    .setDescription('Academy-CMS')
    .setVersion('0.1')
    .addTag('Telcel')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs/', app, document);

  await app.listen(configService.getPort());
}
bootstrap();
