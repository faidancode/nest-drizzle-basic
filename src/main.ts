import { NestFactory } from '@nestjs/core';
import { AppConfig } from './config/app.config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ZodValidationPipe } from './common/http/zod.validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig = app.get(AppConfig);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ZodValidationPipe(), // <— GLOBAL
  );

  const port = appConfig.port;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
