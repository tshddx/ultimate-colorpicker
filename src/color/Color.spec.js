import Color from "./Color";
import times from "lodash/times";
import chroma from "chroma-js";
import isNan from "lodash/isNaN";

describe("Color", () => {
  describe("renders correctly", () => {
    const lch = Color.lch;
    const baseColor = lch.make({
      l: 50,
      c: 24,
      h: 120
    });
    const NUM = 135;
    let prevColor = lch.replace(baseColor, { l: NUM });
    times(10, i => {
      it(`works ${i}`, () => {
        const color = lch.replace(prevColor, { l: NUM });
        expect(lch.args(color)).toEqual(lch.args(prevColor));
        // expect([lch.args(color).l, i]).toEqual([NUM, i]);
        prevColor = color;
      });
    });
  });
  describe("renders correctly2", () => {
    const lch = Color.lch;
    const baseColor = lch.make({ l: 50, c: 40, h: 130 });
    const getNewColor = (col, i) => {
      const value = 105;
      const newArgs = { l: value + i };
      return col.space.replace(col, newArgs);
    };
    let prevColor = getNewColor(baseColor, -1);
    times(10, i => {
      it(`works ${i}`, () => {
        const color = getNewColor(prevColor, i);
        expect(lch.args(color).l).toEqual(color.args.l);
        // expect(lch.args(color)).toEqual(lch.args(prevColor));
        // expect([lch.args(color).l, i]).toEqual([NUM, i]);
        prevColor = color;
      });
    });
  });
  describe.only("lch", () => {
    it("chroma=0 is invalid", () => {
      const lch = Color.lch;
      const color = lch.make({ l: 50, c: 0, h: 130 });
      expect(color.isValid()).toBeFalsy();
    });

    it("lch values don't come out exact", () => {
      const lch = [50, 0, 130];
      const color = chroma.lch(...lch);
      expect(color.lch()).toEqual(lch);
    });

    times(5, i => {
      const c = 0.00001 * i;
      fit(`chroma=${c} is invalid in chroma-js`, () => {
        const input = [50, c, 130];
        const color = chroma.lch(...input);
        const output = color.lch();
        expect(color.clipped()).toBeTruthy();
        // expect(output.some(isNan)).toBeTruthy();
      });
    });
  });
});
