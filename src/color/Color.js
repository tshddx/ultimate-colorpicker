import chroma from "chroma-js";
import forEach from "lodash/forEach";
import { makeColorSpace } from "./ColorSpace/ColorSpace";

const spaces = {
  lch: {
    name: "LCH",
    toPositionalArgs: ({ l, c, h }) => [l, c, h],
    fromPositionalArgs: ([l, c, h]) => ({ l, c, h }),
    axes: {
      l: {
        range: [0, 150],
        name: "luminance",
      },
      c: {
        range: [0, 150],
        name: "chroma",
      },
      h: {
        range: [0, 360],
        name: "hue",
      },
    },
    validator: chromaColor => {
      // const [l, c, h] = chromaColor.lch();
      // if (isNaN(h)) {
      //   return false;
      // }
      // if (c < 0.00005) {
      //   return true;
      // }
    },
  },
  rgb: {
    name: "RGB",
    toPositionalArgs: ({ r, g, b }) => [r, g, b],
    fromPositionalArgs: ([r, g, b]) => ({ r, g, b }),
    axes: {
      r: {
        range: [0, 255],
        name: "red",
      },
      g: {
        range: [0, 255],
        name: "green",
      },
      b: {
        range: [0, 255],
        name: "blue",
      },
    },
    chromaConstructor: chroma,
    chromaConverter: chromaColor => chromaColor.rgb(false),
  },
  hsl: {
    name: "HSL",
    toPositionalArgs: ({ h, s, l }) => [h, s, l],
    fromPositionalArgs: ([h, s, l]) => ({ h, s, l }),
    axes: {
      h: {
        range: [0, 360],
        name: "hue",
      },
      s: {
        range: [0, 1],
        name: "saturation",
      },
      l: {
        range: [0, 1],
        name: "lightness",
      },
    },
  },
};

// Annotate each axis with its key.
forEach(spaces, space => {
  forEach(space.axes, (axis, key) => (axis.key = key));
});

const colorObj = { colorCache: {}, scaleCache: {} };

forEach(spaces, (space, key) => {
  colorObj[key] = makeColorSpace(key, space);
});

export default colorObj;
