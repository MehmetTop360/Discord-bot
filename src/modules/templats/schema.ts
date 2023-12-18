import { z } from 'zod';
import type { Templates } from '@/database';

type Record = Templates;
const schema = z.object({
  templateId: z.number().int().positive().optional(),
  content: z.string().nonempty(),
});

const insertable = schema.omit({
  templateId: true,
});

const partial = insertable.partial();

export const parseId = (id: unknown) => z.number().int().positive().parse(id);
export const parse = (record: unknown) => schema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
