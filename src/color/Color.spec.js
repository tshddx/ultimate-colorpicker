import Color from "./Color";
import times from "lodash/times";
import chroma from "chroma-js";
import isNan from "lodash/isNaN";
import mapInterval from "../utils/mapInterval";

describe.skip("Color", () => {
  describe("renders correctly", () => {
    const lch = Color.lch;
    const baseColor = lch.make({
      l: 50,
      c: 24,
      h: 120,
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
  describe("lch", () => {
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
      it(`chroma=${c} is invalid in chroma-js`, () => {
        const input = [50, c, 130];
        const color = chroma.lch(...input);
        const output = color.lch().map(Math.round);
        expect(color.clipped()).toBeTruthy();
        // expect(output.some(isNan)).toBeTruthy();
      });
    });

    let n;

    n = 10;

    times(n, i => {
      const v = Math.round(mapInterval(i, 0, n - 1, 0, 100));
      it(`${v}`, () => {
        const input = [v, v, v];
        const color = chroma.lch(...input);
        const output = color.lch().map(Math.round);
        expect(output).toEqual(input);
        // expect(output.some(isNan)).toBeTruthy();
      });
    });

    n = 100;

    it(`scales should be equal`, () => {
      const scales = times(n, i => {
        const h = mapInterval(i, 0, n, 0, 360);
        const color = Color.lch.make({ l: 53, c: 30, h });
        const scale = Color.lch.axes.h.scale(color, n);
        return {
          hex: scale.map(c => c.chromaColor.hex()),
          clipped: scale.map(c => c.chromaColor.clipped()),
        };
      });
      expect(scales.length).toEqual(n);
      const firstScale = scales[0];
      // expect(firstScale).toEqual([]);
      scales.forEach(scale => {
        expect(scale).toEqual(firstScale);
      });
    });
  });
  describe("rgb", () => {
    it("stuff", () => {
      const rgb = Color.rgb;
      const color = rgb.make({ r: 50, g: 50, b: 50 });
      const args = rgb.args(color);
      const color2 = rgb.make(args);
      const args2 = rgb.args(color2);
      expect(args).toEqual(args2);
    });
    it("replace", () => {
      const rgb = Color.rgb;
      const input = { r: 50, g: 50, b: 50 };
      const color = rgb.make(input);
      const newArgs = { b: 100 };
      const color2 = rgb.replace(color, newArgs);
      const args = rgb.args(color2);
      expect(args).toEqual({ ...input, ...newArgs });
    });
  });
});
