import { Controller, Post, UploadedFile, Get, UseInterceptors } from "@nestjs/common";
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { AutomobileService } from "./automobile.service";




@Controller('automobile')
export class AutomobileController {

    constructor(@InjectQueue('uploader') private readonly uploadQueue: Queue, private automobileService: AutomobileService) { }

    @Post('file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        await this.uploadQueue.add('transcode', {
            file: file,
        });

    }

    @Get('hello')
    async test() {

        await this.automobileService.showAll(1);
        console.log(" hello  from server")
    }

}