import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import * as schema from './schema';
import { jsonRoute } from '@/utils/middleware';
import type { Database } from '@/database';
import NotFound from '@/utils/errors/NotFound';

export default (db: Database) => {
  const router = Router();
  const templates = buildRepository(db);

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);
        return templates.create(body);
      }, StatusCodes.CREATED)
    )

    .get(jsonRoute(async () => templates.findAll()));

  router
    .route('/:templateId')
    .get(
      jsonRoute(async (req, res) => {
        const templateId = parseInt(req.params.templateId, 10);
        if (Number.isNaN(templateId)) {
          throw new Error('Template ID must be a number.');
        }

        const template = await templates.findById(templateId);
        if (!template) {
          throw new NotFound('Template not found.');
        }

        return res.json(template);
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const templateId = parseInt(req.params.templateId, 10);
        if (Number.isNaN(templateId)) {
          throw new Error('Template ID must be a number.');
        }

        const partial = schema.parsePartial(req.body);
        return templates.update(templateId, partial);
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const templateId = parseInt(req.params.templateId, 10);
        if (Number.isNaN(templateId)) {
          throw new Error('Template ID must be a number.');
        }

        return templates.remove(templateId);
      }, StatusCodes.NO_CONTENT)
    );

  return router;
};
