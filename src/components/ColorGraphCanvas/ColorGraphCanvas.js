import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ColorGraphCanvas.css";
import times from "lodash/times";
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

const bem = makeBem("ColorGraphCanvas");

const ColorGraphCanvas = ({
  color,
  xAxis,
  yAxis,
  downsample,
  fullRes,
  canvas,
  canvasRef,
  width,
  height,
}) => {
  if (canvas) {
    const rowCount = fullRes ? width : yAxis.steps * downsample;
    const colCount = fullRes ? height : xAxis.steps * downsample;
    const rowHeight = height / rowCount;
    const colWidth = width / colCount;

    const ctx = canvas.getContext("2d");
    // ctx.imageSmoothingEnabled = true;

    const graph = xAxis.graphWith(yAxis, rowCount, colCount)(color);

    graph.forEach((row, rowIndex) => {
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
              .mult(colColor, { l: -0.75 })
              .chromaColor.hex();
            // ctx.fillStyle = "white";
            ctx.fillStyle = "red";
          }
        } else {
          ctx.fillStyle = colColor.chromaColor.hex();
        }
        if (isValid || isOnValidityBorder) {
          ctx.fillRect(
            colIndex * colWidth,
            rowIndex * rowHeight,
            colWidth,
            rowHeight
          );
        } else {
          ctx.clearRect(
            colIndex * colWidth,
            rowIndex * rowHeight,
            colWidth,
            rowHeight
          );
        }
      });
    });
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
  width: 300,
  height: 300,
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
  })
)(ColorGraphCanvas);
