import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { init as firebaseInit } from './services/firebase-admin';
// import './database/seeds/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  firebaseInit();
  await app.listen(process.env.PORT || 3000);
}

bootstrap().catch((err) => {
  console.log(err);
});
