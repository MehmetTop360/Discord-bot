import { Insertable } from "kysely";
import { Messages } from "@/database";

let messageIdCounter = 1;

export const messageFactory = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => {
  const message = {
    messageId: messageIdCounter,
    userId: 1,
    sprintId: 1,
    templateId: 1,
    timestamp: '2023-11-17T12:00:00Z',
    status: 'sent',
    ...overrides,
  };

  messageIdCounter += 1;

  return message;
};

export const messageMatcher = (overrides: Partial<Insertable<Messages>> = {}) => ({
  messageId: expect.any(Number),
  userId: expect.any(Number),
  sprintId: expect.any(Number),
  templateId: expect.any(Number),
  timestamp: expect.any(String),
  status: 'sent',
  ...overrides,
});
