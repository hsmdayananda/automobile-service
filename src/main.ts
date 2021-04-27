import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'
import { Logger } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws'


const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(port);
  app.enableCors({
    origin: [
      'http://localhost:4200', // angular
    ],
    // allowedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers']
  });
  app.useWebSocketAdapter(new WsAdapter(app));
  Logger.log(`Server Started and running on http://localhost:${port}`)
}
bootstrap();
