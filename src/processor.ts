import { assertNotNull } from '@subsquid/util-internal'
import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor'
import { Store } from '@subsquid/typeorm-store'

export const processor = new EvmBatchProcessor()
    // Lookup archive by the network name in Subsquid registry
    // See https://docs.subsquid.io/evm-indexing/supported-networks/
    // https://cdn.subsquid.io/archives/evm.json
    .setGateway('https://v2.archive.subsquid.io/network/ethereum-sepolia')
    // Chain RPC endpoint is required for
    //  - indexing unfinalized blocks https://docs.subsquid.io/basics/unfinalized-blocks/
    //  - querying the contract state https://docs.subsquid.io/evm-indexing/query-state/
    .setRpcEndpoint({
        // Set the URL via .env for local runs or via secrets when deploying to Subsquid Cloud
        // https://docs.subsquid.io/deploy-squid/env-variables/
        url: assertNotNull(process.env.RPC_ENDPOINT),
        // More RPC connection options at https://docs.subsquid.io/evm-indexing/configuration/initialization/#set-data-source
        // rateLimit: 10,
        // maxBatchCallSize: 5
    })
    .setFinalityConfirmation(75)
    .addLog({
        address: ["0xD05bC5aBb2D1848372Fe94A7Ce8ddd6A1f2C50b8"],
        range: { from: 5940503 },
        transaction: true
    })
    .setFields({
        log: {
            data: true,
            transactionHash: true
        },
    })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
export type Context = DataHandlerContext<Store, Fields>