// import { Process, Processor, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
// import { Logger } from '@nestjs/common';
// import { Job } from 'bull';
// import { AutomobileService } from './automobile.service';
// import { EventsGateway } from '../events.gateway';


// @Processor('uploader')
// export class AutomobileProcessor {
//     constructor(private automobileService: AutomobileService, private eventGateway: EventsGateway) { }
//     private readonly logger = new Logger(AutomobileProcessor.name);

//     @Process('transcode')
//     handleTranscode(job: Job) {
//         this.logger.debug('Start transcoding...');
//         console.log(' input ==>>>', job.data)
//         this.automobileService.bulkUpload(job.data.file);
//         this.logger.debug('Transcoding completed');
//     }

//     @OnQueueActive({ name: 'transcode' })
//     onActive(job: Job) {
//         //this.eventGateway.wss.emit('files', { name: 'Active' });
//         console.log(
//             `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
//         );
//     }


//     @OnQueueCompleted({ name: 'transcode' })
//     async onComplete(job: Job, result: any) {
//         //this.eventGateway.wss.emit('files', { name: 'uploaded' });
//         console.log(
//             `completed job ${job.id} of type ${job.name} with data ${job.data}...}`,
//         );

//     }

//     @OnQueueFailed()
//     onFail(job: Job) {
//         //this.eventGateway.wss.emit('file-read', 'failed');
//         console.log(
//             `failed  job ${job.id} of type ${job.name} with data ${job.data}...`,
//         );
//     }
// }