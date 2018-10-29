import intDiv, { intDivRaw } from "./";
import getSum from "lodash/sum";
import range from "lodash/range";

const toS = extras => {
  return extras.map(i => (i === 0 ? "_" : "-")).join("");
};

describe.only("intDiv", () => {
  // const total = 10;
  // const count = 3;
  // const parts = intDiv(total, count);
  // const sum = getSum(parts);

  // test("sum should equal total", () => {
  //   expect(sum).toEqual(total);
  // });

  // test("parts should be correct", () => {
  //   const expected = [3, 4, 3];
  //   expect(parts).toEqual(expected);
  // });

  const CASES = [
    [4, 0, `____`],
    [4, 1, `__-_`],
    [4, 2, `_--_`],
    [4, 3, `-_--`],

    [5, 0, `_____`],
    [5, 1, `__-__`],
    [5, 2, `_-_-_`],
    [5, 3, `-_-_-`],
    [5, 4, `--_--`],

    [9, 0, `_________`],
    [9, 1, `____-____`],
    [9, 2, `__-___-__`],
    [9, 3, `__-_-__-_`],
    [9, 4, `_-_-_-_-_`],
    [9, 5, `-_-_-_-_-`],
    [9, 6, `-_--_--_-`],
    [9, 7, `--_---_--`],
    [9, 8, `----_----`],
  ];

  describe("intDivRaw", () => {
    CASES.forEach(([count, extra, expected]) => {
      const label = `intDivRaw(${count}, ${extra})`;
      const extras = intDivRaw(count, extra);
      const string = toS(extras);

      test(`${label} parts should be correct`, () => {
        expect(string).toEqual(expected);
      });
    });
  });

  describe.skip("intDivRaw", () => {
    range(7, 8).forEach(count => {
      range(count, count * 2).forEach(total => {
        const label = `intDivRaw(${total}, ${count})`;
        const parts = intDivRaw(total, count);
        const sum = getSum(parts);

        test(`${label} sum should equal total`, () => {
          expect(sum).toEqual(total);
        });

        test(`${label} parts should be correct`, () => {
          const string = toS(parts);
          expect(`   ${string}   `).toMatchSnapshot();
        });

        // test("parts should be correct", () => {
        //   const expected = [3, 4, 3];
        //   expect(parts).toEqual(expected);
        // });
      });
    });
  });
});
