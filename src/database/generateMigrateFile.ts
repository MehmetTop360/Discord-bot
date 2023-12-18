/* eslint-disable no-console */
import { writeFile } from 'fs/promises';

async function createMigrationFile(description: string) {
  if (!description) {
    console.error('Usage: node create-migration.ts <migration_description>');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');
  const migrationFileName = `./src/database/migrations/${timestamp}-${description}.ts`;

  const migrationContent = `
import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  // Add your migration up logic here
}

export async function down(db: Kysely<SqliteDatabase>) {
  // Add your migration down logic here
}
`;

  try {
    await writeFile(migrationFileName, migrationContent);
    console.log(`Migration file created: ${migrationFileName}`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

const [description] = process.argv.slice(2);
createMigrationFile(description);
