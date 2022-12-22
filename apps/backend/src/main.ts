import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import './constants';
import { PORT } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["debug","error","warn"]
  });
  app.use(helmet());
  app.use(morgan('dev'));
  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
