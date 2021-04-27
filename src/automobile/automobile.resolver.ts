import { Resolver, Args, Query, Mutation } from "@nestjs/graphql";
import { AutomobileService } from "./automobile.service";
import { AutomobileEntity } from "./automobile.entity";


@Resolver()
export class AutomobileResolver {

    constructor(private automobileService: AutomobileService) { }

    @Query()
    async automobiles(@Args('page') page: number) {
        return await this.automobileService.readAll(page);
    }
    @Query()
    async automobileById(@Args('id') id: number) {
        return await this.automobileService.getAutomobileById(id);
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