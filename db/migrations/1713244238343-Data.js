module.exports = class Data1713244238343 {
    name = 'Data1713244238343'

    async up(db) {
        await db.query(`CREATE TABLE "list_event" ("id" character varying NOT NULL, "nft" text NOT NULL, "token_id" numeric NOT NULL, "pay_token" text NOT NULL, "price" numeric NOT NULL, "seller" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_f8c492905c39ccf96389ff91cb2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0fa5e582930698b197bc997193" ON "list_event" ("nft") `)
        await db.query(`CREATE INDEX "IDX_5393981a13629efdee83bf3f55" ON "list_event" ("token_id") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "list_event"`)
        await db.query(`DROP INDEX "public"."IDX_0fa5e582930698b197bc997193"`)
        await db.query(`DROP INDEX "public"."IDX_5393981a13629efdee83bf3f55"`)
    }
}
