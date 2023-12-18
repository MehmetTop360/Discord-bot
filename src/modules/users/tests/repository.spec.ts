import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import { userFactory, userMatcher } from './utils';
import buildRepository from '../repository';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createUsers = createFor(db, 'users');
const selectUsers = selectAllFor(db, 'users');

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

describe('User Repository', () => {
  describe('create', () => {
    it('should create a user', async () => {
      const user = await repository.create({
        discordId: 'user123',
      });

      expect(user).toEqual({
        userId: expect.any(Number),
        discordId: 'user123',
      });

      const usersInDatabase = await selectUsers();
      expect(usersInDatabase).toContainEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      await createUsers([
        userFactory({ discordId: 'user1' }),
        userFactory({ discordId: 'user2' }),
      ]);

      const users = await repository.findAll();

      expect(users).toHaveLength(2);
      expect(users).toEqual(
        expect.arrayContaining([
          userMatcher({ discordId: 'user1' }),
          userMatcher({ discordId: 'user2' }),
        ])
      );
    });
  });

  describe('findByDiscordId', () => {
    it('should return a user by discordId', async () => {
      await createUsers([
        userFactory({ discordId: 'user1' }),
        userFactory({ discordId: 'user2' }),
      ]);

      const user = await repository.findByDiscordId('user1');

      expect(user).toEqual([userMatcher({ discordId: 'user1' })]);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const [user] = await createUsers([userFactory({ discordId: 'user1' })]);

      const updatedUser = await repository.update(user.userId, {
        discordId: 'user2',
      });

      expect(updatedUser).toEqual(
        userMatcher({ userId: user.userId, discordId: 'user2' })
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const [user] = await createUsers([userFactory({ discordId: 'user1' })]);

      await repository.remove(user.userId);

      const users = await selectUsers();

      expect(users).toHaveLength(0);
    });
  });
});
