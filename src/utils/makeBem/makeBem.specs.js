import makeBem from './makeBem';

describe('makeBem', () => {
  const bem = makeBem('Block');

  test('block only', () => {
    expect(bem()).toEqual('Block');
  });

  test('block and single element', () => {
    expect(bem('element')).toEqual('Block__element');
  });

  test('block, single element, and single modifier', () => {
    expect(bem('element', 'modifier')).toEqual(
      'Block__element Block__element--modifier'
    );
  });

  test('block, single element, and multiple modifiers', () => {
    expect(bem('element', ['mod1', 'mod2'])).toEqual(
      'Block__element Block__element--mod1 Block__element--mod2'
    );
  });

  test('block and multiple elements', () => {
    expect(bem(['ele1', 'ele2'])).toEqual('Block__ele1__ele2');
  });

  test('block, multiple elements, and single modifier', () => {
    expect(bem(['ele1', 'ele2'], 'modifier')).toEqual(
      'Block__ele1__ele2 Block__ele1__ele2--modifier'
    );
  });

  test('block, multiple elements, and multiple modifiers', () => {
    expect(bem(['ele1', 'ele2'], ['mod1', 'mod2'])).toEqual(
      'Block__ele1__ele2 Block__ele1__ele2--mod1 Block__ele1__ele2--mod2'
    );
  });
});
