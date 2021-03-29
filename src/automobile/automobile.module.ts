import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomobileEntity } from './automobile.entity';
import { AutomobileController } from './automobile.controller';
import { BullModule } from '@nestjs/bull';
import { AutomobileProcessor } from './automobile.processor';
import { AutomobileService } from './automobile.service';
import { MulterModule } from '@nestjs/platform-express';


@Module({
    imports: [TypeOrmModule.forFeature([AutomobileEntity]),
    BullModule.registerQueue({
        name: 'uploader',
    }), MulterModule.register({
        dest: '../data',
    })],
    controllers: [AutomobileController],
    providers: [AutomobileProcessor, AutomobileService,],
})
export class AutomobileModule { }