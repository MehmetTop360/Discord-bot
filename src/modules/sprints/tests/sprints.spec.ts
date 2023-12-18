import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { Insertable } from 'kysely';
import createApp from '@/app';
import { Sprints } from '@/database';

const db = await createTestDatabase();
const app = createApp(db);

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});

afterAll(async () => {
  await db.destroy();
});

const sprintFactory = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  sprintCode: 'exampleSprintCode123',
  title: 'Example Sprint',
  ...overrides,
});

describe('Sprints API', () => {
  describe('POST /sprints', () => {
    it('allows creating a new sprint', async () => {
      const newSprint = sprintFactory();
      const { body } = await supertest(app)
        .post('/sprints')
        .send(newSprint)
        .expect(201);

      expect(body).toEqual(expect.objectContaining(newSprint));
    });
  });

  describe('PATCH /sprints/:sprintId', () => {
    it('allows updating a sprint', async () => {
      const newSprint = sprintFactory();
      const { body: createdSprint } = await supertest(app)
        .post('/sprints')
        .send(newSprint)
        .expect(201);

      const updatedTitle = 'Updated Sprint Title';
      const { body: updatedSprint } = await supertest(app)
        .patch(`/sprints/${createdSprint.sprintId}`)
        .send({ title: updatedTitle })
        .expect(200);

      expect(updatedSprint).toEqual(
        expect.objectContaining({
          title: updatedTitle,
        })
      );
    });
  });

  describe('DELETE /sprints/:sprintId', () => {
    it('allows deleting a sprint', async () => {
      const newSprint = sprintFactory();
      const createResponse = await supertest(app)
        .post('/sprints')
        .send(newSprint)
        .expect(201);

      const createdSprint = createResponse.body;

      const deleteResponse = await supertest(app).delete(
        `/sprints/${createdSprint.sprintId}`
      );
      expect(deleteResponse.status).toBe(204);

      const getResponse = await supertest(app).get(
        `/sprints/${createdSprint.sprintId}`
      );
      expect(getResponse.status).toBe(404);
    });
  });

  describe('GET /sprints', () => {
    it('retrieves all sprints', async () => {
      const sprint1 = sprintFactory({ sprintCode: 'sprintCode1' });
      const sprint2 = sprintFactory({ sprintCode: 'sprintCode2' });
      await supertest(app).post('/sprints').send(sprint1).expect(201);
      await supertest(app).post('/sprints').send(sprint2).expect(201);

      const { body: sprints } = await supertest(app)
        .get('/sprints')
        .expect(200);

      expect(sprints).toEqual(
        expect.arrayContaining([
          expect.objectContaining(sprint1),
          expect.objectContaining(sprint2),
        ])
      );
    });

    it('retrieves a single sprint by sprintId', async () => {
      const newSprint = sprintFactory();
      const { body: createdSprint } = await supertest(app)
        .post('/sprints')
        .send(newSprint)
        .expect(201);

      const { body: fetchedSprint } = await supertest(app)
        .get(`/sprints/${createdSprint.sprintId}`)
        .expect(200);

      expect(fetchedSprint).toEqual(expect.objectContaining(newSprint));
    });

    it('try to retrieve all sprints, when there are none', async () => {
      await supertest(app).get('/sprints').expect(404);
    });
  });
});
