import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './NFTVerseMarketplace.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AcceptedNFT: new LogEvent<([nft: string, tokenId: bigint, payToken: string, offerPrice: bigint, offerer: string, nftOwner: string] & {nft: string, tokenId: bigint, payToken: string, offerPrice: bigint, offerer: string, nftOwner: string})>(
        abi, '0x9e4a193680f4538a4b29d70aa5b240ca9068a1d971f7932be2c8b92e6c4b31ce'
    ),
    AddPayableToken: new LogEvent<([tokenAddress: string] & {tokenAddress: string})>(
        abi, '0x4d85a98a26bab2d99cce058d5aa41645873ca432c52092c74773110658c92a7e'
    ),
    BoughtNFT: new LogEvent<([nft: string, tokenId: bigint, payToken: string, price: bigint, seller: string, buyer: string] & {nft: string, tokenId: bigint, payToken: string, price: bigint, seller: string, buyer: string})>(
        abi, '0x72136ea02664c7ef94168318a5622b2f8cc9e3a3f2bfd6fbdff378aa303e4beb'
    ),
    CanceledListedNFT: new LogEvent<([nft: string, tokenId: bigint, seller: string] & {nft: string, tokenId: bigint, seller: string})>(
        abi, '0x1680ded6dd194832c554c86e7696ff97f6081af4b8e03f2f8c1dc7b6869b41dd'
    ),
    CanceledOfferredNFT: new LogEvent<([nft: string, tokenId: bigint, payToken: string, offerPrice: bigint, offerer: string] & {nft: string, tokenId: bigint, payToken: string, offerPrice: bigint, offerer: string})>(
        abi, '0xefb35510217b7f826a226a55de4a753e6944118842f02b483169782e250c291c'
    ),
    CreatedAuction: new LogEvent<([nft: string, tokenId: bigint, payToken: string, price: bigint, minBid: bigint, startTime: bigint, endTime: bigint, creator: string] & {nft: string, tokenId: bigint, payToken: string, price: bigint, minBid: bigint, startTime: bigint, endTime: bigint, creator: string})>(
        abi, '0x15888491dd8f256e5e28ceaf57c0db6819ae0399cc259e9764887563223f7acd'
    ),
    Initialized: new LogEvent<([version: number] & {version: number})>(
        abi, '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
    ),
    ListedNFT: new LogEvent<([nft: string, tokenId: bigint, payToken: string, price: bigint, seller: string] & {nft: string, tokenId: bigint, payToken: string, price: bigint, seller: string})>(
        abi, '0xd3c529cf7f810e6effd6ee492c3c44aaaeaab46bb7b4d6d3f01d0aecf487f6b9'
    ),
    OfferredNFT: new LogEvent<([nft: string, tokenId: bigint, payToken: string, offerPrice: bigint, offerer: string] & {nft: string, tokenId: bigint, payToken: string, offerPrice: bigint, offerer: string})>(
        abi, '0x68440885b8f55b92e46c64e6e8e8e58f2cdfeb729aef39fae95e9ac075572129'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    PlacedBid: new LogEvent<([nft: string, tokenId: bigint, payToken: string, bidPrice: bigint, bidder: string] & {nft: string, tokenId: bigint, payToken: string, bidPrice: bigint, bidder: string})>(
        abi, '0x1366a066e0b6138abe26f53c966c9de1cfc0f79f586100f5c785c9a5ea198905'
    ),
    ResultedAuction: new LogEvent<([nft: string, tokenId: bigint, creator: string, winner: string, price: bigint, caller: string] & {nft: string, tokenId: bigint, creator: string, winner: string, price: bigint, caller: string})>(
        abi, '0x69b9e47c169c6463a921b70743b7d6705d5ee0b376296ae9bf0b1a3678fb3f5d'
    ),
}

