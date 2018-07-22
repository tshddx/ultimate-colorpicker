import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ColorSpace.css";
import map from "lodash/map";
import ColorAxis from "../ColorAxis";

const bem = makeBem("ColorSpace");

const ColorSpace = ({ color, setColor, space }) => {
  const colorAxes = map(space.axes, (axis, key) => {
    return (
      <ColorAxis
        key={key}
        color={color}
        setColor={setColor}
        space={space}
        axis={axis}
      />
    );
  });
  return (
    <div className={classnames(bem())}>
      <div className={classnames(bem("name"))}>{space.name}</div>
      {/* <div className={classnames(bem("name"))}>
        {JSON.stringify(space.args(color))}
      </div> */}
      {colorAxes}
    </div>
  );
};

ColorSpace.propTypes = {
  color: PropTypes.any.isRequired,
  setColor: PropTypes.func.isRequired,
  space: PropTypes.object.isRequired
};

ColorSpace.defaultProps = {};

export default ColorSpace;
