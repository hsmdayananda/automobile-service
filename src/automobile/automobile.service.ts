import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AutomobileEntity } from "./automobile.entity";
import { getConnection } from "typeorm";
import * as fs from 'fs';
import * as csv from 'fast-csv';


@Injectable()
export class AutomobileService {

    constructor(@InjectRepository(AutomobileEntity) private autoMobileEntityi: Repository<AutomobileEntity>) { }
    async bulkUpload(jobData: Express.Multer.File) {
        const automobiles = [];
        fs.createReadStream(jobData.path).

            pipe(csv.parse({ headers: true }))
            .on('error', error => {
                console.error(error);
                throw error.message;
            })
            .on('data', row => {
                console.log("data row", row);
                automobiles.push(row);
            })
            .on('end', async () => {
                // Save automobiles to PostgreSQL database
                console.log('table data', automobiles);
                await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(AutomobileEntity)
                    .values(
                        //pass list of automobiles
                        automobiles

                    )
                    .execute().finally(() => console.log("job done"));
            });


    }


}