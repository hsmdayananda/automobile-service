import { Module } from '@nestjs/common';
import { GpqlServerAPI } from './gpqlApi.datasource'

@Module({
    imports: [],
    controllers: [],
    providers: [GpqlServerAPI],

})
export class DatasourceModule { }
