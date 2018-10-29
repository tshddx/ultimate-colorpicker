import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ColorGraphCanvas.css";
import times from "lodash/times";
import reverse from "lodash/reverse";
import chroma from "chroma-js";
import Color from "../../color/Color";
import {
  compose,
  withHandlers,
  withState,
  lifecycle,
  shouldUpdate,
  shallowEqual,
} from "recompose";
import { observer } from "mobx-react";

const bem = makeBem("ColorGraphCanvas");

const ColorGraphCanvas = ({
  color,
  xAxis,
  yAxis,
  // downsample,
  // fullRes,
  canvas,
  canvasRef,
  width,
  height,
  settings,
}) => {
  if (canvas) {
    let rowCount = settings.fullRes ? width : yAxis.steps * settings.downsample;
    let colCount = settings.fullRes
      ? height
      : xAxis.steps * settings.downsample;

    rowCount = 3;
    colCount = 3;
    const rowHeight = Math.round(height / rowCount);
    const colWidth = Math.round(width / colCount);

    // const ctx = canvas.getContext("2d");

    var offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    const ctx = offscreenCanvas.getContext("2d");

    ctx.imageSmoothingEnabled = true;

    const graph = xAxis.graphWith(yAxis, rowCount, colCount)(color);
    const graphReversed = [...graph].reverse();

    graphReversed.forEach((row, rowIndex) => {
      row.forEach((colColor, colIndex) => {
        const isValid = colColor.isValid();
        const isOnValidityBorder =
          false && graph.isOnValidityBorder([rowIndex, colIndex]);
        if (isOnValidityBorder) {
          if (isValid) {
            ctx.fillStyle = colColor.chromaColor.hex();
            // ctx.fillStyle = Color.lch
            //   .mult(colColor, { l: -0.25, c: 0.5 })
            //   .chromaColor.hex();
          } else {
            ctx.fillStyle = Color.lch
              .mult(colColor, { l: -0.5 })
              .chromaColor.hex();
            // ctx.fillStyle = "white";
            // ctx.fillStyle = "red";
          }
        } else {
          ctx.fillStyle = colColor.chromaColor.hex();
        }
        const args = [
          colIndex * colWidth,
          rowIndex * rowHeight,
          // 1,
          // 1,
          colWidth,
          rowHeight,
        ];
        if (isValid || isOnValidityBorder) {
          ctx.fillRect(...args);
        } else {
          // ctx.clearRect(...args);
        }
      });
    });

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);
    context.drawImage(offscreenCanvas, 0, 0);
  }

  return (
    <canvas className={bem()} ref={canvasRef} width={width} height={height} />
  );
};

ColorGraphCanvas.propTypes = {
  color: PropTypes.any.isRequired,
  space: PropTypes.object.isRequired,
  axis: PropTypes.object.isRequired,
  resolution: PropTypes.number,
  downsample: PropTypes.number,
  fullRes: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  canvas: PropTypes.any,
  canvasRef: PropTypes.func.isRequired,
};

ColorGraphCanvas.defaultProps = {
  resolution: 50,
  fullRes: false,
  downsample: 0.25,
  width: 100,
  height: 100,
};

export default ColorGraphCanvas;

export const ColorGraphCanvasStateful = compose(
  // shouldUpdate(({ color: prevColor }, { color: nextColor, space, axis }) => {
  //   const value = nextColor.args[axis.key];
  //   const newArgs = { [axis.key]: value };
  //   const prevNormalized = space.replace(prevColor, newArgs);
  //   const nextNormalized = space.replace(nextColor, newArgs);
  //   if (shallowEqual(prevNormalized.args, nextNormalized.args)) {
  //     console.log("shallow equal", axis.key);
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }),
  withState("canvas", "setCanvas", null),
  withHandlers(() => {
    // This uses the recompose withHandlers closure to
    // store the input (rather than in the component
    // state or instance).
    let canvas_ = null;

    return {
      canvasRef: () => ref => {
        canvas_ = ref;
      },
      getCanvas: () => () => canvas_,
    };
  }),
  lifecycle({
    componentDidMount() {
      const { getCanvas } = this.props;
      if (getCanvas()) {
        const { setCanvas } = this.props;
        setCanvas(getCanvas());
      }
    },
  }),
  observer
)(ColorGraphCanvas);
