module.exports = class Data1720170903922 {
    name = 'Data1720170903922'

    async up(db) {
        await db.query(`ALTER TABLE "bid_event" ADD "tx_hash" text NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "bid_event" DROP COLUMN "tx_hash"`)
    }
}
