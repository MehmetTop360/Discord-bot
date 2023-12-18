import { parse, parseInsertable, parsePartial } from '../schema';
import { templateFactory } from './utils';

it('parses a valid template', () => {
  const template = templateFactory();
  expect(parse(template)).toEqual(template);
});

it('throws an error for invalid template', () => {
  const invalidTemplate = { ...templateFactory(), content: '' };
  expect(() => parse(invalidTemplate)).toThrow();
});

describe('parseInsertable', () => {
  it('omits templateId', () => {
    const template = templateFactory();
    const parsed = parseInsertable(template);
    expect(parsed).not.toHaveProperty('templateId');
  });
});

describe('parsePartial', () => {
  it('allows partial updates', () => {
    const partialTemplate = { content: 'New content' };
    const parsed = parsePartial(partialTemplate);
    expect(parsed).toEqual(partialTemplate);
  });

  it('throws an error for invalid partial data', () => {
    const partialTemplate = { content: '' };
    expect(() => parsePartial(partialTemplate)).toThrow();
  });
});
