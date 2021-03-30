import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'
import { Logger } from '@nestjs/common';
import { postgraphile } from 'postgraphile';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(postgraphile({
    database: "automobile",
    user: "postgres",
    password: "",
    host: "localhost",
    port: 5432,
  },
    'public',
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    }))
  await app.listen(port);

  Logger.log(`Server Started and running on http://localhost:${port}`)
}
bootstrap();
