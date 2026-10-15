import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_appointments_status" AS ENUM('scheduled', 'attended', 'missed', 'cancelled');
  CREATE TABLE "appointments" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"registration_id" uuid NOT NULL,
  	"citizen_id" uuid,
  	"title" varchar NOT NULL,
  	"scheduled_at" timestamp(3) with time zone NOT NULL,
  	"status" "enum_appointments_status" DEFAULT 'scheduled' NOT NULL,
  	"created_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "appointments_id" uuid;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "appointments_registration_idx" ON "appointments" USING btree ("registration_id");
  CREATE INDEX "appointments_citizen_idx" ON "appointments" USING btree ("citizen_id");
  CREATE INDEX "appointments_scheduled_at_idx" ON "appointments" USING btree ("scheduled_at");
  CREATE INDEX "appointments_status_idx" ON "appointments" USING btree ("status");
  CREATE INDEX "appointments_created_by_idx" ON "appointments" USING btree ("created_by_id");
  CREATE INDEX "appointments_updated_at_idx" ON "appointments" USING btree ("updated_at");
  CREATE INDEX "appointments_created_at_idx" ON "appointments" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointments_fk" FOREIGN KEY ("appointments_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_appointments_id_idx" ON "payload_locked_documents_rels" USING btree ("appointments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_appointments_fk";
  ALTER TABLE "appointments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "appointments" CASCADE;

  DROP INDEX "payload_locked_documents_rels_appointments_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "appointments_id";
  DROP TYPE "public"."enum_appointments_status";`)
}
