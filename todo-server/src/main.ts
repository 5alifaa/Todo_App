import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  }); // Enable CORS
  app.use(helmet()); // Enable Helmet
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // To strip unwanted properties
      transform: true, // To transform payloads to DTO instances
      forbidNonWhitelisted: true, // To throw an error when unwanted properties are present
      transformOptions: {
        // To enable implicit type conversion
        enableImplicitConversion: true,
      },
    }),
  ); // Enable validation pipe
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
