import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.use(helmet());
  app.use(morgan('combined'));
  await app.listen(3000);
}
bootstrap();
