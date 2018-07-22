import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ColorGraph.css";
import { compose, withState } from "recompose";
import Color from "../../color/Color";
import map from "lodash/map";
import { ColorGraphCanvasStateful } from "../ColorGraphCanvas/ColorGraphCanvas";

const bem = makeBem("ColorGraph");

const ColorGraph = ({ xAxis, setXAxis, yAxis, setYAxis, color }) => {
  return (
    <div className={classnames(bem())}>
      X, Y axis:
      {map(Color, (space, key) => {
        return map(space.axes, axis => {
          return (
            <div>
              <input
                type="radio"
                checked={xAxis === axis}
                onClick={() => setXAxis(axis)}
              />
              <input
                type="radio"
                checked={yAxis === axis}
                onClick={() => setYAxis(axis)}
              />
              {space.name}: {axis.name}
            </div>
          );
        });
      })}
      <div className={classnames(bem("canvas"))}>
        <ColorGraphCanvasStateful xAxis={xAxis} yAxis={yAxis} color={color} />
      </div>
    </div>
  );
};

ColorGraph.propTypes = {
  xAxis: PropTypes.object.isRequired,
  setXAxis: PropTypes.func.isRequired,
  yAxis: PropTypes.object.isRequired,
  setYAxis: PropTypes.func.isRequired,
  color: PropTypes.object.isRequired
};

ColorGraph.defaultProps = {};

export default ColorGraph;

export const ColorGraphStateful = compose(
  withState("xAxis", "setXAxis", Color.lch.axes.h),
  withState("yAxis", "setYAxis", Color.lch.axes.c)
)(ColorGraph);
