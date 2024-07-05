import assert from "assert"
import * as marshal from "./marshal"

export class File {
    private _path!: string
    private _mime!: string

    constructor(props?: Partial<Omit<File, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._path = marshal.string.fromJSON(json.path)
            this._mime = marshal.string.fromJSON(json.mime)
        }
    }

    get path(): string {
        assert(this._path != null, 'uninitialized access')
        return this._path
    }

    set path(value: string) {
        this._path = value
    }

    get mime(): string {
        assert(this._mime != null, 'uninitialized access')
        return this._mime
    }

    set mime(value: string) {
        this._mime = value
    }

    toJSON(): object {
        return {
            path: this.path,
            mime: this.mime,
        }
    }
}
