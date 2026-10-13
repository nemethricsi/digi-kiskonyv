import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "citizens" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"place_of_birth" varchar NOT NULL,
  	"date_of_birth" timestamp(3) with time zone NOT NULL,
  	"name_of_mother" varchar NOT NULL,
  	"taj" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "citizens_id" uuid;
  CREATE INDEX "citizens_name_idx" ON "citizens" USING btree ("name");
  CREATE UNIQUE INDEX "citizens_taj_idx" ON "citizens" USING btree ("taj");
  CREATE INDEX "citizens_updated_at_idx" ON "citizens" USING btree ("updated_at");
  CREATE INDEX "citizens_created_at_idx" ON "citizens" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_citizens_fk" FOREIGN KEY ("citizens_id") REFERENCES "public"."citizens"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_citizens_id_idx" ON "payload_locked_documents_rels" USING btree ("citizens_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_citizens_fk";
  DROP INDEX "payload_locked_documents_rels_citizens_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "citizens_id";
  DROP TABLE "citizens" CASCADE;`)
}
