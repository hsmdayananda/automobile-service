import { Module, NestModule, MiddlewareConsumer, HttpModule } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomobileEntity } from './automobile.entity';
import { AutomobileController } from './automobile.controller';
import { BullModule } from '@nestjs/bull';
import { AutomobileProcessor } from './automobile.processor';
import { AutomobileService } from './automobile.service';
import { MulterModule } from '@nestjs/platform-express';
import { GpqlMiddleware } from './middlewares/gpql.middleware'
import { AutomobileResolver } from './automobile.resolver';
import { EventsGateway } from 'src/events.gateway';
import { GpqlServerAPI } from './config/gpqlApi.datasource';




@Module({
    imports: [TypeOrmModule.forFeature([AutomobileEntity]),
    BullModule.registerQueue({
        name: 'uploader',
    }), MulterModule.register({
        dest: '../data',
    }), HttpModule],
    controllers: [AutomobileController],
    providers: [AutomobileProcessor, AutomobileService, AutomobileResolver, EventsGateway, GpqlServerAPI],
})
export class AutomobileModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(GpqlMiddleware)
            .forRoutes('/automobile/view');
    }
}