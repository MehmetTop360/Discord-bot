# Discord Bot with a REST API

This project was developed for Turing College's Module 3, Sprint 2 at Turing College. This bot is intended to congratulate users that have completed a sprint with a random template message, and a gif. It is designed and implemented with a REST API that interacts with the database, organizing the data across the tables for users, sprints, templates, and messages.

## Technologies

- **Backend Framework**: Express.js
- **Database Query Builder**: Kysely
- **Validation Library**: zod
- **Testing Framework**: Vitest
- **Programming Language**: TypeScript
- **Linting and Formatting**: ESLint, Prettier

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed node.js and npm.
* You have a `.env` file in your project root with the following environment variables:

```env
DATABASE_URL= Your path to the database
DISCORD_BOT_ID= Your discord bot id
GIPHY_API_KEY= Your Giphy api key
DISCORD_CHANNEL_ID= Your discord channel id
```

## Discord BOT configuration

You have to enable the following inside the Bot page

* Presence Intent
* Server Members Intent
* Message Content Intent

While adding your bot to your server as well, for the url generator you have to also enable `Bot` inside `Scopes` and `Administrator` inside `Bot permissions`

## Migrations & Types

To apply the latest migrations:

```bash
npm run migrate:latest
```
To create a new migration:

```bash
npm run migrate:make [migration_name]
```
To update types

```bash
npm run gen:types
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Structure of the database

Messages
```
{
  messageId: Generated<number>;
  userId: number;
  sprintId: number;
  templateId: number;
  timestamp: string;
  status: string;
}
```
Sprints
```
{
  sprintId: Generated<number>;
  sprintCode: string;
  title: string;
}
```
Templates
```
{
  templateId: Generated<number>;
  content: string;
}
```
Users
```
{
  userId: Generated<number>;
  discordId: string;
}
```

## Using the Bot

Before creating a message you need users, templates, and sprints for it. When those are created, you can use them to post a message. To post a message you should provide the user id with a sprint id, you don't need to give template id it will be random. If you use the discord id of a user instead of their username, then the user will get tagged. Otherwise the user will look like they get tagged, but they won't be notified. The gif that will be inside the message is one of these topics: congratulations, celebration, and success.


### Examples

To add a user you have to use the url: http://localhost:3000/users and json body:

```
{
	"discordId": "Mehmet"
}
```

To add a sprint you have to use the url: http://localhost:3000/sprints and json body:
```
{
	"sprintCode": "WD-1-1"
    "title": "Python Beginners"
}
```

To add a templates you have to use the url: http://localhost:3000/templates and json body:
```
{
	"content": "Great job!"
}
```
To add a messages you have to use the url: http://localhost:3000/messages and json body:
```
{
    "userId": 1,
    "sprintId": 1
}
```