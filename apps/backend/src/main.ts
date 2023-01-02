import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import './constants';
import { PORT } from './constants';
import { PrismaService } from './services/prisma/prisma.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'warn'],
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
  app.enableShutdownHooks(app.get(PrismaService));
  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
