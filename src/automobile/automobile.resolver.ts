import { Resolver, Args, Query, Mutation, Context, GraphQLExecutionContext } from "@nestjs/graphql";
import { AutomobileService } from "./automobile.service";
import { AutomobileEntity } from "./automobile.entity";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";




@Resolver()
export class AutomobileResolver {

    constructor(private automobileService: AutomobileService, @InjectQueue('csv-processor') private readonly csvProc: Queue, ) { }

    @Query()
    async automobiles(@Args('page') page: number) {
        console.log('inside resolver')
        return await this.automobileService.readAll(page);
    }
    @Query()
    async automobileById(@Args('id') id: number) {
        console.log('inside resolver')
        return await this.automobileService.getAutomobileById(id);
    }

    @Query()
    async automobilesExportDataFeed(@Args('searchCriteriaInput') searchCriteriaInput: any, @Context() context: GraphQLExecutionContext) {
        await this.csvProc.add('csv-proc', {
            searchCriteriaInput: searchCriteriaInput,
        });
        //return await this.automobileService.filterData(searchCriteriaInput, context);
    }

    @Query()
    async automobilesSearch(@Args('matchStr') str: string) {
        console.log(' string param ', str)
        return await this.automobileService.search(str);
    }

    @Mutation('update')
    async update(
        @Args('id') id: number,
        @Args('automobileInput') automobile: AutomobileEntity
    ) {
        return await this.automobileService.update(id, automobile);
    }

    @Mutation('delete')
    async delete(
        @Args('id') id: number
    ) {
        return await this.automobileService.delete(id);
    }


}