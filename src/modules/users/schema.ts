import { z } from 'zod';
import type { Users } from '@/database';

type Record = Users;
const schema = z.object({
  userId: z.number().int().positive().optional(),
  discordId: z.string(),
});

const insertable = schema.omit({
  userId: true,
});

const partial = insertable.partial();

export const parseId = (id: unknown) => z.number().int().positive().parse(id);
export const parse = (record: unknown) => schema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
