import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { Insertable } from 'kysely';
import createApp from '@/app';
import { Users } from '@/database';

const db = await createTestDatabase();
const app = createApp(db);

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

afterAll(async () => {
  await db.destroy();
});

const userFactory = (
  overrides: Partial<Insertable<Users>> = {}
): Insertable<Users> => ({
  discordId: 'exampleDiscordId123',
  ...overrides,
});

describe('Users API', () => {
  describe('POST /users', () => {
    it('allows creating a new user', async () => {
      const newUser = userFactory();
      const { body } = await supertest(app)
        .post('/users')
        .send(newUser)
        .expect(201);

      expect(body).toEqual(expect.objectContaining(newUser));
    });
  });

  describe('PATCH /users/:userId', () => {
    it('allows updating a user', async () => {
      const newUser = userFactory();
      const { body: createdUser } = await supertest(app)
        .post('/users')
        .send(newUser)
        .expect(201);

      const updatedDiscordId = 'updatedDiscordId123';
      const { body: updatedUser } = await supertest(app)
        .patch(`/users/${createdUser.userId}`)
        .send({ discordId: updatedDiscordId })
        .expect(200);

      expect(updatedUser).toEqual(
        expect.objectContaining({
          discordId: updatedDiscordId,
        })
      );
    });
  });

  describe('DELETE /users/:userId', () => {
    it('allows deleting a user', async () => {
      const newUser = userFactory();
      const createResponse = await supertest(app)
        .post('/users')
        .send(newUser)
        .expect(201);

      const createdUser = createResponse.body;

      const deleteResponse = await supertest(app).delete(
        `/users/${createdUser.userId}`
      );
      expect(deleteResponse.status).toBe(204);

      const getResponse = await supertest(app).get(
        `/users/${createdUser.userId}`
      );
      expect(getResponse.status).toBe(404);
    });
  });

  describe('GET /users', () => {
    it('retrieves all users', async () => {
      const user1 = userFactory({ discordId: 'user1DiscordId123' });
      const user2 = userFactory({ discordId: 'user2DiscordId123' });
      await supertest(app).post('/users').send(user1).expect(201);
      await supertest(app).post('/users').send(user2).expect(201);

      const { body: users } = await supertest(app).get('/users').expect(200);

      expect(users).toEqual(
        expect.arrayContaining([
          expect.objectContaining(user1),
          expect.objectContaining(user2),
        ])
      );
    });

    it('retrieves a single user by userId', async () => {
      const newUser = userFactory();
      const { body: createdUser } = await supertest(app)
        .post('/users')
        .send(newUser)
        .expect(201);

      const { body: fetchedUser } = await supertest(app)
        .get(`/users/${createdUser.userId}`)
        .expect(200);

      expect(fetchedUser).toEqual(expect.objectContaining(newUser));
    });
  });
});
