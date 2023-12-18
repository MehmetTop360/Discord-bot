import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Messages {
  messageId: Generated<number>;
  userId: number;
  sprintId: number;
  templateId: number;
  timestamp: string;
  status: string;
}

export interface Sprints {
  sprintId: Generated<number>;
  sprintCode: string;
  title: string;
}

export interface Templates {
  templateId: Generated<number>;
  content: string;
}

export interface Users {
  userId: Generated<number>;
  discordId: string;
}

export interface DB {
  messages: Messages;
  sprints: Sprints;
  templates: Templates;
  users: Users;
}
