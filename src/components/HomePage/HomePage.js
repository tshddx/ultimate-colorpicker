import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./HomePage.css";
import ColorSpace from "../ColorSpace";
import Color from "../../color/Color";
import { compose, withState } from "recompose";
import map from "lodash/map";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const bem = makeBem("HomePage");

const HomePage = ({ color, setColor }) => {
  const hex = color.chromaColor.hex();
  const invalid = !color.isValid();
  const colorSpaces = map(Color, space => {
    return <ColorSpace color={color} setColor={setColor} space={space} />;
  });
  return (
    <div className={classnames(bem())}>
      <div className={classnames(bem("currentColor"))}>
        Color: {hex}
        {invalid && <span>invalid!</span>}
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: hex
          }}
        />
      </div>
      <div className={classnames(bem("colorSpaces"))}>{colorSpaces}</div>
    </div>
  );
};

HomePage.propTypes = {
  color: PropTypes.any.isRequired,
  setColor: PropTypes.func.isRequired
};

HomePage.defaultProps = {
  space: Color.lch
};

export default HomePage;

// const COLOR = Color.lch.make({ l: 50, c: 40, h: 130 });
const COLOR = Color.rgb.make({ r: 250, g: 40, b: 130 });

export const HomePageStateful = compose(withState("color", "setColor", COLOR))(
  HomePage
);
