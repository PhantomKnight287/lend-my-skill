import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './constants';
import { PrismaService } from './services/prisma/prisma.service';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.enableCors();
  app.use(morgan('dev'), helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
  // using this we make make breaking changes to the code with different api version and not break the existing code
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(process.env.PORT || 5000);
  await app.get(PrismaService).enableShutdownHooks(app);
  console.log(`🚀 Launched at http://localhost:${process.env.PORT || 5000}`);
}
bootstrap();
