module.exports = class Data1713275034712 {
    name = 'Data1713275034712'

    async up(db) {
        await db.query(`CREATE TABLE "collection" ("id" character varying NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "token_id" numeric NOT NULL, "uri" text, "image" text, "attributes" jsonb, "collection_id" character varying, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_65f74edd41f667e4645e59b61d" ON "token" ("collection_id") `)
        await db.query(`CREATE TABLE "list_event" ("id" character varying NOT NULL, "pay_token" text NOT NULL, "price" numeric NOT NULL, "seller" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "tx_hash" text NOT NULL, "collection_id" character varying, "token_id" character varying, CONSTRAINT "PK_f8c492905c39ccf96389ff91cb2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_49369f11c7b5fd17afc56bee6d" ON "list_event" ("collection_id") `)
        await db.query(`CREATE INDEX "IDX_5393981a13629efdee83bf3f55" ON "list_event" ("token_id") `)
        await db.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_65f74edd41f667e4645e59b61df" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "list_event" ADD CONSTRAINT "FK_49369f11c7b5fd17afc56bee6d1" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "list_event" ADD CONSTRAINT "FK_5393981a13629efdee83bf3f555" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "collection"`)
        await db.query(`DROP TABLE "token"`)
        await db.query(`DROP INDEX "public"."IDX_65f74edd41f667e4645e59b61d"`)
        await db.query(`DROP TABLE "list_event"`)
        await db.query(`DROP INDEX "public"."IDX_49369f11c7b5fd17afc56bee6d"`)
        await db.query(`DROP INDEX "public"."IDX_5393981a13629efdee83bf3f55"`)
        await db.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_65f74edd41f667e4645e59b61df"`)
        await db.query(`ALTER TABLE "list_event" DROP CONSTRAINT "FK_49369f11c7b5fd17afc56bee6d1"`)
        await db.query(`ALTER TABLE "list_event" DROP CONSTRAINT "FK_5393981a13629efdee83bf3f555"`)
    }
}
