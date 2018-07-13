import React from "react";
import renderer from "react-test-renderer";
import ColorAxis from "./ColorAxis";

describe("ColorAxis", () => {
  xit("renders correctly", () => {
    const props = { exampleProp: true };
    const component = renderer.create(<ColorAxis {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
