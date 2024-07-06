import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {ListEvent} from "./listEvent.model"

@Entity_()
export class OfferEvent {
    constructor(props?: Partial<OfferEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => ListEvent, {nullable: true})
    listEvent!: ListEvent

    @BigIntColumn_({nullable: false})
    price!: bigint

    @StringColumn_({nullable: false})
    offerer!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BooleanColumn_({nullable: true})
    accepted!: boolean | undefined | null

    @StringColumn_({nullable: false})
    txHash!: string
}
