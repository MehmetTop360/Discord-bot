import { vi } from 'vitest';
import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';
import * as fixtures from './fixtures';
import { handleCompletion } from '@/modules/discord/messageHandler';
import { messageFactory , messageMatcher} from './utils';

vi.mock('@/modules/discord/messageHandler', () => ({
  handleCompletion: vi.fn(),
}));
const db = await createTestDatabase();

const app = createApp(db);
const createMessages = createFor(db, 'messages');
const createUsers = createFor(db, 'users');
const createSprints = createFor(db, 'sprints');
const createTemplates = createFor(db, 'templates');

beforeEach(async () => {
  await createUsers(fixtures.users);
  await createSprints(fixtures.sprints);
  await createTemplates(fixtures.templates);
});

afterEach(async () => {
  await db.deleteFrom('messages').execute();
  await db.deleteFrom('users').execute();
  await db.deleteFrom('sprints').execute();
  await db.deleteFrom('templates').execute();
  vi.resetAllMocks();
});

afterAll(async () => {
  await db.destroy();
});

describe('GET', () => {
  it('should return a list of messages', async () => {
    await createMessages([
      messageFactory({ messageId: 1 }),
      messageFactory({ messageId: 2, sprintId: 2, status: 'draft' }),
    ]);

    const { body } = await supertest(app).get('/messages').expect(200);

    expect(body).toEqual([
      messageMatcher(),
      messageMatcher({
        sprintId: 2,
        status: 'draft',
      }),
    ]);

    it('try to retrieve all messages, when there are none', async () => {
      const { body: messages } = await supertest(app)
        .get('/messages')
        .expect(404);

      expect(messages).toEqual([]);
    });
  });

  it('should return an empty array when no messages are present', async () => {
    await db.deleteFrom('messages').execute();
    const { body } = await supertest(app).get('/messages').expect(200);
    expect(body).toEqual([]);
  });
});

describe('POST', () => {
  it('should respond with the created message', async () => {
    vi.mocked(handleCompletion).mockResolvedValueOnce(undefined);

    const messageData = messageFactory({
      userId: 1,
      sprintId: 1,
    });
    const { body } = await supertest(app)
      .post('/messages')
      .send(messageData)
      .expect(201);

    expect(body).toMatchObject({
      userId: messageData.userId,
      sprintId: messageData.sprintId,
      status: 'sent',
    });
    expect(handleCompletion).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
  });

  it('should return 400 if userId is missing', async () => {
    const messageData = messageFactory({ userId: undefined });

    const { body } = await supertest(app)
      .post('/messages')
      .send(messageData)
      .expect(400);

    expect(body.error.message).toMatch(/userId/i);
  });

  it('should return 400 if sprintId is missing', async () => {
    const messageData = messageFactory({ sprintId: undefined });

    const { body } = await supertest(app)
      .post('/messages')
      .send(messageData)
      .expect(400);

    expect(body.error.message).toMatch(/sprintId/i);
  });

  it('should return 400 if user does not exist', async () => {
    const messageData = messageFactory({ userId: 123456 });

    const { body } = await supertest(app)
      .post('/messages')
      .send(messageData)
      .expect(400);

    expect(body.error.message).toMatch(/user/i);
  });

  it('should return 400 if sprint does not exist', async () => {
    const messageData = messageFactory({ sprintId: 123456 });

    const { body } = await supertest(app)
      .post('/messages')
      .send(messageData)
      .expect(400);

    expect(body.error.message).toMatch(/sprint/i);
  });
});
