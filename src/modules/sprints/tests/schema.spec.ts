import { parse, parseInsertable, parsePartial } from '../schema';
import { sprintFactory } from './utils';

describe('Sprints Schema', () => {
  it('parses a valid sprint', () => {
    const validSprint = sprintFactory();
    expect(parse(validSprint)).toEqual(validSprint);
  });

  describe('parseInsertable', () => {
    it('omits sprintId', () => {
      const sprint = sprintFactory({ sprintId: 1 });
      const parsed = parseInsertable(sprint);
      expect(parsed).not.toHaveProperty('sprintId');
    });
  });

  describe('parsePartial', () => {
    it('allows partial updates', () => {
      const sprintPartial = { title: 'Updated Sprint' };
      const parsed = parsePartial(sprintPartial);
      expect(parsed).toEqual(sprintPartial);
    });
  });
});
