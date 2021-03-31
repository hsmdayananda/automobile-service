import { Resolver, Args, Query, Mutation } from "@nestjs/graphql";
import { AutomobileService } from "./automobile.service";
import { AutomobileEntity } from "./automobile.entity";



@Resolver()
export class AutomobileResolver {

    constructor(private automobileService: AutomobileService) { }

    @Query()
    async automobiles(@Args('page') page: number) {
        console.log('inside resolver')
        return await this.automobileService.showAll(page);
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
        console.log('update object id ', id)
        console.log('update object ', automobile)
        return await this.automobileService.update(id, automobile);
    }

    @Mutation('delete')
    async delete(
        @Args('id') id: number,
        @Args('automobile') automobile: AutomobileEntity
    ) {
        return await this.automobileService.delete(id, automobile);
    }


}