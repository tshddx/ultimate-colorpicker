import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ColorAxis.css";
import { ColorAxisCanvasStateful } from "../ColorAxisCanvas/ColorAxisCanvas";
import { isObject } from "util";

const bem = makeBem("ColorAxis");

const ColorAxis = ({ color, setColor, axis }) => {
  const { space, step, steps, round, min, max } = axis;

  const args = space.args(color);
  const realValue = args[axis.key];
  // const nominalValue = color.space === space ? color.args[axis.key] : realValue;
  const nominalValue = realValue;
  // const difference = Math.abs(nominalValue - realValue);
  // const percentDifference = (difference / size) * 100;
  const percentDifference = 0;
  return (
    <div className={classnames(bem())}>
      <div className={classnames(bem("name"))}>{axis.name}</div>
      <div className={classnames(bem("slider"))}>
        <div className={classnames(bem("sliderInput"))}>
          <input
            style={{ width: "100%" }}
            type="range"
            min={min}
            max={max}
            value={nominalValue}
            step={step}
            onChange={event => {
              const value = parseFloat(event.target.value);
              const newArgs = { [axis.key]: value };
              const newColor = space.replace(color, newArgs);
              setColor(newColor);
            }}
          />
        </div>
        <div className={classnames(bem("canvas"))}>
          <ColorAxisCanvasStateful
            color={color}
            axis={axis}
            space={space}
            resolution={steps / 4}
          />
        </div>
      </div>
      <div className={classnames(bem("value"))}>
        {percentDifference > 1 ? (
          <span className={classnames(bem("valueDifference"))}>
            {/* {round(nominalValue, 3)} != {round(realValue, 3)} */}
          </span>
        ) : (
          <span>{round(nominalValue)}</span>
        )}
      </div>
    </div>
  );
};

ColorAxis.propTypes = {
  color: PropTypes.any.isRequired,
  setColor: PropTypes.func.isRequired,
  axis: PropTypes.object.isRequired,
};

ColorAxis.defaultProps = {};

export default ColorAxis;
