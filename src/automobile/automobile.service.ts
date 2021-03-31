import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { AutomobileEntity } from "./automobile.entity";
import { getConnection } from "typeorm";
import * as fs from 'fs';
import * as csv from 'fast-csv';


@Injectable()
export class AutomobileService {

    constructor(@InjectRepository(AutomobileEntity) private autoMobileRepo: Repository<AutomobileEntity>) { }
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

    async showAll(page: number = 1) {
        console.log(' hello from service')
        console.log(await getConnection()
            .getRepository(AutomobileEntity)
            .createQueryBuilder()

            .getOne())
        return await this.autoMobileRepo.find({ take: 100, skip: 100 * (page - 1) });

    }
    async search(str: string) {
        const automobiles = await getConnection().getRepository(AutomobileEntity).find({
            car_model: Like(str + "%")
        });
        return automobiles
    }
    async update(id: number, automobile: Partial<AutomobileEntity>) {
        await this.autoMobileRepo.update(id, { ...automobile })
        return await this.autoMobileRepo.findOne({ where: { id } })
    }
    async delete(id: number, automobile: AutomobileEntity) {

        const destroyedUnit = await this.autoMobileRepo.findOne({
            where: { id },
            //relations: ['automobile_entity'],
        });
        if (!destroyedUnit) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        await this.autoMobileRepo.remove(destroyedUnit);
        return destroyedUnit;

    }


}