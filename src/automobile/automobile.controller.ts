import { Controller, Post, UploadedFile, UseInterceptors, Body, HttpCode, BadRequestException } from "@nestjs/common";
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { AutomobileService } from "./automobile.service";



@Controller('automobile')
export class AutomobileController {

    constructor(private automobileService: AutomobileService) { }

    @Post('file/upload')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(201)
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!this.automobileService.uploadFile(file)) {
            throw new BadRequestException(" Upload File Fail");
        }

    }

    @Post('file/download')
    @UseInterceptors(FileInterceptor('file'))
    async downloadFile(@Body() criteria: any) {
        this.automobileService.downloadFile(criteria);

    }
}