import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('sprints')
    .addColumn('sprint_id', 'integer', (c) =>
      c.primaryKey().autoIncrement().notNull()
    )
    .addColumn('sprint_code', 'text', (c) => c.notNull().unique())
    .addColumn('title', 'text', (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('sprints').execute();
}
