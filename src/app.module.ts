import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AutomobileModule } from './automobile/automobile.module';

@Module({
  imports: [BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }), TypeOrmModule.forRoot(), AutomobileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
