import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ColorAxisCanvas.css";
import times from "lodash/times";
import chroma from "chroma-js";
import Color from "../../color/Color";
import {
  compose,
  withHandlers,
  withState,
  lifecycle,
  shouldUpdate,
  shallowEqual
} from "recompose";

const bem = makeBem("ColorAxisCanvas");

const INVALID_BAR_HEIGHT = 4;
const INVALID_BAR_GAP = 1;

const ColorAxisCanvas = ({
  color,
  space,
  axis,
  resolution,
  canvas,
  canvasRef,
  width,
  height
}) => {
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const lineWidth = width / resolution;
    const colors = axis.scale(color, resolution);
    colors.forEach((color_, index) => {
      // var grd = ctx.createLinearGradient(0, 0, 200, 0);
      // grd.addColorStop(0, "red");
      // grd.addColorStop(1, "white");

      // // Fill with gradient
      // ctx.fillStyle = grd;

      ctx.fillStyle = color_.chromaColor.hex();
      ctx.fillRect(index * lineWidth, INVALID_BAR_HEIGHT, lineWidth, height);
      if (color_.isValid()) {
        ctx.clearRect(
          index * lineWidth,
          0,
          lineWidth,
          INVALID_BAR_HEIGHT - INVALID_BAR_GAP
        );
      } else {
        ctx.fillStyle = "red";
        ctx.fillRect(
          index * lineWidth,
          0,
          lineWidth,
          INVALID_BAR_HEIGHT - INVALID_BAR_GAP
        );
      }
    });
  }

  return (
    <canvas className={bem()} ref={canvasRef} width={width} height={height} />
  );
};

ColorAxisCanvas.propTypes = {
  color: PropTypes.any.isRequired,
  space: PropTypes.object.isRequired,
  axis: PropTypes.object.isRequired,
  resolution: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  canvas: PropTypes.any,
  canvasRef: PropTypes.func.isRequired
};

ColorAxisCanvas.defaultProps = {
  resolution: 50,
  width: 300,
  height: 20
};

export default ColorAxisCanvas;

export const ColorAxisCanvasStateful = compose(
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
      getCanvas: () => () => canvas_
    };
  }),
  lifecycle({
    componentDidMount() {
      const { getCanvas } = this.props;
      if (getCanvas()) {
        const { setCanvas } = this.props;
        setCanvas(getCanvas());
      }
    }
  })
)(ColorAxisCanvas);
