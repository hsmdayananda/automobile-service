import { Injectable, HttpService, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AutomobileEntity } from "./automobile.entity";
import { getConnection } from "typeorm";
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { request, gql } from 'graphql-request'
import { GpqlServerAPI } from "./config/gpqlApi.datasource";
import { response } from "express";
import { GraphQLExecutionContext } from "@nestjs/graphql";
const Json2csvParser = require('json2csv').Parser;




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

    async showAll(page: number) {
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
    async getAutomobileById(id: number) {

        const query = gql`
        query {
            automobileEntityById(id: ${id}){
              firstName
              lastName
              email
              ageOfVehicle
              carMake
              carModel
            }
          }
          
        `

        let out = await request(this.url, query);
        console.log(' data ', out.automobileEntityById)
        return out.automobileEntityById;
    }

    async filterData(input: any) {
        console.log(' input filter', input)

        let query = gql`
            {
                allAutomobileEntities(
                  filter:{${input.filterField}: {${input.operator}: ${input.value}}} 
                ) {
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

            ;



        let out = await request(this.url, query);
        let data = out.allAutomobileEntities.nodes;
        let csv = await this.generateCsv(data);
        // context.getContext().headers('Content-disposition', 'attachment; filename=customers.csv');
        console.log('csv ', csv)
        return csv;
    }

    async readAll(page: number = 1) {
        console.log(' read all automobiles =====>>>', page)
        let offset: number;
        if (page == 1) {
            offset = 0 * 100
        } else {
            offset = 100 * page
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
            query: this.toSingleLine(`mutation updateAutomobiles($automobileInput: AutomobileEntityPatch!){  updateAutomobileEntityById(input: {id: ${id_}, automobileEntityPatch: $automobileInput}){    automobileEntity{     firstName   }  }}`),
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
            console.log(data.data.data.updateAutomobileEntityById));

    }

    toSingleLine(query: string) {
        return query.split("\n").join('');
    }

    async delete(id: number) {
        console.log(' id new', id)
        const query = gql`mutation  {
            deleteAutomobileEntityById(input: {id: ${id}}){
              automobileEntity{
                id
              }
            }
          }`

        return request(this.url, query).then((data) => data.message
        ).catch((e) => {
            console.log(e)
            return e;
        });
    }


    async generateCsv(data: any[]) {

        //Customer.findAll({ attributes: ['id', 'name', 'address', 'age'] }).then(objects => {
        const jsonCustomers = JSON.parse(JSON.stringify(data));
        const csvFields = ['Id', 'First Name', 'Last Name'];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csvData = json2csvParser.parse(jsonCustomers);

        this.writeToCSVFile(csvData);
        //return csvData;
        // res.setHeader('Content-disposition', 'attachment; filename=automobiles.csv');
        // res.set('Content-Type', 'text/csv');
        // res.status(200).end(csvData);
        // });
    }

    async writeToCSVFile(data: any) {
        const filename = 'export-data.csv';
        fs.writeFile(filename, data, err => {
            if (err) {
                console.log('Error writing to csv file', err);
            } else {
                console.log(`saved as ${filename}`);
            }
        });
    }

}