module.exports = class Data1720170941940 {
    name = 'Data1720170941940'

    async up(db) {
        await db.query(`ALTER TABLE "offer_event" ADD "tx_hash" text NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "offer_event" DROP COLUMN "tx_hash"`)
    }
}
