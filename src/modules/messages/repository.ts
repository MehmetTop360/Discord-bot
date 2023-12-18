import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely';
import { keys } from './schema';
import type { Messages, Database, DB } from '@/database';
import BadRequest from '@/utils/errors/BadRequest';

const TABLE = 'messages';
type TableName = typeof TABLE;
type Row = Messages;
type RowWithoutId = Omit<Row, 'messageId'>;
type RowRelationshipsIds = Pick<Row, 'userId' | 'sprintId' | 'templateId'>;
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

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('messageId', '=', id)
      .executeTakeFirst();
  },

  updateStatus(
    messageId: number,
    status: string
  ): Promise<RowSelect | undefined> {
    return db
      .updateTable(TABLE)
      .set({ status })
      .where('messageId', '=', messageId)
      .returning(keys)
      .executeTakeFirst();
  },

  async create(record: RowInsert): Promise<RowSelect | undefined> {
    await assertRelationshipsExist(db, record);

    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  },

  async update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(id);
    }

    await assertRelationshipsExist(db, partial);

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('messageId', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },

  remove(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('messageId', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },

  async findByUserId(userId: number): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('userId', '=', userId)
      .execute();
  },

  async findBySprintId(sprintId: number): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('sprintId', '=', sprintId)
      .execute();
  },
});

async function assertRelationshipsExist(
  db: Database,
  record: Partial<RowRelationshipsIds>
) {
  const { userId, sprintId, templateId } = record;

  if (userId) {
    const user = await db
      .selectFrom('users')
      .select('userId')
      .where('userId', '=', userId)
      .executeTakeFirst();

    if (!user) {
      throw new BadRequest('Referenced user does not exist');
    }
  }

  if (sprintId) {
    const sprint = await db
      .selectFrom('sprints')
      .select('sprintId')
      .where('sprintId', '=', sprintId)
      .executeTakeFirst();

    if (!sprint) {
      throw new BadRequest('Referenced sprint does not exist');
    }
  }

  if (templateId) {
    const template = await db
      .selectFrom('templates')
      .select('templateId')
      .where('templateId', '=', templateId)
      .executeTakeFirst();

    if (!template) {
      throw new BadRequest('Referenced template does not exist');
    }
  }
}
