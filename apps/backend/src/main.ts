import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import './constants';
import { PORT } from './constants';
import helmet from 'helmet';
import { PrismaService } from './services/prisma/prisma.service';
import '@total-typescript/ts-reset';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['debug', 'error', 'warn', 'log', 'verbose']
        : ['debug', 'error', 'warn'],
  });
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'default-src': ["'self'"],
        'connect-src': ["'self'", 'blob:', 'wss:', 'websocket.domain'],
      },
    }),
  );
  app.enableCors();
  app.get(PrismaService).enableShutdownHooks(app);
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  await app.listen(PORT);
  (globalThis.fetch as any) = require('node-fetch');
  console.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
