import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { sprintFactory, sprintMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createSprints = createFor(db, 'sprints');
const selectSprints = selectAllFor(db, 'sprints');

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});

describe('Sprints Repository', () => {
  describe('create', () => {
    it('should create a sprint', async () => {
      const sprint = await repository.create(sprintFactory());

      expect(sprint).toEqual(sprintMatcher());

      const sprintsInDatabase = await selectSprints();
      expect(sprintsInDatabase).toContainEqual(sprint);
    });
  });

  describe('findAll', () => {
    it('should return all sprints', async () => {
      await createSprints([
        sprintFactory({ sprintCode: 'WD-1.1', title: 'Sprint 1' }),
        sprintFactory({ sprintCode: 'WD-1.2', title: 'Sprint 2' }),
      ]);

      const sprints = await repository.findAll();

      expect(sprints).toHaveLength(2);
      expect(sprints[0]).toEqual(sprintMatcher({ title: 'Sprint 1' }));
      expect(sprints[1]).toEqual(sprintMatcher({ title: 'Sprint 2' }));
    });
  });

  describe('findById', () => {
    it('should return a sprint by id', async () => {
      const [sprint] = await createSprints([sprintFactory()]);

      const foundSprint = await repository.findById(sprint.sprintId);

      expect(foundSprint).toEqual(sprintMatcher());
    });

    it('should return undefined if sprint is not found', async () => {
      const foundSprint = await repository.findById(999999);

      expect(foundSprint).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a sprint', async () => {
      const [sprint] = await createSprints([sprintFactory()]);

      const updatedSprint = await repository.update(sprint.sprintId, {
        title: 'Updated Sprint Title',
      });

      expect(updatedSprint).toMatchObject(
        sprintMatcher({ title: 'Updated Sprint Title' })
      );
    });

    it('should return the original sprint if no changes are made', async () => {
      const [sprint] = await createSprints([sprintFactory()]);

      const updatedSprint = await repository.update(sprint.sprintId, {});

      expect(updatedSprint).toMatchObject(sprintMatcher());
    });

    it('should return undefined if sprint is not found', async () => {
      const updatedSprint = await repository.update(999, {
        title: 'Updated Sprint Title',
      });

      expect(updatedSprint).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a sprint', async () => {
      const [sprint] = await createSprints([sprintFactory()]);

      await repository.remove(sprint.sprintId);

      const sprints = await selectSprints();

      expect(sprints).toHaveLength(0);
    });

    it('should return undefined if sprint is not found', async () => {
      const removedSprint = await repository.remove(999);

      expect(removedSprint).toBeUndefined();
    });
  });

  describe('findBySprintCode', () => {
    it('should return a sprint by sprintCode', async () => {
      await createSprints([
        sprintFactory({ sprintCode: 'WD-1.1' }),
        sprintFactory({ sprintCode: 'WD-1.2' }),
      ]);

      const sprint = await repository.findBySprintCode('WD-1.1');

      expect(sprint[0]).toEqual(sprintMatcher({ sprintCode: 'WD-1.1' }));
    });
  });
});
