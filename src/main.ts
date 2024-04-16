import { TypeormDatabase } from '@subsquid/typeorm-store'
import { ListEvent } from './model'
import { processor } from './processor'
import * as nftVerseMarketplace from "./abi/NFTVerseMarketplace"

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const listEvents: ListEvent[] = []
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            if (log.topics[0] !== nftVerseMarketplace.events.ListedNFT.topic) continue

            let event = nftVerseMarketplace.events.ListedNFT.decode(log)

            listEvents.push(new ListEvent({
                id: log.id,
                nft: event.nft,
                tokenId: event.tokenId,
                payToken: event.payToken,
                price: event.price,
                seller: event.seller,
                timestamp: new Date(block.header.timestamp),
                txHash: log.transactionHash
            }))
        }
    }

    // upsert batches of entities with batch-optimized ctx.store.save
    await ctx.store.upsert(listEvents)
})
