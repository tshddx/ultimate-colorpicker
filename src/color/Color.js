import chroma from "chroma-js";
import forEach from "lodash/forEach";
import { makeColorSpace } from "./ColorSpace/ColorSpace";

const spaces = {
  rgb: {
    name: "RGB",
    toPositionalArgs: ({ r, g, b }) => [r, g, b],
    fromPositionalArgs: ([r, g, b]) => ({ r, g, b }),
    axes: {
      r: {
        range: [0, 255],
        name: "Red",
      },
      g: {
        range: [0, 255],
        name: "Green",
      },
      b: {
        range: [0, 255],
        name: "Blue",
      },
    },
    chromaConstructor: chroma,
    chromaConverter: chromaColor => chromaColor.rgb(false),
  },
  lch: {
    name: "LCH",
    toPositionalArgs: ({ l, c, h }) => [l, c, h],
    fromPositionalArgs: ([l, c, h]) => ({ l, c, h }),
    axes: {
      l: {
        range: [0, 100],
        name: "Lightness",
        resolutionBoost: 3,
      },
      c: {
        range: [0, 100],
        name: "Chroma",
      },
      h: {
        range: [0, 360],
        name: "Hue",
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
  lab: {
    name: "Lab",
    toPositionalArgs: ({ l, a, b }) => [l, a, b],
    fromPositionalArgs: ([l, a, b]) => ({ l, a, b }),
    axes: {
      l: {
        range: [0, 100],
        name: "Lightness",
        resolutionBoost: 3,
      },
      a: {
        range: [0, 100],
        name: "A (green <> red)",
      },
      b: {
        range: [0, 100],
        name: "B (blue <> yellow)",
      },
    },
  },
  hsl: {
    name: "HSL",
    toPositionalArgs: ({ h, s, l }) => [h, s, l],
    fromPositionalArgs: ([h, s, l]) => ({ h, s, l }),
    axes: {
      h: {
        range: [0, 360],
        name: "Hue",
      },
      s: {
        range: [0, 1],
        name: "Saturation",
      },
      l: {
        range: [0, 1],
        name: "Lightness",
        resolutionBoost: 3,
      },
    },
  },
  cmyk: {
    name: "CMYK",
    toPositionalArgs: ({ c, m, y, k }) => [c, m, y, k],
    fromPositionalArgs: ([c, m, y, k]) => ({ c, m, y, k }),
    axes: {
      c: {
        range: [0, 1],
        name: "Cyan",
      },
      m: {
        range: [0, 1],
        name: "Magenta",
      },
      y: {
        range: [0, 1],
        name: "Yellow",
      },
      k: {
        range: [0, 1],
        name: "Black (K)",
        resolutionBoost: 3,
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
