import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { templateFactory, templateMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createTemplates = createFor(db, 'templates');
const selectTemplates = selectAllFor(db, 'templates');

afterEach(async () => {
  await db.deleteFrom('templates').execute();
});

describe('Templates Repository', () => {
  describe('create', () => {
    it('should create a template', async () => {
      const template = await repository.create(templateFactory());

      expect(template).toEqual(templateMatcher());
      const templatesInDatabase = await selectTemplates();
      expect(templatesInDatabase).toContainEqual(template);
    });
  });

  describe('findAll', () => {
    it('should return all templates', async () => {
      await createTemplates([templateFactory(), templateFactory()]);

      const templates = await repository.findAll();
      expect(templates).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('should return a template by id', async () => {
      const [template] = await createTemplates(templateFactory());
      const foundTemplate = await repository.findById(template.templateId);

      expect(foundTemplate).toEqual(templateMatcher());
    });

    it('should return undefined if template is not found', async () => {
      const foundTemplate = await repository.findById(999999);
      expect(foundTemplate).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a template', async () => {
      const [template] = await createTemplates(templateFactory());
      const updatedTemplate = await repository.update(template.templateId, {
        content: 'Updated content',
      });

      expect(updatedTemplate).toEqual(
        templateMatcher({ content: 'Updated content' })
      );
    });
  });

  describe('remove', () => {
    it('should remove a template', async () => {
      const [template] = await createTemplates(templateFactory());
      await repository.remove(template.templateId);

      const templates = await selectTemplates();
      expect(templates).toHaveLength(0);
    });
  });

  describe('findRandom', () => {
    it('should return a random template', async () => {
      await createTemplates([templateFactory(), templateFactory()]);

      const randomTemplate = await repository.findRandom();
      expect(randomTemplate).toBeDefined();
    });
  });
});
