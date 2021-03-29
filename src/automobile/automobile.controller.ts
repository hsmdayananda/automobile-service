import { Controller, Post, UploadedFile, Get, UseInterceptors } from "@nestjs/common";
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";




@Controller('automobile')
export class AutomobileController {

    constructor(@InjectQueue('uploader') private readonly uploadQueue: Queue) { }

    @Post('file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        await this.uploadQueue.add('transcode', {
            file: file,
        });

    }

    @Get()
    test() {
        console.log(" hello  from server")
    }

}