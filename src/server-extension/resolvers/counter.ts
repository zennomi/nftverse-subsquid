import { Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { ListEvent, ListEventStatus } from '../../model'

@Resolver()
export class CountResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Query(() => Number)
    async totalListingTokens(): Promise<number> {
        const manager = await this.tx()
        return await manager.getRepository(ListEvent).count({ where: { status: ListEventStatus.LISTING } })
    }
}