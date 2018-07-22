import React from 'react';
import renderer from 'react-test-renderer';
import ColorGraphCanvas from './ColorGraphCanvas';

describe('ColorGraphCanvas', () => {
  xit('renders correctly', () => {
    const props = { exampleProp: true };
    const component = renderer.create(<ColorGraphCanvas {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
