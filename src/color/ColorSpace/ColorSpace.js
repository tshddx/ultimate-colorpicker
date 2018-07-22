import chroma from "chroma-js";
import times from "lodash/times";
import mapValues from "lodash/mapValues";
import noop from "lodash/noop";
import lodashRound from "lodash/round";
import mapInterval from "../../utils/mapInterval";
import memoize from "lodash/memoize";
import size from "lodash/size";

const USE_CACHE = false;

const makeCache = (getKey, makeObj) => {
  const store = {};
  const stats = { hits: 0, misses: 0 };

  const cacheObj = {
    store,
    stats,
    get(...id) {
      const key = getKey(...id);
      if (store[key]) {
        stats.hits += 1;
        return store[key];
      } else {
        stats.misses += 1;
        const obj = makeObj(...id);
        store[key] = obj;
        return obj;
      }
    },
  };
  return cacheObj;
};

const COLOR_CACHE = makeCache(
  (space, args) => [space.key, ...Object.values(args)].join(","),
  (space, args) => space._make(args)
);

const SCALE_CACHE = makeCache(
  (axis, color, resolution) => {
    const args = { ...color.args };
    delete args[axis.key];
    return [axis.space.key, axis.key, resolution, ...Object.values(args)].join(
      ","
    );
  },
  (axis, color, resolution) => axis._scale(color, resolution)
);

export const makeColorSpace = (key, space) => {
  const {
    validator = noop,
    chromaConstructor = chroma[key],
    chromaConverter = chromaColor => chromaColor[key](),
  } = space;

  const spaceObj = {
    ...space,
    validator,
    chromaConstructor,
    chromaConverter,
    make(args) {
      return COLOR_CACHE.get(this, args);
    },
    _make(args) {
      const positionalArgs = this.toPositionalArgs(this.roundArgs(args));
      const chromaColor = this.chromaConstructor(...positionalArgs);
      const that = this;

      const color = {
        space: that,
        chromaColor,
        args,
        positionalArgs,
        isValid: memoize(function() {
          const override = that.validator(chromaColor);
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

      return color;
    },
    args(color) {
      if (color.space === this) {
        return color.args;
      } else {
        const positionalArgs = this.chromaConverter(color.chromaColor);
        const args = this.fromPositionalArgs(positionalArgs);
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

  spaceObj.axes = mapValues(spaceObj.axes, function(axis, axisKey) {
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

    // const graphWithMemoized = memoize(graphWith, (...args) => args);

    return {
      ...axis,
      // TODO: this seems to not work, and the annotate loop in Color.js is
      // still necessary for some reason.
      key: axisKey,
      space: spaceObj,
      min,
      max,
      size,
      orderOfMagnitude,
      precision,
      step,
      steps,
      round,
      _scale(color, resolution) {
        const that = this;
        const colors = times(resolution, function(i) {
          const color_ = that.space.replace(color, {
            [axis.key]: mapInterval(i, 0, resolution - 1, that.min, that.max),
          });
          return color_;
        });
        return colors;
      },
      scale(color, resolution) {
        return SCALE_CACHE.get(this, color, resolution);
      },
      graphWith(
        yAxis,
        rowCount = Math.round(yAxis.steps),
        colCount = Math.round(steps)
      ) {
        const that = this;
        return function(color) {
          // const rowCount = Math.round(yAxis.steps * downsample);
          // const colCount = Math.round(steps * downsample);
          const rows = yAxis.scale(color, rowCount);

          // `graph` is a 2-d array (an array of rows, where each row is an
          // array of colors).
          const graph = rows.map(rowColor => that.scale(rowColor, colCount));

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
              .some(
                neighborColor => color.isValid() !== neighborColor.isValid()
              );
          };
          graph.isOnValidityBorder = memoize(graph.isOnValidityBorder);

          return graph;
        };
      },
      // graphWith: memoize(this._graphWith, (...args) => args),
    };
  });

  return spaceObj;
};
