import chroma from "chroma-js";
import times from "lodash/times";
import mapValues from "lodash/mapValues";
import noop from "lodash/noop";
import lodashRound from "lodash/round";
import mapInterval from "../../utils/mapInterval";
import memoize from "lodash/memoize";

const USE_CACHE = true;
const COLOR_CACHE = {};
const SCALE_CACHE = {};

export const makeColorSpace = (key, space) => {
  const {
    axes,
    toPositionalArgs,
    fromPositionalArgs,
    validator = noop,
    chromaConstructor = chroma[key],
    chromaConverter = chromaColor => chromaColor[key](),
  } = space;

  const getCacheKey = positionalArgs => [key, ...positionalArgs].join(",");
  const spaceObj = {
    ...space,
    make(args) {
      const positionalArgs = toPositionalArgs(this.roundArgs(args));

      let cacheKey;
      if (USE_CACHE) {
        cacheKey = getCacheKey(positionalArgs);
        if (COLOR_CACHE[cacheKey]) {
          // console.log("cache hit", cacheKey);
          return COLOR_CACHE[cacheKey];
        }
      }

      const chromaColor = chromaConstructor(...positionalArgs);
      const color = {
        space: this,
        chromaColor,
        args,
        positionalArgs,
        isValid: memoize(function() {
          const override = validator(chromaColor);
          if (override === true || override === false) {
            // console.log("override", override, chromaColor);
            // return override;
          }

          if (chromaColor.clipped()) {
            return false;
          }

          return true;
        }),
      };
      if (USE_CACHE) {
        COLOR_CACHE[cacheKey] = color;
      }
      return color;
    },
    args(color) {
      if (color.space === this) {
        return color.args;
      } else {
        const positionalArgs = chromaConverter(color.chromaColor);
        const args = fromPositionalArgs(positionalArgs);
        return this.roundArgs(args);
      }
    },
    roundArgs(args) {
      return mapValues(args, (val, key) => {
        const axis = this.axes[key];
        if (axis) {
          return axis.round(val);
        } else {
          console.log("no axis", Object.keys(this.axes), key);
          throw new Error(
            "no axis " + JSON.stringify(Object.keys(this.axes)) + " " + key
          );
        }
      });
    },
    mult(color, multArgs) {
      const args = this.args(color);
      const newArgs = mapValues(multArgs, (val, key) => {
        if (val < 0) {
          const max = this.axes[key].max;
          const diff = max - args[key];
          return args[key] + diff * -val;
        } else {
          return args[key] * val;
        }
      });
      return this.replace(color, newArgs);
    },
    replace(color, newArgs) {
      return this.make({ ...this.args(color), ...newArgs });
    },
  };

  spaceObj.axes = mapValues(axes, function(axis, axisKey) {
    const [min, max] = axis.range;
    const size = max - min;
    const orderOfMagnitude = Math.floor(Math.log10(size));

    // `precision` is the number of digits after the decimal point to round to.
    // The `2 - orderOfMagnitude` thing means that we will split the axis into
    // approximately 100 (10^2) steps.
    // For a 0-255 axis, `precision` will be 0 (we'll round to integer);
    // For a 0.0-1.0 axis, `precision` will be 2;
    // For a 0-1000 axis, `precision` will be -1, (round to tens);
    const precision = 2 - orderOfMagnitude;

    // `step` is the size of each step (i.e. the range input in <ColorAxis />).
    // For a 0-255 axis, `step` will be 1;
    // For a 0.0-1.0 axis, `step` will be 0.01;
    const step = Math.pow(10, -precision);

    // `steps` is the number of possible values.
    // An alternate definition is:
    //   const resolution = Math.pow(10, precision) * size;
    const steps = (1 / step) * size;

    const round = x => lodashRound(x, precision);

    const getCacheKey = (color, resolution) => {
      const args = { ...color.args };
      delete args[axis.key];
      return [key, axis.key, resolution, ...Object.values(args)].join(",");
    };

    const scale = function(color, resolution) {
      let cacheKey;
      if (USE_CACHE) {
        cacheKey = getCacheKey(color, resolution);
        if (SCALE_CACHE[cacheKey]) {
          return SCALE_CACHE[cacheKey];
        }
      }

      const colors = times(resolution, function(i) {
        const color_ = spaceObj.replace(color, {
          [axis.key]: mapInterval(i, 0, resolution - 1, min, max),
        });
        return color_;
      });
      if (USE_CACHE) {
        SCALE_CACHE[cacheKey] = colors;
      }
      return colors;
    };

    const graphWith = function(
      yAxis,
      rowCount = Math.round(yAxis.steps),
      colCount = Math.round(steps)
    ) {
      return function(color) {
        // const rowCount = Math.round(yAxis.steps * downsample);
        // const colCount = Math.round(steps * downsample);
        const rows = yAxis.scale(color, rowCount);

        // `graph` is a 2-d array (an array of rows, where each row is an
        // array of colors).
        const graph = rows.map(rowColor => scale(rowColor, colCount));

        graph.neighbors = ([rowIndex, colIndex]) => {
          const offsets = [
            // Keep this formatting.
            [-1, 0], // up
            [0, 1], // right
            [1, 0], // down
            [0, -1], // left
            // Diagonals:
            [-1, -1], // NW
            [-1, 1], // NE
            [1, 1], // SE
            [1, -1], // SW
          ];
          const neighbs = [];
          offsets.forEach(([i, j]) => {
            const r = rowIndex + i;
            const c = colIndex + j;
            if (r >= 0 && c >= 0 && r < rowCount && c < colCount) {
              neighbs.push(graph[r][c]);
            }
          });
          return neighbs;
        };
        graph.neighbors = memoize(graph.neighbors);

        graph.isOnValidityBorder = ([rowIndex, colIndex]) => {
          const color = graph[rowIndex][colIndex];
          return graph
            .neighbors([rowIndex, colIndex])
            .some(neighborColor => color.isValid() !== neighborColor.isValid());
        };
        graph.isOnValidityBorder = memoize(graph.isOnValidityBorder);

        return graph;
      };
    };

    return {
      ...axis,
      // TODO: this seems to not work, and the annotate loop in Color.js is
      // still necessary for some reason.
      key: axisKey,
      min,
      max,
      size,
      orderOfMagnitude,
      precision,
      step,
      steps,
      round,
      scale,
      graphWith,
    };
  });

  return spaceObj;
};
