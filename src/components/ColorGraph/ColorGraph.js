import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ColorGraph.css";
import { compose, withState } from "recompose";
import Color from "../../color/Color";
import map from "lodash/map";
import { ColorGraphCanvasStateful } from "../ColorGraphCanvas/ColorGraphCanvas";
import { observer } from "mobx-react";

const bem = makeBem("ColorGraph");

const ColorGraph = ({ xAxis, setXAxis, yAxis, setYAxis, color, settings }) => {
  return (
    <div className={classnames(bem())}>
      <div className={classnames(bem("settings"))}>
        <div>
          <input
            type="checkbox"
            checked={settings.fullRes}
            onChange={e => (settings.fullRes = !settings.fullRes)}
          />
          Full res {JSON.stringify(settings.fullRes)}
        </div>
        <div>
          <input
            type="range"
            step={0.1}
            min={0.1}
            max={1}
            value={settings.downsample}
            onChange={event => {
              const value = parseFloat(event.target.value);
              settings.downsample = value;
            }}
          />
          Downsample: {settings.downsample}
        </div>
      </div>
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
        <ColorGraphCanvasStateful
          xAxis={xAxis}
          yAxis={yAxis}
          color={color}
          settings={settings}
        />
      </div>
    </div>
  );
};

ColorGraph.propTypes = {
  xAxis: PropTypes.object.isRequired,
  setXAxis: PropTypes.func.isRequired,
  yAxis: PropTypes.object.isRequired,
  setYAxis: PropTypes.func.isRequired,
  color: PropTypes.object.isRequired,
};

ColorGraph.defaultProps = {};

export const ColorGraphStateful = compose(
  withState("xAxis", "setXAxis", Color.rgb.axes.g),
  withState("yAxis", "setYAxis", Color.rgb.axes.b),
  observer
)(ColorGraph);
