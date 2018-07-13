import React from 'react';
import renderer from 'react-test-renderer';
import ColorAxisCanvas from './ColorAxisCanvas';

describe('ColorAxisCanvas', () => {
  xit('renders correctly', () => {
    const props = { exampleProp: true };
    const component = renderer.create(<ColorAxisCanvas {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
