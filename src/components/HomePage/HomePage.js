import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./HomePage.css";
import ColorSpace from "../ColorSpace";
import Color from "../../color/Color";
import { compose, withState } from "recompose";
import map from "lodash/map";
import { ColorGraphStateful } from "../ColorGraph/ColorGraph";

const bem = makeBem("HomePage");

const HomePage = ({ color, setColor, settings }) => {
  const hex = color.chromaColor.hex();
  const invalid = !color.isValid();
  const colorSpaces = map(Color, (space) => {
    return (
      <ColorSpace
        color={color}
        setColor={setColor}
        space={space}
        settings={settings}
      />
    );
  });
  return (
    <div className={classnames(bem())}>
      <div className={classnames(bem("colorSpaces"))}>
        <div className={classnames(bem("currentColor"))}>
          {hex}
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: hex,
            }}
          />
        </div>
        {colorSpaces}
      </div>
      <div className={classnames(bem("graph"))}>
        <ColorGraphStateful color={color} settings={settings} />
      </div>
    </div>
  );
};

HomePage.propTypes = {
  color: PropTypes.any.isRequired,
  setColor: PropTypes.func.isRequired,
};

HomePage.defaultProps = {
  space: Color.lch,
};

export default HomePage;

// const COLOR = Color.rgb.make({ r: 250, g: 40, b: 130 });
const COLOR = Color.lch.make({ l: 52, c: 30, h: 180 });

export const HomePageStateful = compose(withState("color", "setColor", COLOR))(
  HomePage
);
