module.exports = class Data1716525829150 {
    name = 'Data1716525829150'

    async up(db) {
        await db.query(`CREATE TABLE "collection" ("id" character varying NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, "category" character varying(10), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "token_id" numeric NOT NULL, "name" text, "description" text, "animation" text, "uri" text, "image" text, "attributes" jsonb, "collection_id" character varying, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_65f74edd41f667e4645e59b61d" ON "token" ("collection_id") `)
        await db.query(`CREATE TABLE "payment_token" ("id" character varying NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, "decimals" integer NOT NULL, CONSTRAINT "PK_dd7d291c180f33c6ed2b707c179" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "list_event" ("id" character varying NOT NULL, "price" numeric NOT NULL, "seller" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "tx_hash" text NOT NULL, "status" character varying(8) NOT NULL, "collection_id" character varying, "token_id" character varying, "pay_token_id" character varying, CONSTRAINT "PK_f8c492905c39ccf96389ff91cb2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_49369f11c7b5fd17afc56bee6d" ON "list_event" ("collection_id") `)
        await db.query(`CREATE INDEX "IDX_5393981a13629efdee83bf3f55" ON "list_event" ("token_id") `)
        await db.query(`CREATE INDEX "IDX_2f0ed7fe5a2955b9a832288e5f" ON "list_event" ("pay_token_id") `)
        await db.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_65f74edd41f667e4645e59b61df" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "list_event" ADD CONSTRAINT "FK_49369f11c7b5fd17afc56bee6d1" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "list_event" ADD CONSTRAINT "FK_5393981a13629efdee83bf3f555" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "list_event" ADD CONSTRAINT "FK_2f0ed7fe5a2955b9a832288e5f6" FOREIGN KEY ("pay_token_id") REFERENCES "payment_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "collection"`)
        await db.query(`DROP TABLE "token"`)
        await db.query(`DROP INDEX "public"."IDX_65f74edd41f667e4645e59b61d"`)
        await db.query(`DROP TABLE "payment_token"`)
        await db.query(`DROP TABLE "list_event"`)
        await db.query(`DROP INDEX "public"."IDX_49369f11c7b5fd17afc56bee6d"`)
        await db.query(`DROP INDEX "public"."IDX_5393981a13629efdee83bf3f55"`)
        await db.query(`DROP INDEX "public"."IDX_2f0ed7fe5a2955b9a832288e5f"`)
        await db.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_65f74edd41f667e4645e59b61df"`)
        await db.query(`ALTER TABLE "list_event" DROP CONSTRAINT "FK_49369f11c7b5fd17afc56bee6d1"`)
        await db.query(`ALTER TABLE "list_event" DROP CONSTRAINT "FK_5393981a13629efdee83bf3f555"`)
        await db.query(`ALTER TABLE "list_event" DROP CONSTRAINT "FK_2f0ed7fe5a2955b9a832288e5f6"`)
    }
}
