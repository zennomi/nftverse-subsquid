import { Args, ArgsType, Field, ID, InputType, Mutation, Resolver, registerEnumType } from "type-graphql"
import { EntityManager } from "typeorm"
import { Collection, CollectionCategory } from "../../model"

registerEnumType(CollectionCategory, {
    name: "CollectionCategory", // This is the name that will be used in the GraphQL schema
    description: "The categories for collections", // Optional description
});

@ArgsType()
class UpdateCategoryArgs {
    @Field(type => ID)
    id!: string;

    @Field(type => CollectionCategory)
    category!: CollectionCategory;
}

@Resolver()
export class CollectionResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Mutation(() => Boolean)
    async updateCategory(
        @Args() { id, category }: UpdateCategoryArgs
    ): Promise<Boolean> {
        let manager = await this.tx()
        let CollectionRepo = manager.getRepository(Collection)
        let collection = await CollectionRepo.findOneBy({ id })
        if (!collection) return false
        collection.category = category
        await CollectionRepo.save(collection)
        return true
    }
}