import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('users')
    .addColumn('user_id', 'integer', (c) =>
      c.primaryKey().autoIncrement().notNull()
    )
    .addColumn('discord_id', 'text', (c) => c.notNull().unique())
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('users').execute();
}
