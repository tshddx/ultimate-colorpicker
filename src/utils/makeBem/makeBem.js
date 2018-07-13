import { curry, reduce, uniq, flow as pipe, map } from 'lodash/fp';

const join = curry((x, y) => y.join(x));

export const makeBem = block => {
  return (element, modifier) => {
    if (modifier) {
      const modifiers = [].concat(modifier);
      return pipe(
        map(m => bemString(block, element, m)),
        reduce((x, y) => [].concat(x, y), []),
        uniq,
        join(' ')
      )(modifiers);
    } else {
      return bemString(block, element);
    }
  };
};

const bemString = (block, element, mod) => {
  const ee = [].concat(element).join('__');
  const e = ee ? `__${ee}` : '';
  const m = mod ? `--${mod}` : '';
  return mod ? [`${block}${e}`, `${block}${e}${m}`] : `${block}${e}`;
};

export default makeBem;
