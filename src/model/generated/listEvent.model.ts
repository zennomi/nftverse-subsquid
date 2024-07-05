import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Collection} from "./collection.model"
import {Token} from "./token.model"
import {PaymentToken} from "./paymentToken.model"
import {ListEventStatus} from "./_listEventStatus"
import {AuctionData} from "./_auctionData"

@Entity_()
export class ListEvent {
    constructor(props?: Partial<ListEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Collection, {nullable: true})
    collection!: Collection

    @Index_()
    @ManyToOne_(() => Token, {nullable: true})
    token!: Token

    @Index_()
    @ManyToOne_(() => PaymentToken, {nullable: true})
    payToken!: PaymentToken

    @BigIntColumn_({nullable: false})
    price!: bigint

    @StringColumn_({nullable: false})
    seller!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @StringColumn_({nullable: false})
    txHash!: string

    @Column_("varchar", {length: 10, nullable: false})
    status!: ListEventStatus

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new AuctionData(undefined, obj)}, nullable: true})
    auctionData!: AuctionData | undefined | null
}
