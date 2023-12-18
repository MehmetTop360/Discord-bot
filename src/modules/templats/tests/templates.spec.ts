import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { Insertable } from 'kysely';
import createApp from '@/app';
import { Templates } from '@/database';

const db = await createTestDatabase();
const app = createApp(db);

afterEach(async () => {
  await db.deleteFrom('templates').execute();
});

const templateFactory = (
  overrides: Partial<Insertable<Templates>> = {}
): Insertable<Templates> => ({
  content: 'Example template content',
  ...overrides,
});

describe('Templates API', () => {
  describe('POST /templates', () => {
    it('allows creating a new template', async () => {
      const newTemplate = templateFactory();
      const { body } = await supertest(app)
        .post('/templates')
        .send(newTemplate)
        .expect(201);

      expect(body).toEqual(expect.objectContaining(newTemplate));
    });
  });

  describe('PATCH /templates/:templateId', () => {
    it('allows updating a template', async () => {
      const newTemplate = templateFactory();
      const { body: createdTemplate } = await supertest(app)
        .post('/templates')
        .send(newTemplate)
        .expect(201);

      const updatedContent = 'Updated template content';
      const { body: updatedTemplate } = await supertest(app)
        .patch(`/templates/${createdTemplate.templateId}`)
        .send({ content: updatedContent })
        .expect(200);

      expect(updatedTemplate).toEqual(
        expect.objectContaining({
          content: updatedContent,
        })
      );
    });
  });

  describe('DELETE /templates/:templateId', () => {
    it('allows deleting a template', async () => {
      const newTemplate = templateFactory();
      const createResponse = await supertest(app)
        .post('/templates')
        .send(newTemplate)
        .expect(201);

      const createdTemplate = createResponse.body;

      const deleteResponse = await supertest(app).delete(
        `/templates/${createdTemplate.templateId}`
      );
      expect(deleteResponse.status).toBe(204);

      const getResponse = await supertest(app).get(
        `/templates/${createdTemplate.templateId}`
      );
      expect(getResponse.status).toBe(404);
    });
  });

  describe('GET /templates', () => {
    it('retrieves all templates', async () => {
      const template1 = templateFactory({ content: 'Template 1 content' });
      const template2 = templateFactory({ content: 'Template 2 content' });
      await supertest(app).post('/templates').send(template1).expect(201);
      await supertest(app).post('/templates').send(template2).expect(201);

      const { body: templates } = await supertest(app)
        .get('/templates')
        .expect(200);

      expect(templates).toEqual(
        expect.arrayContaining([
          expect.objectContaining(template1),
          expect.objectContaining(template2),
        ])
      );
    });

    it('retrieves a single template by templateId', async () => {
      const newTemplate = templateFactory();
      const { body: createdTemplate } = await supertest(app)
        .post('/templates')
        .send(newTemplate)
        .expect(201);

      const { body: fetchedTemplate } = await supertest(app)
        .get(`/templates/${createdTemplate.templateId}`)
        .expect(200);

      expect(fetchedTemplate).toEqual(expect.objectContaining(newTemplate));
    });

    it('try to retrieve all templates, when there are none', async () => {
      const { body: templates } = await supertest(app)
        .get('/templates')
        .expect(200);

      expect(templates).toEqual([]);
    });
  });
});
