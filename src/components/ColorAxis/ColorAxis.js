import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ColorAxis.css";
import { ColorAxisCanvasStateful } from "../ColorAxisCanvas/ColorAxisCanvas";
import { isObject } from "util";

// 1  2
// 10  1
// 100  0

const bem = makeBem("ColorAxis");

const ColorAxis2 = props => {
  if (!isObject(props)) {
    console.log("badprops", props);
  }
  return (
    <small>
      <pre>{"PROPS: " + JSON.stringify(props, null, 2)}</pre>
    </small>
  );
};

const ColorAxis = ({ color, setColor, axis, space }) => {
  const {
    size,
    step,
    steps,
    round,
    range: [min, max],
    orderOfMagnitude,
    precision
  } = axis;

  const args = space.args(color);
  const realValue = args[axis.key];
  const nominalValue = color.space === space ? color.args[axis.key] : realValue;
  const difference = Math.abs(nominalValue - realValue);
  const percentDifference = (difference / size) * 100;
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
              // console.log("axis key:", axis.key);
              // console.log("value:", JSON.stringify(value));
              // console.log("oldColor:", space.args(color));
              // console.log("newArgs:", newArgs);
              // console.log("newColor:", space.args(newColor));
              setColor(newColor);
            }}
          />
        </div>
        <div className={classnames(bem("canvas"))}>
          <ColorAxisCanvasStateful
            color={color}
            axis={axis}
            space={space}
            resolution={steps}
          />
        </div>
        {/* <div className={classnames(bem("debug"))}>{JSON.stringify(args)}</div> */}
        {/* <div className={classnames(bem("debug"))}>
          <pre>
            <small>
              {JSON.stringify(
                {
                  size,
                  step,
                  steps,
                  orderOfMagnitude,
                  precision
                },
                null,
                2
              )}
            </small>
          </pre>
        </div> */}
      </div>
      <div className={classnames(bem("value"))}>
        {percentDifference > 1 ? (
          <span className={classnames(bem("valueDifference"))}>
            {round(nominalValue, 3)} != {round(realValue, 3)}
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
  space: PropTypes.object.isRequired
};

ColorAxis.defaultProps = {};

export default ColorAxis;
