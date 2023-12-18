import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as schema from './schema';
import buildRepository from './repository';
import buildSprintsRepository from '../sprints/repository';
import buildUsersRepository from '../users/repository';
import buildTemplatesRepository from '../templats/repository';
import NotFound from '@/utils/errors/NotFound';
import { jsonRoute } from '@/utils/middleware';
import type { Database } from '@/database';
import { handleCompletion } from '../discord/messageHandler';
import BadRequest from '@/utils/errors/BadRequest';

export default (db: Database) => {
  const router = Router();
  const messages = buildRepository(db);
  const users = buildUsersRepository(db);
  const sprints = buildSprintsRepository(db);
  const templates = buildTemplatesRepository(db);

  router
    .route('/')
    .get(
      jsonRoute(async (req) => {
        const { discordId, sprintCode } = req.query;
        try {
          let messagesList;

          if (discordId) {
            const userResult = await users.findByDiscordId(discordId as string);
            messagesList = await messages.findByUserId(userResult[0].userId);
          } else if (sprintCode) {
            const sprintResult = await sprints.findBySprintCode(
              sprintCode as string
            );
            messagesList = await messages.findBySprintId(
              sprintResult[0].sprintId
            );
          } else {
            messagesList = await messages.findAll();
          }

          return messagesList;
        } catch (err) {
          throw new NotFound('User or Sprint not found');
        }
      })
    )

    .post(
      jsonRoute(async (req) => {
        const randomTemplate = await templates.findRandom();
        if (!randomTemplate) {
          throw new BadRequest('No template found');
        }

        const messageData = {
          ...schema.parseInsertable(req.body),
          templateId: randomTemplate.templateId,
          status: 'pending',
          timestamp: new Date().toISOString(),
        };

        const newMessage = await messages.create(messageData);
        if (!newMessage) {
          throw new Error('Failed to create message');
        }

        // promise.all([user, sprint])
        const user = await users.findById(newMessage.userId);
        const sprint = await sprints.findById(newMessage.sprintId);

        if (!user || !sprint) {
          throw new NotFound('User or Sprint not found');
        }

        await handleCompletion(
          user.discordId,
          sprint.sprintCode,
          randomTemplate.content
        );
        const updatedMessage = await messages.updateStatus(
          newMessage.messageId,
          'sent'
        );
        if (!updatedMessage) {
          throw new Error('Failed to update message');
        }

        return updatedMessage;
      }, StatusCodes.CREATED)
    );

  return router;
};
