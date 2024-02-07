// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 4, b: 2, action: Action.Divide, expected: 2 },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
  { a: 4, b: 2, action: '++', expected: null },
  { a: '4', b: 2, action: Action.Divide, expected: null },
];

describe('simpleCalculator', () => {
  describe.each(testCases)('$a $action $b', ({ a, b, action, expected }) => {
    test('some test', () => {
      expect(simpleCalculator({ a, b, action })).toEqual(expected);
    });
  });
});
