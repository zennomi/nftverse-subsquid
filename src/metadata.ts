import path from 'path'
import https from 'https'
import axios from 'axios'

import { Attribute, File } from './model'
import { Context } from './processor'
import { last } from 'lodash'
import { assertNotNull } from '@subsquid/evm-processor'

export const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/'
export const PROXY_URL = assertNotNull(process.env.PROXY_URL)

export interface TokenMetadata {
    name?: string
    description?: string
    image?: string
    animation?: string
    attributes: Attribute[]
}

export async function fetchTokenMetadata(ctx: Context, uri: string): Promise<TokenMetadata | undefined> {
    try {
        if (uri.startsWith('ipfs://')) {
            const gatewayURL = path.posix.join(IPFS_GATEWAY, ipfsRegExp.exec(uri)![1])
            let res = await client.get(gatewayURL)
            ctx.log.info(`Successfully fetched metadata from ${gatewayURL}`)
            return res.data
        } else if (uri.startsWith('http://') || uri.startsWith('https://')) {
            let res = await client.get(uri)
            ctx.log.info(`Successfully fetched metadata from ${uri}`)
            return res.data
        } else {
            ctx.log.warn(`Unexpected metadata URL protocol: ${uri}`)
            return undefined
        }
    } catch (e) {
        throw new Error(`Failed to fetch metadata at ${uri}. Error: ${e}`)
    }
}

const ipfsRegExp = /^ipfs:\/\/(.+)$/

const client = axios.create({
    headers: { 'Content-Type': 'application/json' },
    httpsAgent: new https.Agent({ keepAlive: true }),
    transformResponse(res: string): TokenMetadata {
        let data: { name?: string, description?: string, image?: string, animation_url?: string, attributes?: { trait_type: string; value: string }[] } = JSON.parse(res)
        return {
            name: data.name,
            description: data.description,
            image: data.image,
            animation: data.animation_url,
            attributes: data.attributes?.map((a) => new Attribute({ traitType: a.trait_type, value: a.value })) || [],
        }
    },
})

const openseaClient = axios.create({
    headers: {
        Accept: "application/json",
        "x-api-key": process.env.OPENSEA_KEY!,
    },
    baseURL: "https://testnets-api.opensea.io/api/v2/chain/sepolia/"
})

const proxyClient = axios.create({
    baseURL: PROXY_URL,
    headers: {
        Accept: "application/json",
        'Content-Type': 'application/json'
    }
})

export async function fetchOpenseaTokenMetadata(collection: string, id: string): Promise<TokenMetadata | undefined> {
    const { data }: {
        data: {
            name: string,
            description: string,
            image_url?: string,
            animation_url?: string,
            traits: {
                trait_type: string,
                display_type: number,
                value: string
            }[]
        }
    } = await openseaClient({
        url: `/${collection}/nfts/${id}`,
    })

    const image = data.image_url?.startsWith("https://ipfs.io/ipfs/") ? "ipfs://" + last(data.image_url.split("/")) : data.image_url
    const attributes = data.traits.map((a) => new Attribute({ traitType: a.trait_type, value: a.value }))

    return { ...data, image, attributes, }
}

export async function proxyFile(url: string): Promise<File> {
    const { data } = await proxyClient({
        url: "/files",
        method: "POST",
        data: JSON.stringify({
            url
        }),
    })
    return new File({ mime: data.file.mime, path: data.file.path })
}