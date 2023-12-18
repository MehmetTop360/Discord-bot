import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely';
import { sql } from 'kysely';
import type { Database, DB, Templates } from '@/database';
import { keys } from './schema';

const TABLE = 'templates';
type TableName = typeof TABLE;
type Row = Templates;
type RowWithoutId = Omit<Row, 'templateId'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute();
  },

  find(
    expression: ExpressionOrFactory<DB, TableName, SqlBool>
  ): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).where(expression).execute();
  },

  findById(templateId: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('templateId', '=', templateId)
      .executeTakeFirst();
  },

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  },

  update(
    templateId: number,
    partial: RowUpdate
  ): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(templateId);
    }

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('templateId', '=', templateId)
      .returning(keys)
      .executeTakeFirst();
  },

  remove(templateId: number) {
    return db
      .deleteFrom(TABLE)
      .where('templateId', '=', templateId)
      .returning(keys)
      .executeTakeFirst();
  },

  findRandom(): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .orderBy(sql`RANDOM()`)
      .limit(1)
      .executeTakeFirst();
  },
});
