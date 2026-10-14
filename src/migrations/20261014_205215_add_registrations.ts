import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_registrations_status" AS ENUM('requested', 'approved', 'rejected', 'closed');
  CREATE TABLE "registrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"citizen_id" uuid NOT NULL,
  	"status" "enum_registrations_status" DEFAULT 'requested' NOT NULL,
  	"requested_at" timestamp(3) with time zone NOT NULL,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "registrations_id" uuid;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "registrations_citizen_idx" ON "registrations" USING btree ("citizen_id");
  CREATE INDEX "registrations_status_idx" ON "registrations" USING btree ("status");
  CREATE INDEX "registrations_updated_at_idx" ON "registrations" USING btree ("updated_at");
  CREATE INDEX "registrations_created_at_idx" ON "registrations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("registrations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "registrations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "registrations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_registrations_fk";
  
  DROP INDEX "payload_locked_documents_rels_registrations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "registrations_id";
  DROP TYPE "public"."enum_registrations_status";`)
}
