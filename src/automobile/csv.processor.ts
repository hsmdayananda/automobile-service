import { Processor, Process, OnQueueCompleted, OnQueueFailed } from "@nestjs/bull";
import { AutomobileService } from "./automobile.service";
import { EventsGateway } from "src/events.gateway";
import { Job } from "bull";

@Processor('csv-processor')
export class CsvProcessor {
    constructor(private automobileService: AutomobileService, private eventGateway: EventsGateway) { }


    @Process('csv-proc')
    handleTranscode(job: Job) {
        console.log(' csv-proc ==>>>', job.data)
        this.automobileService.filterData(job.data.searchCriteriaInput);

    }

    @OnQueueCompleted({ name: 'csv-proc' })
    async onComplete(job: Job, result: any) {
        this.eventGateway.server.emit('csv-proc', { name: 'Export Data Ready to download' });
        // this.eventGateway.wss.emit('file', { name: 'Nest' });
        console.log(
            `completed job ${job.id} of type ${job.name} with data ${job.data}...}`,
        );

    }

    @OnQueueFailed()
    onFail(job: Job) {
        this.eventGateway.wss.emit('csv-proc', 'Data Export Failed');
        console.log(
            `failed  job ${job.id} of type ${job.name} with data ${job.data}...`,
        );
    }
}