import { Injectable, HttpService, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AutomobileEntity } from "./automobile.entity";
import { getConnection } from "typeorm";
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { request, gql } from 'graphql-request'
import { GpqlServerAPI } from "./config/gpqlApi.datasource";




@Injectable()
export class AutomobileService {

    url = 'http://localhost:5000/graphql';

    constructor(@InjectRepository(AutomobileEntity) private autoMobileRepo: Repository<AutomobileEntity>, private httpService: HttpService,
        private gpqlAPI: GpqlServerAPI) { }

    async bulkUpload(jobData: Express.Multer.File) {
        const automobiles = [];
        fs.createReadStream(jobData.path).

            pipe(csv.parse({ headers: true }))
            .on('error', error => {
                console.error(error);
                throw error.message;
            })
            .on('data', row => {
                //console.log("data row", row);
                automobiles.push(row);
            })
            .on('end', async () => {
                // Save automobiles to PostgreSQL database
                //console.log('table data', automobiles);
                await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(AutomobileEntity)
                    .values(
                        //pass list of automobiles
                        automobiles

                    )
                    .execute().finally(() => {
                        //console.log("job done")

                    });
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
        console.log(' read all automobiles =====>>>')
        let offset: number;
        if (page == 1) {
            offset = 0 * 100
        }
        //     const queryTpApi = `
        //     {
        //         allAutomobileEntities(orderBy: MANUFACTURED_DATE_ASC, first: 100,  offset:  ` + offset + ` ) {
        //             nodes {
        //                 ageOfVehicle
        //                 carMake
        //                 created
        //                 email
        //                 id
        //                 lastName
        //                 carModel
        //                 firstName
        //                 manufacturedDate
        //                 vinNumber
        //               }
        //       }
        //     }
        //   `
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

        // let result = this.gpqlAPI.geAllAutomobiles(queryTpApi);
        //await request(this.url, query).then((data) => console.log(data))
        let out = await request(this.url, query);

        console.log(out)
        return out.allAutomobileEntities.nodes;

    }
    async update(id_: number, automobileEntityPatch: any) {


        let patchObj = JSON.stringify(automobileEntityPatch)
        console.log('input ====>>>>', JSON.parse(patchObj));
        console.log('out ====>>>>', automobileEntityPatch);
        //{ firstName: "Mandy", lastName: "Darm" }
        let data = {
            query: this.toSingleLine(`mutation updateAutomobiles($automobileInput: AutomobileEntityPatch!){  updateAutomobileEntityById(input: {id: 22, automobileEntityPatch: $automobileInput}){    automobileEntity{     firstName   }  }}`),
            variables: { automobileInput: automobileEntityPatch }
        }
            ;

        console.log(" data ==>>>", data)
        this.httpService.post(this.url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).toPromise().then((data) =>
            console.log(data));

    }

    toSingleLine(query: string) {
        return query.split("\n").join('');
    }

    async delete(id: number) {

        const query = gql`mutation MyMutation {
    ` +
            ` deleteAutomobileEntityById(input: { id: ` + id + ` }) {
        `
            + `   clientMutationId`
            + ` deletedAutomobileEntityId
    }
} `

        return request(this.url, query).then((data) => data.message
        ).catch((e) => {
            console.log(e)
            return e;
        });
    }



}