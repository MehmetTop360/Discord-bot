import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely';
import type { Database, DB, Users } from '@/database';
import { keys } from './schema';

const TABLE = 'users';
type TableName = typeof TABLE;
type Row = Users;
type RowWithoutId = Omit<Row, 'userId'>;
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

  findById(userId: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('userId', '=', userId)
      .executeTakeFirst();
  },

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  },

  update(userId: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(userId);
    }

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('userId', '=', userId)
      .returning(keys)
      .executeTakeFirst();
  },

  remove(userId: number) {
    return db
      .deleteFrom(TABLE)
      .where('userId', '=', userId)
      .returning(keys)
      .executeTakeFirst();
  },

  async findByDiscordId(discordId: string): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('discordId', '=', discordId)
      .execute();
  },
});
