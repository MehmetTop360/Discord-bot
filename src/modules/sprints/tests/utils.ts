export function sprintFactory(overrides = {}) {
  return {
    sprintCode: 'WD-1.1',
    title: 'Web Development Sprint',
    ...overrides,
  };
}

export function sprintMatcher(overrides = {}) {
  return expect.objectContaining({
    sprintId: expect.any(Number),
    sprintCode: expect.any(String),
    title: expect.any(String),
    ...overrides,
  });
}
