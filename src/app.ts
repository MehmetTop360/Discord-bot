import express from 'express';
import messages from './modules/messages/controller';
import users from './modules/users/controller';
import sprints from './modules/sprints/controller';
import templates from './modules/templats/controller';
import jsonErrorHandler from './middleware/jsonErrors';
import { type Database } from './database';

export default function createApp(db: Database) {
  const app = express();

  app.use(express.json());
  app.use('/users', users(db));
  app.use('/sprints', sprints(db));
  app.use('/templates', templates(db));
  app.use('/messages', messages(db));
  app.use(jsonErrorHandler);

  return app;
}
