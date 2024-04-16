import { TypeormDatabase } from '@subsquid/typeorm-store'
import { Collection, ListEvent, Token } from './model'
import { Context, processor } from './processor'
import * as nftVerseMarketplace from "./abi/NFTVerseMarketplace"
import * as erc721 from "./abi/ERC721"
import { In } from 'typeorm'
import { fetchTokenMetadata } from './metadata'

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const listEvents: ListEvent[] = []
    const collectionIds = new Set<string>()
    const tokenIds = new Set<string>()

    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            if (log.topics[0] === nftVerseMarketplace.events.ListedNFT.topic) {
                const event = nftVerseMarketplace.events.ListedNFT.decode(log)
                collectionIds.add(event.nft)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                tokenIds.add(tokenId)
                listEvents.push(new ListEvent({
                    id: log.id,
                    collection: new Collection({ id: event.nft }), // temp
                    token: new Token({ id: tokenId }),
                    payToken: event.payToken,
                    price: event.price,
                    seller: event.seller,
                    timestamp: new Date(block.header.timestamp),
                    txHash: log.transactionHash
                }))
            }
        }
    }

    // new collection
    const collections = new Map<string, Collection>((await ctx.store.findBy(Collection, { id: In([...collectionIds]) })).map((entity) => [entity.id, entity]))

    const insertCollections = new Map<string, Collection>()
    for (const collectionId of collectionIds) {
        if (!collections.get(collectionId)) {
            const newCollection = await fetchCollection(ctx, collectionId)
            insertCollections.set(collectionId, newCollection)
            collections.set(collectionId, newCollection)
        }
    }
    await ctx.store.insert([...insertCollections.values()])

    // new token
    const tokens = new Map<string, Token>((await ctx.store.findBy(Token, { id: In([...tokenIds]) })).map((entity) => [entity.id, entity]))

    const insertTokens = new Map<string, Token>()
    for (const id of tokenIds) {
        if (!tokens.get(id)) {
            const [collectionId, tokenId] = id.split("-")
            const newToken = new Token({
                id: id,
                collection: collections.get(collectionId)!,
                tokenId: BigInt(tokenId),
            })
            const metadata = await fetchToken(ctx, collectionId, BigInt(tokenId))
            if (metadata) {
                Object.assign(newToken, metadata)
            }
            insertTokens.set(id, newToken)
            tokens.set(id, newToken)
        }
    }

    await ctx.store.insert([...insertTokens.values()])
    // list events
    for (const event of listEvents) {
        event.collection = collections.get(event.collection.id)!
        event.token = tokens.get(event.token.id)!
    }

    // upsert batches of entities with batch-optimized ctx.store.save
    await ctx.store.upsert(listEvents)
})

async function fetchCollection(ctx: Context, address: string) {
    let block = ctx.blocks[ctx.blocks.length - 1].header

    let contract = new erc721.Contract(ctx, block, address)

    let name = await contract.name()
    let symbol = await contract.symbol()

    return new Collection({
        id: address,
        name,
        symbol,
    })
}

async function fetchToken(ctx: Context, address: string, tokenId: bigint) {
    let block = ctx.blocks[ctx.blocks.length - 1].header

    let contract = new erc721.Contract(ctx, block, address)

    let uri = await contract.tokenURI(tokenId)

    const metadata = await fetchTokenMetadata(ctx, uri)

    return { uri, ...metadata }
}