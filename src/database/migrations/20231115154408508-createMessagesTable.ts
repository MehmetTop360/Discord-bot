import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('messages')
    .addColumn('message_id', 'integer', (c) =>
      c.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_id', 'integer', (c) =>
      c.notNull().references('users.user_id')
    )
    .addColumn('sprint_id', 'integer', (c) =>
      c.notNull().references('sprints.sprint_id')
    )
    .addColumn('template_id', 'integer', (c) =>
      c.notNull().references('templates.template_id')
    )
    .addColumn('timestamp', 'datetime', (c) => c.notNull())
    .addColumn('status', 'text', (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('messages').execute();
}
