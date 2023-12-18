import { z } from 'zod';
import type { Messages } from '@/database';

type Record = Messages;

const schema = z.object({
  messageId: z.number().int().positive(),
  userId: z.number().int().positive(),
  sprintId: z.number().int().positive(),
  templateId: z.number().int().positive(),
  timestamp: z.string(),
  status: z.string(),
});

const insertable = schema.omit({
  messageId: true,
  templateId: true,
  status: true,
  timestamp: true,
});

const updateable = insertable
  .omit({
    userId: true,
    sprintId: true,
    templateId: true,
  })
  .partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.messageId.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
