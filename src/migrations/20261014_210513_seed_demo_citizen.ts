import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Data migration: the fictional demo citizen the mock DÁP sign-in (/dap/me) shows, in every
// environment including production. Raw SQL instead of payload.create(), so later changes to the
// Citizen collection config cannot break this migration. Idempotent via the unique TAJ index.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    INSERT INTO "citizens" ("name", "place_of_birth", "date_of_birth", "name_of_mother", "taj")
    VALUES ('Gipsz Jakab', 'Budapest', '1990-01-01T12:00:00.000Z', 'Gipsz Jakabné', '123456788')
    ON CONFLICT ("taj") DO NOTHING;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "citizens" WHERE "taj" = '123456788';`)
}
