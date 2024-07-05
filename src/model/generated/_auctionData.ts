import assert from "assert"
import * as marshal from "./marshal"

export class AuctionData {
    private _minBid!: bigint
    private _startTime!: Date
    private _endTime!: Date
    private _winner!: string | undefined | null
    private _finalPrice!: bigint | undefined | null

    constructor(props?: Partial<Omit<AuctionData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._minBid = marshal.bigint.fromJSON(json.minBid)
            this._startTime = marshal.datetime.fromJSON(json.startTime)
            this._endTime = marshal.datetime.fromJSON(json.endTime)
            this._winner = json.winner == null ? undefined : marshal.string.fromJSON(json.winner)
            this._finalPrice = json.finalPrice == null ? undefined : marshal.bigint.fromJSON(json.finalPrice)
        }
    }

    get minBid(): bigint {
        assert(this._minBid != null, 'uninitialized access')
        return this._minBid
    }

    set minBid(value: bigint) {
        this._minBid = value
    }

    get startTime(): Date {
        assert(this._startTime != null, 'uninitialized access')
        return this._startTime
    }

    set startTime(value: Date) {
        this._startTime = value
    }

    get endTime(): Date {
        assert(this._endTime != null, 'uninitialized access')
        return this._endTime
    }

    set endTime(value: Date) {
        this._endTime = value
    }

    get winner(): string | undefined | null {
        return this._winner
    }

    set winner(value: string | undefined | null) {
        this._winner = value
    }

    get finalPrice(): bigint | undefined | null {
        return this._finalPrice
    }

    set finalPrice(value: bigint | undefined | null) {
        this._finalPrice = value
    }

    toJSON(): object {
        return {
            minBid: marshal.bigint.toJSON(this.minBid),
            startTime: marshal.datetime.toJSON(this.startTime),
            endTime: marshal.datetime.toJSON(this.endTime),
            winner: this.winner,
            finalPrice: this.finalPrice == null ? undefined : marshal.bigint.toJSON(this.finalPrice),
        }
    }
}
