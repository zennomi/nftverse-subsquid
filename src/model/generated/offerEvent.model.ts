import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {Collection} from "./collection.model"
import {Token} from "./token.model"
import {PaymentToken} from "./paymentToken.model"

@Entity_()
export class OfferEvent {
    constructor(props?: Partial<OfferEvent>) {
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
    offerer!: string

    @StringColumn_({nullable: false})
    owner!: string

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BooleanColumn_({nullable: true})
    accepted!: boolean | undefined | null

    @StringColumn_({nullable: false})
    txHash!: string
}
