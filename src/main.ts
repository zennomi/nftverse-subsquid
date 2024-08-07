import { TypeormDatabase } from '@subsquid/typeorm-store'
import { AuctionData, BidEvent, Collection, File, ListEvent, ListEventStatus, OfferEvent, PaymentToken, Token } from './model'
import { Context, processor } from './processor'
import * as nftVerseMarketplace from "./abi/NFTVerseMarketplace"
import * as erc20 from "./abi/ERC20"
import * as erc721 from "./abi/ERC721"
import { IsNull } from 'typeorm'
import { TokenMetadata, fetchOpenseaTokenMetadata, fetchTokenMetadata, proxyFile } from './metadata'

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const listEvents = new Map<string, ListEvent>()

    const collectionMap = new Map<string, Collection>()
    const tokenMap = new Map<string, Token>()

    async function getOrFetchCollection(collectionId: string): Promise<Collection> {
        let collection = collectionMap.get(collectionId)
        if (collection) return collection
        collection = await ctx.store.get(Collection, collectionId);

        if (!collection) {
            collection = await fetchCollection(ctx, collectionId)
            await ctx.store.insert(collection)
        }
        collectionMap.set(collectionId, collection)
        return collection
    }

    async function getOrFetchToken(id: string): Promise<Token> {
        const [collectionId, tokenId] = id.split("-")
        const collection = await getOrFetchCollection(collectionId)
        let token = tokenMap.get(id)
        if (token) return token;
        token = await ctx.store.get(Token, id);

        if (!token) {
            token = new Token({
                id: id,
                collection,
                tokenId: BigInt(tokenId),
            })
            const metadata = await fetchToken(ctx, collectionId, BigInt(tokenId))
            if (metadata) {
                Object.assign(token, metadata)
            }
            await ctx.store.insert(token)
        }
        tokenMap.set(id, token)
        return token
    }

    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            if (log.topics[0] === nftVerseMarketplace.events.AddPayableToken.topic) {
                const event = nftVerseMarketplace.events.AddPayableToken.decode(log)
                const paymentToken = await fetchERC20Token(ctx, event.tokenAddress)
                ctx.log.info(`New payment token: ${paymentToken.id}`)
                await ctx.store.insert(paymentToken)
            } else if (log.topics[0] === nftVerseMarketplace.events.ListedNFT.topic) {
                const event = nftVerseMarketplace.events.ListedNFT.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                await getOrFetchToken(tokenId)
                await ctx.store.insert(new ListEvent({
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
            } else if (log.topics[0] === nftVerseMarketplace.events.CreatedAuction.topic) {
                const event = nftVerseMarketplace.events.CreatedAuction.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                await getOrFetchToken(tokenId)

                await ctx.store.insert(new ListEvent({
                    id: log.id,
                    collection: new Collection({ id: event.nft }),
                    token: new Token({ id: tokenId }),
                    payToken: new PaymentToken({ id: event.payToken }),
                    price: event.price,
                    seller: event.creator,
                    timestamp: new Date(block.header.timestamp),
                    txHash: log.transactionHash,
                    status: ListEventStatus.AUCTIONING,
                    auctionData: new AuctionData({ minBid: event.minBid, endTime: new Date(Number(event.endTime) * 1000), startTime: new Date(Number(event.startTime) * 1000), startPrice: event.price })
                }))
            } else if (log.topics[0] === nftVerseMarketplace.events.BoughtNFT.topic) {
                const event = nftVerseMarketplace.events.BoughtNFT.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                let listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, status: ListEventStatus.LISTING }, order: { timestamp: -1 } })

                listEvent.status = ListEventStatus.SOLD

                await ctx.store.save(listEvent)
            } else if (log.topics[0] === nftVerseMarketplace.events.CanceledListedNFT.topic) {
                const event = nftVerseMarketplace.events.CanceledListedNFT.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                let listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, status: ListEventStatus.LISTING }, order: { timestamp: -1 } })
                listEvent.status = ListEventStatus.CANCELED

                await ctx.store.save(listEvent)
            } else if (log.topics[0] === nftVerseMarketplace.events.PlacedBid.topic) {
                const event = nftVerseMarketplace.events.PlacedBid.decode(log)

                const tokenId = `${event.nft}-${event.tokenId.toString()}`

                let listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, status: ListEventStatus.AUCTIONING }, order: { timestamp: -1 } })

                await ctx.store.insert(new BidEvent({
                    id: log.id,
                    listEvent,
                    price: event.bidPrice,
                    bidder: event.bidder,
                    timestamp: new Date(block.header.timestamp),
                    txHash: log.transactionHash,
                }))
                listEvent.price = event.bidPrice

                await ctx.store.save(listEvent)
            } else if (log.topics[0] === nftVerseMarketplace.events.CanceledAuction.topic) {
                const event = nftVerseMarketplace.events.CanceledAuction.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                let listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, status: ListEventStatus.AUCTIONING }, order: { timestamp: -1 } })

                listEvent.status = ListEventStatus.CANCELED

                await ctx.store.save(listEvent)
            } else if (log.topics[0] === nftVerseMarketplace.events.ResultedAuction.topic) {
                const event = nftVerseMarketplace.events.ResultedAuction.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                let listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, status: ListEventStatus.AUCTIONING }, order: { timestamp: -1 } })

                listEvent.status = ListEventStatus.SOLD
                listEvent.buyer = event.winner
                listEvent.price = event.price

                await ctx.store.save(listEvent)
            } else if (log.topics[0] === nftVerseMarketplace.events.OfferredNFT.topic) {
                const event = nftVerseMarketplace.events.OfferredNFT.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                let listEvent = listEvents.get(tokenId)
                if (!listEvent) {
                    listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, status: ListEventStatus.LISTING }, order: { timestamp: -1 } })
                }
                const offerer = event.offerer

                let offerEvent = await ctx.store.findOne(OfferEvent, { where: { listEvent: { id: listEvent.id }, offerer, accepted: IsNull() }, order: { timestamp: -1 } })
                if (offerEvent) {
                    await ctx.store.remove(offerEvent)
                }

                await ctx.store.insert(new OfferEvent({
                    id: log.id,
                    accepted: null,
                    listEvent,
                    offerer,
                    price: event.offerPrice,
                    timestamp: new Date(block.header.timestamp),
                    txHash: log.transactionHash,
                }))
            } else if (log.topics[0] === nftVerseMarketplace.events.AcceptedNFT.topic) {
                const event = nftVerseMarketplace.events.AcceptedNFT.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                let listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, status: ListEventStatus.LISTING }, order: { timestamp: -1 } })

                const offerer = event.offerer

                let offerEvent = await ctx.store.findOneOrFail(OfferEvent, { where: { listEvent: { id: listEvent.id }, offerer, accepted: IsNull() }, order: { timestamp: -1 } })

                offerEvent.accepted = true
                listEvent.status = ListEventStatus.SOLD
                listEvent.buyer = event.offerer
                await ctx.store.save(listEvent)
                await ctx.store.save(offerEvent)
            } else if (log.topics[0] === nftVerseMarketplace.events.CanceledOfferredNFT.topic) {
                const event = nftVerseMarketplace.events.CanceledOfferredNFT.decode(log)
                const tokenId = `${event.nft}-${event.tokenId.toString()}`
                const offerer = event.offerer

                let listEvent = await ctx.store.findOneOrFail(ListEvent, { where: { token: { id: tokenId }, status: ListEventStatus.LISTING }, order: { timestamp: -1 } })

                let offerEvent = await ctx.store.findOneOrFail(OfferEvent, { where: { listEvent: { id: listEvent.id }, offerer, accepted: IsNull() }, order: { timestamp: -1 } })

                offerEvent.accepted = false

                await ctx.store.save(offerEvent)
            }
        }
    }
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

    if (!uri) return {}

    let metadata: TokenMetadata | undefined
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

    let file: File | null = null

    if (metadata) {
        if (metadata.animation) {
            file = await proxyFile(metadata.animation)
        } else if (metadata.image) {
            file = await proxyFile(metadata.image)
        }
    }

    return { uri, ...metadata, file }
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