import { Injectable, HttpException, HttpStatus, HttpService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { AutomobileEntity } from "./automobile.entity";
import { getConnection } from "typeorm";
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { request, gql, GraphQLClient } from 'graphql-request'
import { json } from "express";
const { graphql } = require('graphql')


@Injectable()
export class AutomobileService {

    url = 'http://localhost:5000/graphql';

    constructor(@InjectRepository(AutomobileEntity) private autoMobileRepo: Repository<AutomobileEntity>, private httpService: HttpService) { }
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
    // async search(str: string) {
    //     const automobiles = await getConnection().getRepository(AutomobileEntity).find({
    //         car_model: Like(str + "%")
    //     });
    //     return automobiles
    // }
    // async update(id: number, automobile: Partial<AutomobileEntity>) {
    //     await this.autoMobileRepo.update(id, { ...automobile })
    //     return await this.autoMobileRepo.findOne({ where: { id } })
    // }
    // async delete(id: number, automobile: AutomobileEntity) {

    //     const destroyedUnit = await this.autoMobileRepo.findOne({
    //         where: { id },
    //         //relations: ['automobile_entity'],
    //     });
    //     if (!destroyedUnit) {
    //         throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    //     }
    //     await this.autoMobileRepo.remove(destroyedUnit);
    //     return destroyedUnit;

    // }

    async readAll(page: number) {
        console.log(' read automobiles =====>>>')
        let offset: number;
        if (page == 1) {
            offset = 0 * 100
        }
        const query = gql`
        {
            allAutomobileEntities(orderBy: MANUFACTURED_DATE_ASC, first: 100,  offset:  ` + offset + ` ) {
                nodes {
                    ageOfVehicle
                    carMake
                    created
                    email
                    id
                    lastName
                    carModel
                    firstName
                    manufacturedDate
                    vinNumber
                  }
          }
        }
      `

        //await request(this.url, query).then((data) => console.log(data))
        let out = await request(this.url, query);

        return out;

    }
    async update(automobileEntityPatch: any, id_: number) {
        let query = gql`{mutation MyMutation($automobileEntityPatch: AutomobileEntityPatch = ` + JSON.stringify(automobileEntityPatch) + `, $id: Int = ` + id_ + `  ) {\n  updateAutomobileEntityById(\n    input: {automobileEntityPatch: $automobileEntityPatch, id: ` + id_ + ` }\n  ) {\n    automobileEntity {\n      firstName\n      lastName\n    }\n  }\n}\n}`

        console.log(' print ', query)
        return request(this.url, query).then((data) => data.message
        ).catch((e) => {
            console.log(e)
            return e;
        });

    }

    async delete(id: number) {

        const query = gql`mutation MyMutation { ` +
            ` deleteAutomobileEntityById(input: {id: ` + id + ` }) {`
            + `   clientMutationId `
            + ` deletedAutomobileEntityId }}`

        return request(this.url, query).then((data) => data.message
        ).catch((e) => {
            console.log(e)
            return e;
        });
    }



}