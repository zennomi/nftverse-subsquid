import { Mutation, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { PaymentToken } from '../../model'
import { ZeroAddress } from 'ethers'

@Resolver()
export class PaymentTokenResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Mutation(() => Boolean)
    async addETHPayment(): Promise<boolean> {
        let manager = await this.tx()
        let PaymentTokenRepo = manager.getRepository(PaymentToken)
        let paymentToken = new PaymentToken({
            id: ZeroAddress,
            decimals: 18,
            name: 'Ethereum',
            symbol: 'ETH'
        })
        await PaymentTokenRepo.save(paymentToken)
        return true
    }
}