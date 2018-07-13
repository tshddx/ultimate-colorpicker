import chroma from "chroma-js";
import mapInterval from "../utils/mapInterval";
import forEach from "lodash/forEach";
import times from "lodash/times";
import mapValues from "lodash/mapValues";
import noop from "lodash/noop";
import some from "lodash/some";

const spaces = {
  lch: {
    name: "LCH",
    toPositionalArgs: ({ l, c, h }) => [l, c, h],
    fromPositionalArgs: ([l, c, h]) => ({ l, c, h }),
    axes: {
      l: {
        range: [0, 150],
        name: "lightness"
      },
      c: {
        range: [0, 150],
        name: "chroma"
      },
      h: {
        range: [0, 360],
        name: "hue"
      }
    },
    validator: chromaColor => {
      const [l, c, h] = chromaColor.lch();
      if (c < 0.00005) {
        // return true;
      }
    }
  },
  rgb: {
    name: "RGB",
    toPositionalArgs: ({ r, g, b }) => [r, g, b],
    fromPositionalArgs: ([r, g, b]) => ({ r, g, b }),
    axes: {
      r: {
        range: [0, 255],
        name: "red"
      },
      g: {
        range: [0, 255],
        name: "green"
      },
      b: {
        range: [0, 255],
        name: "blue"
      }
    },
    chromaConstructor: chroma
  },
  hsl: {
    name: "HSL",
    toPositionalArgs: ({ h, s, l }) => [h, s, l],
    fromPositionalArgs: ([h, s, l]) => ({ h, s, l }),
    axes: {
      h: {
        range: [0, 360],
        name: "hue"
      },
      s: {
        range: [0, 1],
        name: "saturation"
      },
      l: {
        range: [0, 1],
        name: "lightness"
      }
    }
  }
};

// Annotate each axis with its key.
forEach(spaces, space => {
  forEach(space.axes, (axis, key) => (axis.key = key));
});

const color = {};

forEach(spaces, (space, key) => {
  const {
    axes,
    toPositionalArgs,
    fromPositionalArgs,
    validator = noop,
    chromaConstructor = chroma[key]
  } = space;
  const spaceObj = {
    ...space,
    make(args) {
      const chromaColor = chromaConstructor(...toPositionalArgs(args));
      const color = {
        space: this,
        chromaColor,
        args,
        isValid() {
          const override = validator(chromaColor);
          if (override === true || override === false) {
            // return override;
          }

          if (chromaColor.clipped()) {
            return false;
          }

          // let valid = true;

          // some(this.space.args(this), (value, key) => {
          //   const difference = value - args[key];
          //   if (Math.abs(difference) > 10) {
          //     valid = false;
          //   }
          // });

          // return valid;

          const values = Object.values(this.space.args(this));
          return values.every(v => !isNaN(v));

          return true;
        }
      };
      return color;
    },
    args(color) {
      return fromPositionalArgs(color.chromaColor[key]());
    },
    replace(color, newArgs) {
      return this.make({ ...this.args(color), ...newArgs });
    }
  };

  spaceObj.axes = mapValues(axes, function(axis) {
    const scale = function(color, resolution) {
      const [start, end] = axis.range;
      const colors = times(resolution, function(i) {
        const color_ = spaceObj.replace(color, {
          [axis.key]: mapInterval(i, 0, resolution - 1, start, end)
        });
        return color_;
      });
      return colors;
    };
    return { ...axis, scale };
  });

  color[key] = spaceObj;
});

export default color;
