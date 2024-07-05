import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {ListEvent} from "./listEvent.model"

@Entity_()
export class BidEvent {
    constructor(props?: Partial<BidEvent>) {
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
    bidder!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @StringColumn_({nullable: false})
    txHash!: string
}
