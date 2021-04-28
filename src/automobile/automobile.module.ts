import { Module, NestModule, MiddlewareConsumer, HttpModule } from '@nestjs/common';

import { AutomobileController } from './automobile.controller';
import { AutomobileService } from './automobile.service';
import { MulterModule } from '@nestjs/platform-express';
import { GpqlMiddleware } from './middlewares/gpql.middleware'
import { AutomobileResolver } from './automobile.resolver';
import { GpqlServerAPI } from './config/gpqlApi.datasource';




@Module({
    imports: [MulterModule.register({
        dest: '/Users/hmdayananda/Documents/fortude/assignments/data',
    }), HttpModule],
    controllers: [AutomobileController],
    providers: [AutomobileService, AutomobileResolver, GpqlServerAPI],
})
export class AutomobileModule {
}