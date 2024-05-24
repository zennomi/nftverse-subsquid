import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {CollectionCategory} from "./_collectionCategory"

@Entity_()
export class Collection {
    constructor(props?: Partial<Collection>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: false})
    symbol!: string

    @Column_("varchar", {length: 10, nullable: true})
    category!: CollectionCategory | undefined | null
}