export const functions = {
    acceptOfferNFT: new Func<[_nft: string, _tokenId: bigint, _offerer: string], {_nft: string, _tokenId: bigint, _offerer: string}, []>(
        abi, '0xeb95711b'
    ),
    addPayableToken: new Func<[_token: string], {_token: string}, []>(
        abi, '0x13201385'
    ),
    bidPlace: new Func<[_nft: string, _tokenId: bigint, _bidPrice: bigint], {_nft: string, _tokenId: bigint, _bidPrice: bigint}, []>(
        abi, '0xd863a1a7'
    ),
    bidPlaceByETH: new Func<[_nft: string, _tokenId: bigint], {_nft: string, _tokenId: bigint}, []>(
        abi, '0xb015f64a'
    ),
    buyNFT: new Func<[_nft: string, _tokenId: bigint, _payToken: string, _price: bigint], {_nft: string, _tokenId: bigint, _payToken: string, _price: bigint}, []>(
        abi, '0xf01ade78'
    ),
    buyNFTByETH: new Func<[_nfts: Array<string>, _tokenIds: Array<bigint>, _prices: Array<bigint>], {_nfts: Array<string>, _tokenIds: Array<bigint>, _prices: Array<bigint>}, []>(
        abi, '0x9cc64834'
    ),
    buyNFTs: new Func<[_nfts: Array<string>, _tokenIds: Array<bigint>, _payTokens: Array<string>, _prices: Array<bigint>], {_nfts: Array<string>, _tokenIds: Array<bigint>, _payTokens: Array<string>, _prices: Array<bigint>}, []>(
        abi, '0x6840fa19'
    ),
    buyNFTsByETH: new Func<[_nft: string, _tokenId: bigint], {_nft: string, _tokenId: bigint}, []>(
        abi, '0x5d6624a1'
    ),
    calculatePlatformFee: new Func<[_price: bigint], {_price: bigint}, bigint>(
        abi, '0x0cbab4f7'
    ),
    cancelAuction: new Func<[_nft: string, _tokenId: bigint], {_nft: string, _tokenId: bigint}, []>(
        abi, '0x859b97fe'
    ),
    cancelListedNFT: new Func<[_nft: string, _tokenId: bigint], {_nft: string, _tokenId: bigint}, []>(
        abi, '0x465c731f'
    ),
    cancelOfferNFT: new Func<[_nft: string, _tokenId: bigint], {_nft: string, _tokenId: bigint}, []>(
        abi, '0x46f5ab31'
    ),
    changeFeeRecipient: new Func<[_feeRecipient: string], {_feeRecipient: string}, []>(
        abi, '0x23604071'
    ),
    checkIsPayableToken: new Func<[_payableToken: string], {_payableToken: string}, boolean>(
        abi, '0x9d8f4f55'
    ),
    createAuction: new Func<[_nft: string, _tokenId: bigint, _payToken: string, _price: bigint, _minBid: bigint, _startTime: bigint, _endTime: bigint], {_nft: string, _tokenId: bigint, _payToken: string, _price: bigint, _minBid: bigint, _startTime: bigint, _endTime: bigint}, []>(
        abi, '0x122b0645'
    ),
    getListedNFT: new Func<[_nft: string, _tokenId: bigint], {_nft: string, _tokenId: bigint}, ([nft: string, tokenId: bigint, seller: string, payToken: string, price: bigint, sold: boolean] & {nft: string, tokenId: bigint, seller: string, payToken: string, price: bigint, sold: boolean})>(
        abi, '0xdc3c3dfd'
    ),
    getPayableTokens: new Func<[], {}, Array<string>>(
        abi, '0x5b5b3314'
    ),
    initialize: new Func<[_platformFee: bigint, _feeRecipient: string], {_platformFee: bigint, _feeRecipient: string}, []>(
        abi, '0xda35a26f'
    ),
    listNft: new Func<[_nft: string, _tokenId: bigint, _payToken: string, _price: bigint], {_nft: string, _tokenId: bigint, _payToken: string, _price: bigint}, []>(
        abi, '0xdcbb63e6'
    ),
    offerNFT: new Func<[_nft: string, _tokenId: bigint, _offerPrice: bigint], {_nft: string, _tokenId: bigint, _offerPrice: bigint}, []>(
        abi, '0xff9679d1'
    ),
    offerNFTByETH: new Func<[_nft: string, _tokenId: bigint], {_nft: string, _tokenId: bigint}, []>(
        abi, '0x86951da8'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    resultAuction: new Func<[_nft: string, _tokenId: bigint], {_nft: string, _tokenId: bigint}, []>(
        abi, '0x5f7063ef'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
    updatePlatformFee: new Func<[_platformFee: bigint], {_platformFee: bigint}, []>(
        abi, '0xaa0b5988'
    ),
}

export class Contract extends ContractBase {

    calculatePlatformFee(_price: bigint): Promise<bigint> {
        return this.eth_call(functions.calculatePlatformFee, [_price])
    }

    checkIsPayableToken(_payableToken: string): Promise<boolean> {
        return this.eth_call(functions.checkIsPayableToken, [_payableToken])
    }

    getListedNFT(_nft: string, _tokenId: bigint): Promise<([nft: string, tokenId: bigint, seller: string, payToken: string, price: bigint, sold: boolean] & {nft: string, tokenId: bigint, seller: string, payToken: string, price: bigint, sold: boolean})> {
        return this.eth_call(functions.getListedNFT, [_nft, _tokenId])
    }

    getPayableTokens(): Promise<Array<string>> {
        return this.eth_call(functions.getPayableTokens, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }
}
