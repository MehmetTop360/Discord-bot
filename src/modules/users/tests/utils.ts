export const userFactory = (overrides = {}) => ({
  discordId: 'defaultDiscordId',
  ...overrides,
});

export const userFactoryFull = () => ({
  userId: 1,
  discordId: 'defaultDiscordId',
});

export const userMatcher = (expected = {}) => ({
  userId: expect.any(Number),
  discordId: expect.any(String),
  ...expected,
});
