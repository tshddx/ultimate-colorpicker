import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ColorAxis.css";
import round from "lodash/round";
import { ColorAxisCanvasStateful } from "../ColorAxisCanvas/ColorAxisCanvas";

const PRECISION = 2;

const r = x => round(x, PRECISION);

const bem = makeBem("ColorAxis");

const ColorAxis = ({ color, setColor, axis, space }) => {
  const [min, max] = axis.range;
  const args = space.args(color);
  const realValue = args[axis.key];
  const nominalValue = color.space === space ? color.args[axis.key] : realValue;
  return (
    <div className={classnames(bem())}>
      <div style={{ color: color.isValid() ? "black" : "red" }}>
        {axis.name}: {r(nominalValue)}, {r(realValue)}
      </div>
      <div>
        <input
          style={{ width: "100%" }}
          type="range"
          min={min}
          max={max}
          value={nominalValue}
          step="0.5"
          onChange={event => {
            const value = parseFloat(event.target.value);
            const newArgs = { ...color.args[axis.key], [axis.key]: value };
            const newColor = space.replace(color, newArgs);
            // console.log("axis key:", axis.key);
            // console.log("value:", JSON.stringify(value));
            // console.log("oldColor:", space.args(color));
            // console.log("newArgs:", newArgs);
            // console.log("newColor:", space.args(newColor));
            setColor(newColor);
          }}
        />
      </div>
      {/* <div>
        <button
          onClick={() => {
            const value = 105;
            const newArgs = { [axis.key]: value };
            const newColor = space.replace(color, newArgs);
            setColor(newColor);
          }}
        >
          Set to 105
        </button>
      </div> */}
      <div>
        <ColorAxisCanvasStateful color={color} axis={axis} />
      </div>
    </div>
  );
};

ColorAxis.propTypes = {
  color: PropTypes.any.isRequired,
  setColor: PropTypes.func.isRequired,
  axis: PropTypes.object.isRequired,
  space: PropTypes.object.isRequired
};

ColorAxis.defaultProps = {};

export default ColorAxis;
