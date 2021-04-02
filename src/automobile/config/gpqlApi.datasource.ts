import { Injectable } from "@nestjs/common";

import { RESTDataSource } from 'apollo-datasource-rest';

@Injectable()
export class GpqlServerAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://localhost:5000/';

    }


    async geAllAutomobiles(query: string) {
        console.log('inside datasource', this.baseURL);
        const data = await this.post('graphql',
            query
        );
        return data.results;
    }
}
