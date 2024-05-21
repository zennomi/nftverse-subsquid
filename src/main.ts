import { TypeormDatabase } from '@subsquid/typeorm-store'
import { Collection, ListEvent, ListEventStatus, PaymentToken, Token } from './model'
import { Context, processor } from './processor'
import * as nftVerseMarketplace from "./abi/NFTVerseMarketplace"
import * as erc20 from "./abi/ERC20"
import * as erc721 from "./abi/ERC721"
import { In } from 'typeorm'
import { fetchOpenseaTokenMetadata, fetchTokenMetadata } from './metadata'

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const listEvents = new Map<string, ListEvent>()
    const collectionIds = new Set<string>()
    const tokenIds = new Set<string>()

    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            if (log.topics[0] === nftVerseMarketplace.events.AddPayableToken.topic) {
                const event = nftVerseMarketplace.events.AddPayableToken.decode(log)
                const paymentToken = await fetchERC20Token(ctx, event.tokenAddress)
                ctx.log.info(`New payment token: ${paymentToken.id}`)
                await ctx.store.insert(paymentToken)
            } else if (log.topics[0] === nftVerseMarketplace.events.ListedNFT.topic) {
                const event = nftVerseMarketplace.events.ListedNFT.decode(log)
                collectionIds.add(event.nft)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                tokenIds.add(tokenId)
                listEvents.set(tokenId, new ListEvent({
                    id: log.id,
                    collection: new Collection({ id: event.nft }),
                    token: new Token({ id: tokenId }),
                    payToken: new PaymentToken({ id: event.payToken }),
                    price: event.price,
                    seller: event.seller,
                    timestamp: new Date(block.header.timestamp),
                    txHash: log.transactionHash,
                    status: ListEventStatus.LISTING,
                }))
            } else if (log.topics[0] === nftVerseMarketplace.events.BoughtNFT.topic) {
                const event = nftVerseMarketplace.events.BoughtNFT.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                let listEvent = listEvents.get(tokenId)
                if (!listEvent) {
                    listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, }, order: { timestamp: -1 } })
                }
                listEvent.status = ListEventStatus.SOLD
                listEvents.set(tokenId, listEvent)
            } else if (log.topics[0] === nftVerseMarketplace.events.CanceledListedNFT.topic) {
                const event = nftVerseMarketplace.events.CanceledListedNFT.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                let listEvent = listEvents.get(tokenId)
                if (!listEvent) {
                    listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, status: ListEventStatus.LISTING }, order: { timestamp: -1 } })
                }
                listEvent.status = ListEventStatus.CANCELED
                listEvents.set(tokenId, listEvent)
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
    // upsert batches of entities with batch-optimized ctx.store.save
    await ctx.store.upsert([...listEvents.values()])
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
    let metadata
    try {
        metadata = await fetchTokenMetadata(ctx, uri)
    } catch (error) {
    }

    if (!metadata) {
        try {
            metadata = await fetchOpenseaTokenMetadata(address, tokenId.toString())
        } catch (error) {
            ctx.log.warn(`Failed to fetch metadata at ${uri} with opensea API. Error ${error}`)
        }
    }

    return { uri, ...metadata }
}

async function fetchERC20Token(ctx: Context, address: string) {
    let block = ctx.blocks[ctx.blocks.length - 1].header

    let contract = new erc20.Contract(ctx, block, address)

    let name = await contract.name()
    let symbol = await contract.symbol()
    let decimals = await contract.decimals()

    return new PaymentToken({
        id: address,
        name,
        symbol,
        decimals,
    })
}