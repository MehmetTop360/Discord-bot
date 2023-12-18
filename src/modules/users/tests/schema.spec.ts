import { parse, parseInsertable, parsePartial } from '../schema';
import { userFactoryFull } from './utils';

describe('User Schema', () => {
  it('parses a valid user record', () => {
    const record = userFactoryFull();
    expect(parse(record)).toEqual(record);
  });

  describe('parseInsertable', () => {
    it('omits userId', () => {
      const parsed = parseInsertable(userFactoryFull());
      expect(parsed).not.toHaveProperty('userId');
    });
  });

  describe('parsePartial', () => {
    it('allows partial updates', () => {
      const partial = { discordId: 'newId' };
      const parsed = parsePartial(partial);
      expect(parsed).toEqual(partial);
    });
  });
});
