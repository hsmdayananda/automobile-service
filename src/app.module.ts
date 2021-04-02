import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AutomobileModule } from './automobile/automobile.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { EventsGateway } from './events.gateway'
//import { EventsModule } from './events/events.module';



@Module({
  imports: [BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }), TypeOrmModule.forRoot(), AutomobileModule,
  GraphQLModule.forRoot({
    typePaths: ['./**/*.graphql'],
    definitions: {
      path: join(process.cwd(), 'src/graphql.ts'),
    },
    context: ({ req }) => ({ headers: req.headers }),
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
