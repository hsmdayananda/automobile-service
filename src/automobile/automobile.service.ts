import { Injectable, HttpService } from "@nestjs/common";
import * as csv from 'fast-csv';
import { request, gql } from 'graphql-request'



@Injectable()
export class AutomobileService {

    url = 'http://localhost:5000/graphql';

    constructor(private httpService: HttpService) { }

    async search(str: string) {
        const query = gql`
        query {
            allAutomobileEntities(filter: {carModel: {startsWith: "${str}" }}) {
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
                totalCount
            
              }
          }
          
        `
        let out = await request(this.url, query);
        let data = this.calculateAgeOfVehicle(out.allAutomobileEntities.nodes);
        return data;
    }
    calculateAgeOfVehicle(data: any[]) {
        data.map((el) => {
            var today = new Date();
            var birthDate = new Date(el.manufacturedDate);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            el.ageOfVehicle = age;
            return age;
        });

        return data;

    }

    async getAutomobileById(id: number) {

        const query = gql`
        query {
            automobileEntityById(id: ${id}){
                id
              firstName
              lastName
              email
              ageOfVehicle
              carMake
              carModel
              manufacturedDate
              vinNumber
              created
            }
          }
          
        `

        let out = await request(this.url, query);
        return out.automobileEntityById;
    }

    async filterData(input: any) {

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



        await request(this.url, query);
        return csv;
    }


    async readAll(page: number = 1) {
        let offset: number;
        if (page == 1) {
            offset = 0 * 100
        } else {
            offset = 100 * page
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

        let out = await request(this.url, query);

        let data = this.calculateAgeOfVehicle(out.allAutomobileEntities.nodes);
        return data;

    }
    async update(id_: number, automobileEntityPatch: any) {

        let data = {
            query: this.toSingleLine(`mutation updateAutomobiles($automobileInput: AutomobileEntityPatch!){  updateAutomobileEntityById(input: {id: ${id_}, automobileEntityPatch: $automobileInput}){    automobileEntity{     firstName   }  }}`),
            variables: { automobileInput: automobileEntityPatch }
        }
            ;

        this.httpService.post(this.url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).toPromise().then((data) =>
            console.log(data.data.data.updateAutomobileEntityById)
        );

    }

    toSingleLine(query: string) {
        return query.split("\n").join('');
    }

    async delete(id: number) {
        const query = gql`mutation  {
            deleteAutomobileEntityById(input: {id: ${id}}){
              automobileEntity{
                id
              }
            }
          }`

        return request(this.url, query).then((data) => data.message
        ).catch((e) => {
            return e;
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<boolean> {
        let response = this.httpService.post('http://localhost:4001/file/upload', file, {
        }).subscribe((data) => {
            return data;
        })
        return response ? true : false;
    }
    async downloadFile(criteria: any) {
        let response = this.httpService.post('http://localhost:4001/file/download', criteria).subscribe((data) => {
            return data;
        });

    }

}