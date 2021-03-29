import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { AutomobileService } from './automobile.service';

@Processor('uploader')
export class AutomobileProcessor {
    constructor(private automobileService: AutomobileService) { }
    private readonly logger = new Logger(AutomobileProcessor.name);

    @Process('transcode')
    handleTranscode(job: Job) {
        this.logger.debug('Start transcoding...');
        console.log(' input ==>>>', job.data)
        this.automobileService.bulkUpload(job.data.file);
        this.logger.debug('Transcoding completed');
    }
}