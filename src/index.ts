/* eslint-disable no-console */
import 'dotenv/config';
import createApp from './app';
import createDatabase from './database';
import { client as discordClient } from './modules/discord/discordClient';

const { DATABASE_URL } = process.env;
const { DISCORD_BOT_TOKEN } = process.env;
const PORT = 3000;

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}

if (!DISCORD_BOT_TOKEN) {
  throw new Error('The DISCORD_BOT_ID environment variable is not set.');
} else {
  discordClient.login(DISCORD_BOT_TOKEN).catch(console.error);
}

const database = createDatabase(DATABASE_URL);
const app = createApp(database);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
