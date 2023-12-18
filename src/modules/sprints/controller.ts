import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import * as schema from './schema';
import { jsonRoute } from '@/utils/middleware';
import type { Database } from '@/database';
import NotFound from '@/utils/errors/NotFound';

export default (db: Database) => {
  const router = Router();
  const sprints = buildRepository(db);

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);
        return sprints.create(body);
      }, StatusCodes.CREATED)
    )
    .get(
      jsonRoute(async () => {
        const allSprints = await sprints.findAll();
        if (allSprints.length === 0) {
          throw new NotFound('No sprint found.');
        }

        return allSprints;
      })
    );

  router
    .route('/:sprintId')
    .get(
      jsonRoute(async (req, res) => {
        const sprintId = parseInt(req.params.sprintId, 10);
        if (Number.isNaN(sprintId)) {
          throw new Error('Sprint ID must be a number.');
        }

        const sprint = await sprints.findById(sprintId);
        if (!sprint) {
          throw new NotFound('Sprint not found.');
        }

        return res.json(sprint);
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const sprintId = parseInt(req.params.sprintId, 10);
        if (Number.isNaN(sprintId)) {
          throw new Error('Sprint ID must be a number.');
        }

        const partial = schema.parsePartial(req.body);
        return sprints.update(sprintId, partial);
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const sprintId = parseInt(req.params.sprintId, 10);
        if (Number.isNaN(sprintId)) {
          throw new Error('Sprint ID must be a number.');
        }

        return sprints.remove(sprintId);
      }, StatusCodes.NO_CONTENT)
    );

  return router;
};
