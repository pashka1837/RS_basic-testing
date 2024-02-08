import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const linkedList = {
    value: 1,
    next: {
      value: 2,
      next: {
        value: 3,
        next: {
          value: 4,
          next: {
            value: null,
            next: null,
          },
        },
      },
    },
  };

  test('should generate linked list from values 1', () => {
    const elements_from_1 = [1, 2, 3, 4];
    expect(generateLinkedList(elements_from_1)).toStrictEqual(linkedList);
  });

  test('should generate linked list from values 2', () => {
    const elements_from_2 = [2, 3, 4, 5];
    expect(generateLinkedList(elements_from_2)).toMatchSnapshot();
  });
});
