import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_attendances_method" AS ENUM('manual', 'code');
  CREATE TABLE "attendances" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"appointment_id" uuid NOT NULL,
  	"citizen_id" uuid,
  	"recorded_at" timestamp(3) with time zone,
  	"recorded_by_id" uuid,
  	"method" "enum_attendances_method" DEFAULT 'manual' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "check_in_codes" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"appointment_id" uuid NOT NULL,
  	"code" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "attendances_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "check_in_codes_id" uuid;
  ALTER TABLE "attendances" ADD CONSTRAINT "attendances_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attendances" ADD CONSTRAINT "attendances_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attendances" ADD CONSTRAINT "attendances_recorded_by_id_users_id_fk" FOREIGN KEY ("recorded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "check_in_codes" ADD CONSTRAINT "check_in_codes_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "attendances_appointment_idx" ON "attendances" USING btree ("appointment_id");
  CREATE INDEX "attendances_citizen_idx" ON "attendances" USING btree ("citizen_id");
  CREATE INDEX "attendances_recorded_by_idx" ON "attendances" USING btree ("recorded_by_id");
  CREATE INDEX "attendances_updated_at_idx" ON "attendances" USING btree ("updated_at");
  CREATE INDEX "attendances_created_at_idx" ON "attendances" USING btree ("created_at");
  CREATE INDEX "check_in_codes_appointment_idx" ON "check_in_codes" USING btree ("appointment_id");
  CREATE UNIQUE INDEX "check_in_codes_code_idx" ON "check_in_codes" USING btree ("code");
  CREATE INDEX "check_in_codes_expires_at_idx" ON "check_in_codes" USING btree ("expires_at");
  CREATE INDEX "check_in_codes_updated_at_idx" ON "check_in_codes" USING btree ("updated_at");
  CREATE INDEX "check_in_codes_created_at_idx" ON "check_in_codes" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_attendances_fk" FOREIGN KEY ("attendances_id") REFERENCES "public"."attendances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_check_in_codes_fk" FOREIGN KEY ("check_in_codes_id") REFERENCES "public"."check_in_codes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_attendances_id_idx" ON "payload_locked_documents_rels" USING btree ("attendances_id");
  CREATE INDEX "payload_locked_documents_rels_check_in_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("check_in_codes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_attendances_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_check_in_codes_fk";
  ALTER TABLE "attendances" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "check_in_codes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "attendances" CASCADE;
  DROP TABLE "check_in_codes" CASCADE;

  DROP INDEX "payload_locked_documents_rels_attendances_id_idx";
  DROP INDEX "payload_locked_documents_rels_check_in_codes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "attendances_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "check_in_codes_id";
  DROP TYPE "public"."enum_attendances_method";`)
}
