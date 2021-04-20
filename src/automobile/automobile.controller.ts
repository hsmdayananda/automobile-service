import { Controller, Post, UploadedFile, Get, UseInterceptors, Put, Delete, Param, Body, Query } from "@nestjs/common";
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { AutomobileService } from "./automobile.service";
import { AutomobileEntity } from "./automobile.entity";


@Controller('automobile')
export class AutomobileController {

    constructor(@InjectQueue('uploader') private readonly uploadQueue: Queue, private automobileService: AutomobileService) { }

    @Post('file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(' hello file')
        await this.uploadQueue.add('transcode', {
            file: file,
        });

    }

    @Get('read')
    async readAll(@Query() query) {

        console.log(' query ', query)
        return await this.automobileService.readAll(query.page);
    }
    @Put('update/:id')
    async update(@Param('id') id: number, @Body() automobileEntity: AutomobileEntity) {

        return await this.automobileService.update(id, automobileEntity);
    }
    @Delete('delete/:id')
    async delete(@Param('id') id: number) {

        return await this.automobileService.delete(id);
    }


    @Get('hello')
    async test() {

        await this.automobileService.showAll(1);
        console.log(" hello  from server")
    }

}