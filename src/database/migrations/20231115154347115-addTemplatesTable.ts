import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('templates')
    .addColumn('template_id', 'integer', (c) =>
      c.primaryKey().autoIncrement().notNull()
    )
    .addColumn('content', 'text', (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('templates').execute();
}
