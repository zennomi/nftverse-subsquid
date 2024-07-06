import assert from "assert"
import * as marshal from "./marshal"

export class AuctionData {
    private _minBid!: bigint
    private _startTime!: Date
    private _endTime!: Date
    private _startPrice!: bigint

    constructor(props?: Partial<Omit<AuctionData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._minBid = marshal.bigint.fromJSON(json.minBid)
            this._startTime = marshal.datetime.fromJSON(json.startTime)
            this._endTime = marshal.datetime.fromJSON(json.endTime)
            this._startPrice = marshal.bigint.fromJSON(json.startPrice)
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

    get startPrice(): bigint {
        assert(this._startPrice != null, 'uninitialized access')
        return this._startPrice
    }

    set startPrice(value: bigint) {
        this._startPrice = value
    }

    toJSON(): object {
        return {
            minBid: marshal.bigint.toJSON(this.minBid),
            startTime: marshal.datetime.toJSON(this.startTime),
            endTime: marshal.datetime.toJSON(this.endTime),
            startPrice: marshal.bigint.toJSON(this.startPrice),
        }
    }
}
