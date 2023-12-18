import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely';
import type { Database, DB, Sprints } from '@/database';
import { keys } from './schema';

const TABLE = 'sprints';
type TableName = typeof TABLE;
type Row = Sprints;
type RowWithoutId = Omit<Row, 'sprintId'>;
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

  findById(sprintId: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('sprintId', '=', sprintId)
      .executeTakeFirst();
  },

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  },

  update(sprintId: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(sprintId);
    }

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('sprintId', '=', sprintId)
      .returning(keys)
      .executeTakeFirst();
  },

  remove(sprintId: number) {
    return db
      .deleteFrom(TABLE)
      .where('sprintId', '=', sprintId)
      .returning(keys)
      .executeTakeFirst();
  },
  async findBySprintCode(sprintCode: string): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('sprintCode', '=', sprintCode)
      .execute();
  },
});
