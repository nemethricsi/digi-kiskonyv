import { sql } from '@payloadcms/db-postgres/drizzle';

import { seed } from '@/seed/seed';

import type { PostgresAdapter } from '@payloadcms/db-postgres';
import type { Payload } from 'payload';

// Demo reset: empties every table and seeds again, in one transaction.
// Not `migrate:fresh`: the schema and the migration history stay untouched, only the rows go.
// TRUNCATE skips the collection hooks and access rules (e.g. attendances cannot be deleted),
// which is the point here: this is a system operation, not a user's.
export async function resetDemoData(payload: Payload) {
  // The config uses postgresAdapter; the generic type does not know about its drizzle sessions
  const db = payload.db as unknown as PostgresAdapter;
  const transactionID = await db.beginTransaction();
  if (!transactionID) {
    throw new Error('Demo reset needs a database transaction.');
  }

  try {
    const tx = db.sessions[transactionID].db;
    const { rows } = await tx.execute<{ tablename: string }>(sql`
      SELECT tablename FROM pg_tables
      WHERE schemaname = current_schema() AND tablename <> 'payload_migrations'
    `);
    // CASCADE: the order of the foreign keys does not matter
    await tx.execute(
      sql`TRUNCATE ${sql.join(
        rows.map(({ tablename }) => sql.identifier(tablename)),
        sql`, `,
      )} CASCADE`,
    );

    // Same transaction: if the seed fails, the truncate is rolled back too
    await seed(payload, { transactionID });
    await db.commitTransaction(transactionID);
  } catch (error) {
    await db.rollbackTransaction(transactionID);
    throw error;
  }
}
