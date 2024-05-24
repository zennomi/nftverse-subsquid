module.exports = class Data1716452215269 {
    name = 'Data1716452215269'

    async up(db) {
        await db.query(`ALTER TABLE "collection" DROP COLUMN "category"`)
        await db.query(`ALTER TABLE "collection" ADD "category" character varying(10)`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "collection" ADD "category" character varying(9)`)
        await db.query(`ALTER TABLE "collection" DROP COLUMN "category"`)
    }
}
