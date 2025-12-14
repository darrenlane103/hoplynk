import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
  const isDevelopment = nodeEnv === 'development';

  const port = configService.get<string>('PORT') || (isDevelopment ? '3001' : '3000');
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');

  let corsOrigins: string[];
  if (allowedOrigins) {
    corsOrigins = allowedOrigins.split(',').map((origin) => origin.trim());
  } else if (isDevelopment) {
    corsOrigins = ['http://localhost:3000'];
    logger.warn('ALLOWED_ORIGINS not set, defaulting to localhost:3000 for development');
  } else {
    logger.error(`ALLOWED_ORIGINS is required in ${nodeEnv} environment`);
    process.exit(1);
  }

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(port);

  if (isDevelopment) {
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Environment: ${nodeEnv}`);
    logger.log(`CORS allowed origins: ${corsOrigins.join(', ')}`);
  } else {
    logger.log(`Application started on port ${port}`);
    logger.log(`Environment: ${nodeEnv}`);
    logger.log(`CORS enabled for ${corsOrigins.length} origin(s)`);
  }
}

bootstrap();
