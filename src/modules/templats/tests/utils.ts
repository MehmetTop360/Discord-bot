export function templateFactory(overrides = {}) {
  return {
    templateId: Math.floor(Math.random() * 1000),
    content: 'Sample template content',
    ...overrides,
  };
}

export function templateMatcher(overrides = {}) {
  return expect.objectContaining({
    templateId: expect.any(Number),
    content: expect.any(String),
    ...overrides,
  });
}
