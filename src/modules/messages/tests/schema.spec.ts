import { parse, parseInsertable } from '../schema';
import { messageFactory } from './utils';

describe('Messages Schema', () => {
  it('parses a valid message', () => {
    const validMessage = messageFactory();
    expect(parse(validMessage)).toEqual(validMessage);
  });

  describe('parseInsertable', () => {
    it('omits messageId', () => {
      const message = messageFactory({ messageId: 1 });
      const parsed = parseInsertable(message);
      expect(parsed).not.toHaveProperty('messageId');
    });
  });
});
