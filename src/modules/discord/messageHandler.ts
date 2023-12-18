/* eslint-disable no-console */
import axios from 'axios';
import { TextChannel } from 'discord.js';
import { client as discordClient } from './discordClient';

export async function fetchRandomGif() {
  try {
    const { GIPHY_API_KEY } = process.env;

    const tags = ['congratulations', 'celebration', 'success'];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    const response = await axios.get(
      `http://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=${randomTag}`
    );
    return response.data.data.images.original.url;
  } catch (error) {
    console.error('Error fetching GIF:', error);
    return null;
  }
}

export async function handleCompletion(
  discordUserId: string,
  sprintCode: string,
  templateMessage: string
) {
  const gifUrl = await fetchRandomGif();
  const userMention = discordUserId ? `<@${discordUserId}>` : '';
  const message = `${templateMessage} ${userMention} on completing ${sprintCode}`;

  const channelID = process.env.DISCORD_CHANNEL_ID;

  if (!channelID) {
    console.error(
      'DISCORD_CHANNEL_ID is not defined in the environment variables.'
    );
    return;
  }

  const channel = discordClient.channels.cache.get(channelID) as TextChannel;
  if (!channel) {
    console.error(`Channel with ID ${channelID} not found`);
    return;
  }

  await channel.send(message);
  await channel.send(gifUrl);
}
