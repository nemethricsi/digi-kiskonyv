import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "appointments" ADD COLUMN "label" varchar;`)

  // Backfill existing rows. Same format as appointmentLabel() in src/lib/appointment-label.ts
  await db.execute(sql`
    UPDATE "appointments" AS a
    SET "label" = c."name"
      || ' · ' || to_char(a."scheduled_at" AT TIME ZONE 'Europe/Budapest', 'YYYY. MM. DD. FMHH24:MI')
      || ' · ' || a."title"
    FROM "citizens" AS c
    WHERE c."id" = a."citizen_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "appointments" DROP COLUMN "label";`)
}
